import { expect, test } from "bun:test";
import { getAllRoutes } from "../../../src/utils";
import { join } from "path";
import { regconv, sort } from "./utils";

test("method paths", async () => {
  const parentPath = join(import.meta.dir, "./methods");
  const res = await getAllRoutes(parentPath);
  expect(res.map(regconv).sort(sort)).toEqual(
    [
      {
        file: join(parentPath, "test.js"),
        func: "put$put",
        method: "put",
        matcher: /\/test\/put$/.toString(),
        paramLocations: [],
        path: "/test",
        lambdaMatcher: "/test/put",
      },
      {
        file: join(parentPath, "test.js"),
        func: "get",
        method: "get",
        matcher: /\/test\/get$/.toString(),
        paramLocations: [],
        path: "/test",
        lambdaMatcher: "/test/get",
      },
      {
        file: join(parentPath, "test.js"),
        func: "any$any",
        method: "any",
        matcher: /\/test\/any$/.toString(),
        paramLocations: [],
        path: "/test",
        lambdaMatcher: "/test/any",
      },
      {
        file: join(parentPath, "test.js"),
        func: "del$delete",
        method: "delete",
        matcher: /\/test\/delete$/.toString(),
        paramLocations: [],
        path: "/test",
        lambdaMatcher: "/test/delete",
      },
      {
        file: join(parentPath, "test.js"),
        func: "pos$post",
        method: "post",
        matcher: /\/test\/post$/.toString(),
        paramLocations: [],
        path: "/test",
        lambdaMatcher: "/test/post",
      },
    ].sort(sort)
  );
});
