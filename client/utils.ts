/** Helper function to return json from a function. */
export function json(
  data?: object,
  params?: { headers?: Record<string, string>; statusCode?: number }
) {
  const statusCode = params?.statusCode ?? 200;
  const headers = { "content-type": "application/json", ...params?.headers };
  return { body: JSON.stringify(data), statusCode, headers };
}
