import { resolve } from "node:path";
import { writeFile } from "node:fs/promises";
import { color, error } from "./console";

export async function getLlrt() {
  const log = (text: string) => {
    console.log(color(" Get LLRT ", "Blue"), text);
  };

  const config = await import("file://" + resolve("./lack.config.js"));
  const path = config.llrt ?? "llrt.zip";

  log("downloading llrt");
  const repoRes = await fetch(
    "https://api.github.com/repos/awslabs/llrt/releases/latest"
  );
  const data: {
    assets: {
      browser_download_url: string;
      name: string;
    }[];
  } = await repoRes.json();

  const correctVersion = data.assets.find(
    (x) => x.name === "llrt-lambda-arm64.zip"
  );
  if (!correctVersion) {
    error(
      "Couldn't download the correct LLRT version, please set up Lack manually"
    );
    return;
  }

  const llrtBin = await fetch(correctVersion.browser_download_url);
  const blob = await llrtBin.blob();
  await writeFile(path, Buffer.from(await blob.arrayBuffer()));
  log("downloaded llrt");
}
