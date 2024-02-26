import { expect, test } from "bun:test";
import { getAllRoutes } from "../../../src/utils";
import { join } from "path";
import { regconv } from "./utils";

test("index paths", async () => {
  const parentPath = join(import.meta.dir, "./index");
  const res = await getAllRoutes(parentPath);
  expect(res.map(regconv)).toEqual([
    {
      file: join(parentPath, "$index.js"),
      func: "$index",
      method: "get",
      matcher: /\/$/.toString(),
      paramLocations: [],
      path: "/$index",
      lambdaMatcher: "/",
    },
  ]);
});
