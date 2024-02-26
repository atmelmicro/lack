import { expect, test } from "bun:test";
import { getAllEntryPoint } from "../../src/utils";
import { join } from "path";

test("method and index", async () => {
  const parentPath = join(import.meta.dir, "./entryPoints");
  expect(await getAllEntryPoint(parentPath)).toEqual(
    ["test.js", "nested/test2.js", "nested/deeper/test3.ts"].map((x) =>
      join(parentPath, x)
    )
  );
});
