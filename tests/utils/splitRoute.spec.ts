import { expect, test } from "bun:test";
import { splitRoute } from "../../src/utils";

test("method and index", () => {
  const path = "put$test__$index";
  expect(splitRoute(path)).toEqual(["test"]);
});

test("normal route", () => {
  const path = "aa__bb__cc";
  expect(splitRoute(path)).toEqual(["aa", "bb", "cc"]);
});

test("matcher route", () => {
  const path = "aa__$bb__cc";
  expect(splitRoute(path)).toEqual(["aa", "$bb", "cc"]);
});

test("index route", () => {
  const path = "$index";
  expect(splitRoute(path)).toEqual([]);
});
