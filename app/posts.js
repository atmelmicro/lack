export async function show__id() {
  return { body: { a: "b" }, statusCode: 200 };
}

export async function show_id() {
  return { body: { a: "b" }, statusCode: 200 };
}

export async function put$update() {
  return { body: { a: "b" }, statusCode: 200 };
}

export async function test__plink__$id__a__$id2(event) {
  return {
    body: JSON.stringify({
      params: event.pathParameters,
      search: event.queryStringParameters,
    }),
    statusCode: 200,
    headers: { "content-type": "application/json" },
  };
}
