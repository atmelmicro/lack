import * as esbuild from "esbuild";

const CLI_SHIM = `#! /usr/bin/env node
// Shim require if needed.
import module from 'module';
if (typeof globalThis.require === "undefined") {
  globalThis.require = module.createRequire(import.meta.url);
}
`;

esbuild.build({
  entryPoints: ["./src/cli.ts"],
  bundle: true,
  outfile: "./build/cli.js",
  platform: "node",
  format: "esm",
  minify: true,
  external: ["aws-cdk-lib", "esbuild", "./lack.config.js"],
  banner: {
    js: CLI_SHIM,
  },
});
