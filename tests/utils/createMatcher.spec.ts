import { expect, test } from "bun:test";
import { createMatcher } from "../../src/utils";

test("normal route", () => {
  const path = "aa__bb";
  expect(createMatcher(path).toString()).toBe("/\\/aa\\/bb$/");
});

test("index", () => {
  const path = "$index";
  expect(createMatcher(path).toString()).toBe("/\\/$/");
});

test("route param", () => {
  const path = "a$b";
  expect(createMatcher(path).toString()).toBe("/\\/a\\/([^/]+)$/");
});

test("route param with space", () => {
  const path = "a__$b";
  expect(createMatcher(path).toString()).toBe("/\\/a\\/([^/]+)$/");
});

test("route param with underscore", () => {
  const path = "a_$b";
  expect(createMatcher(path).toString()).toBe("/\\/a_\\/([^/]+)$/");
});
