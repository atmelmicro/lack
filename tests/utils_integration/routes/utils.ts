export function regconv(res: any): any {
  // todo: fix types
  res.matcher = res.matcher.toString();
  return res;
}

export const sort = (a: { method: string }, b: { method: string }) =>
  a.method.localeCompare(b.method);
