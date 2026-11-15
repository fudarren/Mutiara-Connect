import assert from "node:assert/strict";
import test from "node:test";
import { userHome } from "../lib/session.ts";

const publicUser = { username: "public", name: "Ahmad Rahman", role: "public" };
const adminUser = { username: "admin", name: "Priya Nair", role: "admin" };

test("sign-in resumes the complaint or preferences page for either account role", () => {
  for (const user of [publicUser, adminUser]) {
    for (const destination of ["/feedback", "/notification-preferences"]) {
      assert.equal(userHome(user, destination), destination);
    }
  }
});

test("untrusted return destinations cannot override the role landing page", () => {
  for (const destination of [
    "https://example.com",
    "//example.com",
    "javascript:alert(1)",
    "/admin",
    "/feedback/../admin",
    "/feedback?next=https://example.com",
  ]) {
    assert.equal(userHome(publicUser, destination), "/");
    assert.equal(userHome(adminUser, destination), "/admin");
  }
});
