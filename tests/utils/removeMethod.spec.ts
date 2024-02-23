import { expect, test } from "bun:test";
import { removeMethod } from "../../src/utils";

test("dont delete in the middle of path", () => {
  const path = "should/$not/$del/ete";
  expect(removeMethod(path)).toBe(path);
});

test("delete normal paths", () => {
  const paths = ["del$a", "pos$a", "put$a"];

  paths.forEach((x) => expect(removeMethod(x)).toBe("a"));
});

test("dont change normal path", () => {
  const path = "hello/world/$index";
  expect(removeMethod(path)).toBe(path);
});

test("dont change index named route", () => {
  const path = "del$index";
  expect(removeMethod(path)).toBe("index");
});

test("dont change index route", () => {
  const path = "del$$index";
  expect(removeMethod(path)).toBe("$index");
});
