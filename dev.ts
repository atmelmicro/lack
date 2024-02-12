import { build } from "./build";
import { getAllRoutes, splitRoute } from "./utils";

const routes = await getAllRoutes();
console.log("starting dev server with the routes");
for (const route of routes) {
  console.log(route);
}
console.log("at localhost:2222");

await build();

Bun.serve({
  port: 2222,
  async fetch(request, server) {
    const url = new URL(request.url);
    console.log(url.pathname);
    const path = routes.find(
      (x) =>
        x.matcher.test(url.pathname) &&
        x.method === request.method.toLowerCase()
    );
    if (!path) return new Response("not found", { status: 404 });

    const split = url.pathname.split("/").filter((x) => x);
    const pathParameters = path.paramLocations.map(({ i, name }) => ({
      [name]: split[i],
    }));
    const search: Record<string, string> = {};

    for (const [key, val] of url.searchParams.entries()) {
      search[key] = val;
    }
    const event = { pathParameters, queryStringParameters: search };

    const module = await import(path.file);
    const res = await module[path.func](event);
    let { body, headers } = res;

    if (typeof body === "object") {
      body = JSON.stringify(body);
      if (!headers) headers = {}; // init if headers arent provided
      headers["content-type"] = "application/json";
    }

    return new Response(body, {
      status: res.statusCode ?? 200,
      headers: headers,
    });
  },
});
