import { expect, test } from "bun:test";
import { cleanUpRoute } from "../../src/utils";

test("dont remove anything not related to cleanup", () => {
  const path = "hello/world_this";
  expect(cleanUpRoute(path)).toBe(path);
});

test("with method", () => {
  const path = "put$hello/world_this";
  expect(cleanUpRoute(path)).toBe("hello/world_this");
});

test("underscores split paths", () => {
  const path = "path__a";
  expect(cleanUpRoute(path)).toBe("path/a");
});

test("index route", () => {
  const path = "$index";
  expect(cleanUpRoute(path)).toBe("/");
});

test("index route", () => {
  const path = "$index__$index";
  expect(cleanUpRoute(path)).toBe("/");
});

test("index route", () => {
  const path = "$index$index";
  expect(cleanUpRoute(path)).toBe("/");
});

test("index route with method", () => {
  const path = "put$$index";
  expect(cleanUpRoute(path)).toBe("/");
});

test("index route with non existant method", () => {
  const path = "get$$index";
  expect(cleanUpRoute(path)).toBe("get$");
});

test("deep index", () => {
  const path = "test__$index";
  expect(cleanUpRoute(path)).toBe("test/");
});

test("deep index with method", () => {
  const path = "put$test__$index";
  expect(cleanUpRoute(path)).toBe("test/");
});
