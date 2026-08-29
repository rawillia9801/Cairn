import type { JsonValue } from "./types";

function canonicalizeNumber(value: number): string {
  if (!Number.isFinite(value)) {
    throw new TypeError("Cairn canonicalization rejects non-finite numbers.");
  }

  return JSON.stringify(Object.is(value, -0) ? 0 : value);
}

export function canonicalizeJson(value: JsonValue): string {
  if (value === null) {
    return "null";
  }

  switch (typeof value) {
    case "string":
      return JSON.stringify(value);
    case "number":
      return canonicalizeNumber(value);
    case "boolean":
      return value ? "true" : "false";
    case "object": {
      if (Array.isArray(value)) {
        return `[${value.map((item) => canonicalizeJson(item)).join(",")}]`;
      }

      const keys = Object.keys(value).sort();
      const entries = keys.map(
        (key) => `${JSON.stringify(key)}:${canonicalizeJson(value[key])}`,
      );

      return `{${entries.join(",")}}`;
    }
    default:
      throw new TypeError("Cairn canonicalization accepts JSON values only.");
  }
}
