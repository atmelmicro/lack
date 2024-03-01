import { deploy as cdkDeploy } from "./deploy";
import { argv } from "node:process";
import { startDev } from "./dev";
import { writeFile, mkdir, watch } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "./cli/build";
import { color, error, warn, withHeading } from "./cli/console";
import { cliParser } from "./cli/parser";

async function main() {
  const params = cliParser(argv);
  if (!params) return;
  await params.fn();
}

main();
