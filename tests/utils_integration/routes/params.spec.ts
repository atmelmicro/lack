import { expect, test } from "bun:test";
import { getAllRoutes } from "../../../src/utils";
import { join } from "path";
import { regconv, sort } from "./utils";

test("paths with params", async () => {
  const parentPath = join(import.meta.dir, "./params");
  const res = await getAllRoutes(parentPath);
  expect(res.map(regconv).sort(sort)).toEqual(
    [
      {
        file: join(parentPath, "$a/test.js"),
        func: "a",
        method: "get",
        matcher: /\/([^/]+)\/test\/a$/.toString(),
        paramLocations: [{ name: "a", i: 0 }],
        path: "/$a/test",
        lambdaMatcher: "/{a}/test/a",
      },
    ].sort(sort)
  );
});
