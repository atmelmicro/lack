import { expect, test } from "bun:test";
import { createLambdaMatcher } from "../../src/utils";

test("normal route", () => {
  const path = "aa__bb";
  expect(createLambdaMatcher(path).toString()).toBe("/aa/bb");
});

test("index", () => {
  const path = "$index";
  expect(createLambdaMatcher(path).toString()).toBe("/");
});

test("route param", () => {
  const path = "a$b";
  expect(createLambdaMatcher(path).toString()).toBe("/a/{b}");
});

test("route param with space", () => {
  const path = "a__$b";
  expect(createLambdaMatcher(path).toString()).toBe("/a/{b}");
});

test("route param with underscore", () => {
  const path = "a_$b";
  expect(createLambdaMatcher(path).toString()).toBe("/a_/{b}");
});
