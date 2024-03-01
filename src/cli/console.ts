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

export function color(text: string, color: keyof typeof colors) {
  return `${colors[color]}${text}${colors.Reset}`;
}

export function withHeading(
  text: string,
  heading: string,
  color: keyof typeof colors
) {
  return `${colors[color]} ${heading} ${colors.Reset} ${text}`;
}

export function error(...text: string[]) {
  console.log(
    withHeading(
      text.reduce((acc, x) => `${acc}${x}`, ""),
      "ERROR",
      "Red"
    )
  );
}

export function warn(...text: string[]) {
  console.log(
    withHeading(
      text.reduce((acc, x) => `${acc}${x}`, ""),
      "WARN",
      "Yellow"
    )
  );
}
