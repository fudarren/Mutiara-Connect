import assert from "node:assert/strict";
import test from "node:test";
import { alignmentSegments, officialStations } from "../lib/officialMutiara.ts";

test("the mainland branches at Macallum, without a false KOMTAR–mainland edge", () => {
  const station = (id) => officialStations.find((s) => s.stationId === id).location.coordinates;
  const mainland = alignmentSegments.find((s) => s.id === "mainland").coordinates;
  assert.deepEqual(mainland[0], station("S19"));
  assert.deepEqual(mainland.at(-1), station("S31"));
  assert.ok(!mainland.some((point) => JSON.stringify(point) === JSON.stringify(station("S20"))));
  assert.equal(officialStations.filter((s) => !s.provisional).length, 20);
  assert.deepEqual(officialStations.filter((s) => s.provisional).map((s) => s.stationId), ["A01", "S30"]);
  assert.ok(!officialStations.some((s) => /weld quay/i.test(s.name)));
});

