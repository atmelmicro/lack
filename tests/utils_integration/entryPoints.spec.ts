import { expect, test } from "bun:test";
import { getAllEntryPoint } from "../../src/utils";
import { join } from "path";

/*
todo: this crashes on windows
test("method and index", async () => {
  console.log("aaaaaaaa", join(import.meta.dir, "./entryPoints"));
  expect(
    await getAllEntryPoint(
      "C:\\Users\\David\\Documents\\lack\\tests\\utils_integration\\entryPoints"
    )
  ).toEqual(["test.js", "nested/test2.js", "nested/deep/test.ts"]);
});*/
