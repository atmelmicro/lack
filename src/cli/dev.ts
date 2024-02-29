import { writeFile, mkdir, watch } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "./build";
import { color, error, warn, withHeading } from "./console";
import { type LogFunction } from "./parser";
import { startDev } from "../dev";

const debounce = 100;
let lastTrigger = -Infinity;

export async function watchApp(log: LogFunction) {
  const watcher = watch(resolve("./app"), { recursive: true });
  for await (const event of watcher) {
    if (lastTrigger + debounce > Date.now()) continue;
    lastTrigger = Date.now();
    const start = Date.now();
    log("Rebuilding...");
    await build();
    log(`Rebuilt in ${Date.now() - start} ms`);
  }
}

export async function dev() {
  const log = (...text: string[]) => {
    console.log(
      withHeading(
        text.reduce((acc, x) => `${acc}${x}`, ""),
        "Dev",
        "Magenta"
      )
    );
  };

  await build();
  watchApp(log);
  await startDev(log);
}
