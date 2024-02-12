import * as esbuild from "esbuild";
import { getAllEntryPoint, getAllRoutes } from "./utils";
import { mkdir, copyFile } from "fs/promises";
import { extname, join } from "path";

export async function generateLambda() {
  const routes = await getAllEntryPoint("./out");
  const base = "./lambda";
  for (const route of routes) {
    const folder = join(base, route.slice(5, -extname(route).length));
    await mkdir(folder, { recursive: true });
    copyFile(route, join(folder, "index.js"));
  }
}

export async function build() {
  const entries = await getAllEntryPoint("./app");

  await esbuild.build({
    entryPoints: entries,
    bundle: true,
    outdir: "./out",
    platform: "node",
    target: "es2020",
    format: "esm",
    minify: true,
  });
}

async function generateDeployScript() {
  await esbuild.build({
    entryPoints: ["deploy.ts"],
    bundle: true,
    outfile: "./deploy.js",
    platform: "node",
    format: "esm",
    minify: true,
    external: ["aws-cdk-lib"],
  });
}

async function main() {
  console.log("bundeling routes...");
  await build();
  console.log("creating lambda sources...");
  await generateLambda();
  console.log("bulding aws deploy script...");
  await generateDeployScript();
}

main();
