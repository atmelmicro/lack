import { build } from "./build";
import { error, warn } from "./console";
import { dev } from "./dev";
import { getLlrt } from "./get_llrt";
import { newApp } from "./new_app";
import { deploy } from "./deploy";

export type LogFunction = (...text: string[]) => void;
export type Command = {
  title: string;
  props: { name: string; required: boolean; hasValue: boolean }[];
  fn: () => any;
};

const commands: Command[] = [
  {
    title: "deploy",
    props: [],
    fn: deploy,
  },
  {
    title: "build",
    props: [],
    fn: build,
  },
  {
    title: "dev",
    props: [],
    fn: dev,
  },
  {
    title: "create",
    props: [],
    fn: newApp,
  },
  {
    title: "get-llrt",
    props: [],
    fn: getLlrt,
  },
];

export function cliParser(args: string[]) {
  args.splice(0, 2); // todo this might not the best idea
  const commandName = args[0];
  if (!commands.map((x) => x.title).includes(commandName)) {
    error("avalible commands are: ", ...commands.map((x) => `"${x.title}" `));
    return;
  }

  // finish parsing command
  args.splice(0, 1);
  const command = commands.find((x) => x.title === commandName);
  if (!command) throw new Error("couldnt find command");

  // parse props
  const props: { name: string; value?: string }[] = [];
  for (const prop of args) {
    // confrim proper formating of prop
    if (!prop.startsWith("--")) {
      error("props have to start with --");
      return;
    }
    const propSlice = prop.slice(2).split("=");
    const setProp = command.props.find((x) => x.name === propSlice[0]);
    if (!setProp) {
      error(
        "invalid prop, avalible ones are: ",
        ...command.props.map((x) => `"${x.name}" `)
      );
      return;
    }

    // if the props is set as it needs a value
    if (setProp.hasValue) {
      if (propSlice.length !== 2) {
        error(
          `the prop ${setProp.name} has a value, please provide it by doing --prop=value`
        );
        return;
      }

      props.push({ name: setProp.name, value: propSlice[1] });
      continue;
    }
    if (propSlice.length === 2 && !setProp.hasValue)
      warn(
        `you passed a value to the prop "${setProp.name}" that actaully doesnt need it`
      );

    props.push({ name: setProp.name });
  }

  for (const required of command.props
    .filter((x) => x.required)
    .map((x) => x.name)) {
    if (!props.map((x) => x.name).includes(required)) {
      error(`the prop "${required}" needs to be set`);
      return;
    }
  }
  return { name: command.title, props, fn: command.fn } as const;
}
