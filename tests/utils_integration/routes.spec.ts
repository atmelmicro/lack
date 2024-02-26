import { expect, test } from "bun:test";
import { getAllRoutes } from "../../src/utils";
import { join } from "path";

test("routes test", async () => {
  const parentPath = join(import.meta.dir, "./entryPoints");
  expect(await getAllRoutes(parentPath)).toEqual([]);
});
