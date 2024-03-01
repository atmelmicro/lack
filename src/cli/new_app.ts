import { color } from "./console";
import { writeFile, mkdir } from "node:fs/promises";
import { getLlrt } from "./get_llrt";

const sampleConfig = `export const name = "example-app"
export const llrt = "./llrt.zip"
`;

const sampleGitignore = `./llrt.zip
out/
node_modules/`;

const samplePackage = {
  type: "module",
  name: "example-app",
  version: "0.1.0",
  devDependencies: {
    lackFrw: "^0.1.0",
  },
  scripts: {
    dev: "lack-frw dev",
    build: "lack-frw build",
    deploy: "lack-frw deploy",
  },
};

// copied from bun init - might need to change
const sampleTsConfig = {
  compilerOptions: {
    lib: ["ESNext"],
    target: "ESNext",
    module: "ESNext",
    moduleDetection: "force",
    jsx: "react-jsx",
    allowJs: true,

    moduleResolution: "bundler",
    allowImportingTsExtensions: true,
    verbatimModuleSyntax: true,
    noEmit: true,

    strict: true,
    skipLibCheck: true,
    noFallthroughCasesInSwitch: true,
  },
};

export async function newApp() {
  const log = (text: string) => {
    console.log(color(" Create ", "Gray"), text);
  };

  await getLlrt();

  log("creating new lack app");
  log("generating config, gitignore, package.json and tsconfig");
  await writeFile(".gitignore", sampleGitignore);
  await writeFile("lack.config.js", sampleConfig);
  await writeFile("package.json", JSON.stringify(samplePackage, undefined, 4));
  await writeFile(
    "tsconfig.json",
    JSON.stringify(sampleTsConfig, undefined, 4)
  );

  await mkdir("./app");
  log("done");
}
