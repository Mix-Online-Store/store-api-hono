import crypto from "node:crypto";

export function createHash(value: string) {
  return crypto.createHash("md5").update(value).digest("hex");
}
