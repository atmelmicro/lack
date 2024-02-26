import { expect, test } from "bun:test";
import { getAllRoutes } from "../../../src/utils";
import { join } from "path";
import { regconv, sort } from "./utils";

test("nested paths", async () => {
  const parentPath = join(import.meta.dir, "./nested");
  const res = await getAllRoutes(parentPath);
  expect(res.map(regconv).sort(sort)).toEqual(
    [
      {
        file: join(parentPath, "a/test.js"),
        func: "a",
        method: "get",
        matcher: /\/a\/test\/a$/.toString(),
        paramLocations: [],
        path: "/a/test",
        lambdaMatcher: "/a/test/a",
      },
      {
        file: join(parentPath, "a/b/test.js"),
        func: "b",
        method: "get",
        matcher: /\/a\/b\/test\/b$/.toString(),
        paramLocations: [],
        path: "/a/b/test",
        lambdaMatcher: "/a/b/test/b",
      },
    ].sort(sort)
  );
});
