import { readdir } from "fs/promises";
import { extname, resolve } from "path";

export async function getAllEntryPoint(path: string): Promise<string[]> {
  const res = await readdir(path, { withFileTypes: true });
  if (res.length === 0) return [];
  const files = res
    .filter((x) => !x.isDirectory() || x.name.startsWith("_"))
    .map((x) => `${path}/${x.name}`);
  const recurse = (
    await Promise.all(
      res
        .filter((x) => x.isDirectory())
        .map((x) => getAllEntryPoint(`${path}/${x.name}`))
    )
  ).flat();
  return [...files, ...recurse];
}

const methods = {
  pos$: "post",
  del$: "delete",
  put$: "put",
};

export function removeMethod(funcName: string) {
  if (
    Object.keys(methods).find((x) => funcName.slice(0, 4) === x) !== undefined
  )
    return funcName.slice(4);
  return funcName;
}

export function cleanUpRoute(route: string) {
  const hasMethod =
    Object.keys(methods).find((x) => route.slice(0, 4) === x) !== undefined;
  if (hasMethod) route = route.slice(4);
  if (route.endsWith("$index")) route = route.slice(0, -6);
  return route.replaceAll("__", "/");
}

export function splitRoute(route: string) {
  const clean = cleanUpRoute(route);
  const split = clean
    .split("/")
    .map((x) => x.split(/(?=\$)/))
    .flat()
    .filter((x) => x);
  return split;
}

export function createMatcher(route: string) {
  const split = splitRoute(route);
  const path = split
    .map((x) => {
      if (x.startsWith("$")) return "([^/]+)";
      return x;
    })
    .join("/");
  return new RegExp("/" + path + "$");
}

export function createLambdaMatcher(route: string) {
  const split = splitRoute(route);
  return (
    "/" +
    split.map((x) => (x.startsWith("$") ? `{${x.slice(1)}}` : x)).join("/")
  );
}

export function paramLocations(route: string) {
  const split = splitRoute(route);
  const arr: { i: number; name: string }[] = [];
  split.forEach((seg, i) => {
    if (seg.startsWith("$")) arr.push({ i, name: seg.slice(1) });
  });
  return arr;
}

const base = "./out/build";
export async function getAllRoutes() {
  const entries = await getAllEntryPoint(base);
  return (
    await Promise.all(
      entries.map((file) =>
        import("file://" + resolve(file)).then((functions) =>
          Object.keys(functions).map((functionName) => {
            const path = file.slice(base.length, -extname(file).length);
            const fullPath = `${path}/${removeMethod(functionName)}`;

            return {
              file,
              func: functionName,
              method:
                methods[functionName.slice(0, 4) as keyof typeof methods] ??
                "get",
              matcher: createMatcher(fullPath),
              paramLocations: paramLocations(fullPath),
              path,
              lambdaMatcher: createLambdaMatcher(fullPath),
            };
          })
        )
      )
    )
  ).flat();
}
