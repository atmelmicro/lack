const commands = [
  {
    title: "deploy",
    props: [
      { name: "where", hasValue: true, required: true },
      { name: "a", hasValue: true },
      { name: "b", hasValue: false },
    ],
  },
  { title: "build", props: [] },
  { title: "dev", props: [] },
];

const colors = {
  Black: "\x1b[40m",
  Red: "\x1b[41m",
  Green: "\x1b[42m",
  Yellow: "\x1b[43m",
  Blue: "\x1b[44m",
  Magenta: "\x1b[45m",
  Cyan: "\x1b[46m",
  White: "\x1b[47m",
  Gray: "\x1b[100m",
  Reset: "\x1b[0m",
};

function color(text: string, color: keyof typeof colors) {
  return `${colors[color]}${text}${colors.Reset}`;
}

function withHeading(
  text: string,
  heading: string,
  color: keyof typeof colors
) {
  return `${colors[color]} ${heading} ${colors.Reset} ${text}`;
}

function error(...text: string[]) {
  console.log(
    withHeading(
      text.reduce((acc, x) => `${acc}${x}`, ""),
      "ERROR",
      "Red"
    )
  );
}

function warn(...text: string[]) {
  console.log(
    withHeading(
      text.reduce((acc, x) => `${acc}${x}`, ""),
      "WARN",
      "Yellow"
    )
  );
}

function cliParser(args: string[]) {
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
  return [command.title, props] as const;
}

console.log(cliParser(Bun.argv));
