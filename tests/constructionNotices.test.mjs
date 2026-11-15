import assert from "node:assert/strict";
import test from "node:test";
import { constructionNotices, publishedTrafficStatus, CONSTRUCTION_AS_OF } from "../lib/constructionNotices.ts";
import { legacySeedUpdates } from "../lib/legacyConstructionUpdates.ts";
import { migrateConstructionUpdates } from "../lib/constructionMigration.ts";

test("published traffic restrictions are independent of work type and do not imply reopening", () => {
  const utilities = constructionNotices.find((u) => u.workType === "Utility Relocation");
  assert.equal(publishedTrafficStatus(utilities, CONSTRUCTION_AS_OF), "Partially open");
  assert.equal(publishedTrafficStatus(utilities, "2026-11-03"), "Scheduled");
  assert.equal(publishedTrafficStatus(utilities, "2026-11-04"), "Partially open");
  assert.equal(publishedTrafficStatus(utilities, "2026-12-31"), "Partially open");
  assert.equal(publishedTrafficStatus(utilities, "2027-01-01"), "Notice ended");
  const diversion = constructionNotices.find((u) => u.updateId === "mrt-ta01571");
  assert.equal(publishedTrafficStatus(diversion, CONSTRUCTION_AS_OF), "Diversion");
  assert.equal(publishedTrafficStatus(diversion, "2026-12-01"), "Notice ended");
});

test("migration removes untouched fixtures without losing staff changes or reusing notice IDs", () => {
  const reordered = Object.fromEntries(Object.entries(legacySeedUpdates[0]).reverse());
  const edited = { ...legacySeedUpdates[1], title: "Staff correction" };
  const draft = { ...legacySeedUpdates[2], isPublished: false };
  const added = { ...legacySeedUpdates[0], updateId: "cu-099", title: "Staff-created work" };
  const stored = [reordered, edited, draft, ...legacySeedUpdates.slice(3), added];
  const backup = JSON.stringify(stored);
  const migrated = migrateConstructionUpdates(stored, legacySeedUpdates, constructionNotices);
  assert.equal(migrated.length, constructionNotices.length + 3);
  assert.ok(migrated.includes(edited));
  assert.ok(migrated.includes(draft));
  assert.ok(migrated.includes(added));
  assert.ok(!migrated.some((u) => u.updateId === legacySeedUpdates[0].updateId));
  assert.equal(JSON.stringify(stored), backup);
  assert.deepEqual(migrateConstructionUpdates(migrated, legacySeedUpdates, constructionNotices), migrated);
});

test("sourced notices retain date/geometry limits without invented routes, and flag the impact as a team estimate", () => {
  assert.equal(new Set(constructionNotices.map((u) => u.updateId)).size, constructionNotices.length);
  for (const u of constructionNotices) {
    assert.match(new URL(u.source.url).hostname, /(^|\.)mymrt\.com\.my$/);
    assert.equal(u.source.reviewedOn, CONSTRUCTION_AS_OF);
    assert.equal(u.geometryAccuracy, "approximate");
    assert.ok(["Low", "Moderate", "High"].includes(u.impactLevel));
    assert.equal(u.impactBasis, "team-assessed");
    assert.equal(u.detourRoutes, null);
    assert.equal(u.pedestrianRoutes, null);
    assert.ok(u.startDate <= u.endDate);
    const ring = u.affectedArea.coordinates[0];
    assert.deepEqual(ring[0], ring.at(-1));
    for (const [lng, lat] of ring) assert.ok(lng > 100.2 && lng < 100.4 && lat > 5.2 && lat < 5.5);
  }
});
