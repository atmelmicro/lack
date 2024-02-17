import { getAllRoutes } from "./utils";
import { Hono } from "hono";
import { withHeading } from "./cli";
import { serve } from "@hono/node-server";

function log(...text: string[]) {
  console.log(
    withHeading(
      text.reduce((acc, x) => `${acc}${x}`, ""),
      "Dev",
      "Magenta",
    ),
  );
}

export async function startDev() {
  const routes = await getAllRoutes();
  log("Starting dev server");
  for (const route of routes) {
    log("Registering route - ", route.lambdaMatcher);
  }
  log("on http://localhost:2222");

  const app = new Hono();

  // handler
  app.all("*", async (c) => {
    const request = c.req;
    const url = new URL(request.url);
    const path = routes.find(
      (x) =>
        x.matcher.test(url.pathname) &&
        x.method === request.method.toLowerCase(),
    );
    log("got request at ", url.pathname);
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

    return new Response(body, {
      status: res.statusCode ?? 200,
      headers: headers,
    });
  });

  serve({ port: 2222, fetch: app.fetch });
}
