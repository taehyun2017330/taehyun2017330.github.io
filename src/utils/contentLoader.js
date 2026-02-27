import { parse } from "yaml";

export async function loadYamlContent(path, fallback = []) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      return fallback;
    }

    const text = await response.text();
    const parsed = parse(text);
    return parsed ?? fallback;
  } catch (error) {
    return fallback;
  }
}
