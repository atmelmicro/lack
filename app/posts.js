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
  console.log(event);
  return { body: { a: "b" }, statusCode: 200 };
}
