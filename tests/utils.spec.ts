import { expect, test } from "bun:test";
import { removeMethod } from "../src/utils";

test("dont delete in the middle of path", () => {
  const path = "should/$not/$del/ete";
  expect(removeMethod(path)).toBe(path);
});
