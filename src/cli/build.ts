import { bundleAll } from "../build";
import { color } from "./console";

export async function build() {
  const log = (text: string) => {
    console.log(color(" Build ", "Blue"), text);
  };

  log("bulding app from ./app");
  const routes = await bundleAll();
  routes.forEach((x) => log(`created route ${x}`));
}
