import { expect, test } from "bun:test";
import { getAllRoutes } from "../../../src/utils";
import { join } from "path";

test("empty folder", async () => {
  const parentPath = join(import.meta.dir, "./empty");
  expect(await getAllRoutes(parentPath)).toEqual([]);
});

test("empty file", async () => {
  const parentPath = join(import.meta.dir, "./empty_file");
  expect(await getAllRoutes(parentPath)).toEqual([]);
});
