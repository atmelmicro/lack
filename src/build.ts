import * as esbuild from "esbuild";
import { getAllEntryPoint, getAllRoutes } from "./utils";
import { mkdir, copyFile, rm } from "fs/promises";
import { extname, join } from "path";

const base = "./out/lambda";
export async function generateLambda() {
  const routes = await getAllEntryPoint("./out/build");
  for (const route of routes) {
    const folder = join(base, route.slice(base.length, -extname(route).length));
    await mkdir(folder, { recursive: true });
    copyFile(route, join(folder, "index.js"));
  }
}

export async function build() {
  const entries = await getAllEntryPoint("./app");
  // clear out folder
  await rm("./out/", { recursive: true }).catch();

  await esbuild.build({
    entryPoints: entries,
    bundle: true,
    outdir: "./out/build",
    platform: "node",
    target: "es2020",
    format: "esm",
    minify: true,
    external: ["@aws-sdk"],
  });

  const duplicates: string[] = [];
  const seen: string[] = [];
  (await getAllRoutes())
    .map((x) => x.method + "-" + x.lambdaMatcher)
    .forEach((x) => {
      if (seen.includes(x) && !duplicates.includes(x)) duplicates.push(x);
      else seen.push(x);
    });
  if (duplicates.length !== 0) {
    throw new Error("duplicate routes " + duplicates);
  }

  return seen;
}

export async function bundleAll() {
  const routes = await build();
  await generateLambda();
  return routes;
}
