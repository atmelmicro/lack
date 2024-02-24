import { expect, test } from "bun:test";
import { paramLocations } from "../../src/utils";

test("normal route", () => {
  const path = "aa__$bb";
  expect(paramLocations(path)).toEqual([
    {
      i: 1,
      name: "bb",
    },
  ]);
});

test("without parmas", () => {
  const path = "aa__bb";
  expect(paramLocations(path)).toEqual([]);
});

test("index is ignored", () => {
  const path = "aa__$index";
  expect(paramLocations(path)).toEqual([]);
});
