import { build } from "./build";
import { color } from "./console";
import { deploy as cdkDeploy } from "../deploy";

export async function deploy() {
  const log = (text: string) => {
    console.log(color(" Deploy ", "Green"), text);
  };

  log("starting deploying app");
  await build();
  log("done building, starting deploy");
  cdkDeploy();
}
