export function encodeId(id: string) {
  return Buffer.from(id).toString("base64");
}

export function decodeId(hash: string) {
  return Buffer.from(hash, "base64").toString("utf-8");
}
