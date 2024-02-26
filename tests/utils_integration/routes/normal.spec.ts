import { expect, test } from "bun:test";
import { getAllRoutes } from "../../../src/utils";
import { join } from "path";
import { regconv, sort } from "./utils";

test("normal path", async () => {
  const parentPath = join(import.meta.dir, "./normal");
  const res = await getAllRoutes(parentPath);
  expect(res.map(regconv).sort(sort)).toEqual(
    [
      {
        file: join(parentPath, "test.js"),
        func: "test",
        method: "get",
        matcher: /\/test\/test$/.toString(),
        paramLocations: [],
        path: "/test",
        lambdaMatcher: "/test/test",
      },
    ].sort(sort)
  );
});
