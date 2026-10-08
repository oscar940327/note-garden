import { describe, expect, it } from "vitest";
import { resolveGraphSlug } from "./graph.helpers";

describe("resolveGraphSlug", () => {
  it("prefers the canonical page slug under a nested base path", () => {
    expect(resolveGraphSlug("index", "note-garden", "/note-garden")).toBe("index");
  });

  it("keeps a canonical note slug unchanged", () => {
    expect(resolveGraphSlug("projects/graph", "note-garden/projects/graph", "/note-garden")).toBe(
      "projects/graph",
    );
  });

  it("falls back to URL parsing and removes the base path when the page has no slug", () => {
    expect(resolveGraphSlug(undefined, "note-garden/projects/graph", "/note-garden")).toBe(
      "projects/graph",
    );
  });

  it("leaves the URL slug untouched when it is outside the base path", () => {
    expect(resolveGraphSlug(undefined, "projects/graph", "/note-garden")).toBe("projects/graph");
  });
});
