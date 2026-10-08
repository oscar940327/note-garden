import { describe, expect, it } from "vitest";
import {
  countGraphDegrees,
  filterGraphEdges,
  resolveGraphMaxNodes,
  resolveGraphSlug,
  selectGraphNodeIds,
  shouldIncludeGraphNode,
  shouldShowGraphLabel,
  type GraphEdge,
} from "./graph.helpers";

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

describe("resolveGraphMaxNodes", () => {
  it("accepts positive integer limits and -1 for no limit", () => {
    expect(resolveGraphMaxNodes(12)).toBe(12);
    expect(resolveGraphMaxNodes(-1)).toBe(-1);
  });

  it.each([undefined, null, 0, -2, 1.5, "50", Number.NaN])(
    "uses the default limit for invalid value %s",
    (value) => {
      expect(resolveGraphMaxNodes(value)).toBe(50);
    },
  );
});

describe("selectGraphNodeIds", () => {
  it("keeps the most-connected candidates within the limit", () => {
    const nodes = ["low", "hub", "mid", "highest"];
    const edges: GraphEdge[] = [
      { source: "highest", target: "hub" },
      { source: "highest", target: "mid" },
      { source: "highest", target: "low" },
      { source: "hub", target: "mid" },
    ];

    expect(selectGraphNodeIds(nodes, edges, "missing", 2)).toEqual(["highest", "hub"]);
  });

  it("keeps the current page even when it has fewer links than other candidates", () => {
    const nodes = ["current", "hub", "other-a", "other-b"];
    const edges: GraphEdge[] = [
      { source: "hub", target: "other-a" },
      { source: "hub", target: "other-b" },
    ];

    expect(selectGraphNodeIds(nodes, edges, "current", 2)).toEqual(["current", "hub"]);
  });

  it("breaks equal-degree ties by slug, regardless of candidate order", () => {
    const edges: GraphEdge[] = [
      { source: "middle", target: "zeta" },
      { source: "middle", target: "beta" },
      { source: "middle", target: "alpha" },
    ];

    expect(selectGraphNodeIds(["zeta", "beta", "middle", "alpha"], edges, "missing", 3)).toEqual([
      "middle",
      "alpha",
      "beta",
    ]);
    expect(selectGraphNodeIds(["alpha", "middle", "beta", "zeta"], edges, "missing", 3)).toEqual([
      "middle",
      "alpha",
      "beta",
    ]);
  });

  it("keeps every candidate when the limit is -1", () => {
    const nodes = Array.from({ length: 55 }, (_, index) => `node-${index}`);

    expect(selectGraphNodeIds(nodes, [], "missing", -1)).toHaveLength(55);
  });

  it("falls back to 50 nodes when the configured limit is invalid", () => {
    const nodes = Array.from(
      { length: 51 },
      (_, index) => `node-${index.toString().padStart(2, "0")}`,
    );
    const selected = selectGraphNodeIds(nodes, [], "node-50", 0);

    expect(selected).toHaveLength(50);
    expect(selected).toContain("node-50");
  });
});

describe("graph edge and label behavior", () => {
  it("excludes tag-page nodes when tag nodes are disabled", () => {
    expect(shouldIncludeGraphNode("projects/graph", false)).toBe(true);
    expect(shouldIncludeGraphNode("tags/ai", false)).toBe(false);
    expect(shouldIncludeGraphNode("tags/ai", true)).toBe(true);
  });

  it("counts candidate links for each node", () => {
    const degrees = countGraphDegrees(
      ["a", "b", "c"],
      [
        { source: "a", target: "b" },
        { source: "a", target: "c" },
      ],
    );

    expect([...degrees.entries()]).toEqual([
      ["a", 2],
      ["b", 1],
      ["c", 1],
    ]);
  });

  it("does not count links that leave the full candidate graph", () => {
    const degrees = countGraphDegrees(["a"], [{ source: "a", target: "outside" }]);

    expect(degrees.get("a")).toBe(0);
  });

  it("removes edges unless both endpoint nodes remain visible", () => {
    const edges: GraphEdge[] = [
      { source: "a", target: "b" },
      { source: "a", target: "c" },
      { source: "b", target: "c" },
    ];

    expect(filterGraphEdges(edges, new Set(["a", "b"]))).toEqual([{ source: "a", target: "b" }]);
  });

  it("includes tag nodes among candidates when they are enabled", () => {
    const nodes = ["note", "other", "tags/common"];
    const edges: GraphEdge[] = [
      { source: "tags/common", target: "note" },
      { source: "tags/common", target: "other" },
    ];

    expect(selectGraphNodeIds(nodes, edges, "missing", 1)).toEqual(["tags/common"]);
  });

  it("never shows small-node labels, including while hovered", () => {
    expect(shouldShowGraphLabel("small", 3, 4, "small")).toBe(false);
  });

  it("keeps prominent labels hidden until their node is hovered at every zoom", () => {
    // Zoom is intentionally not an input to label visibility.
    expect(shouldShowGraphLabel("hub", 8, 4, null)).toBe(false);
    expect(shouldShowGraphLabel("hub", 8, 4, "hub")).toBe(true);
  });

  it("uses full-candidate degree after neighbor nodes have been pruned", () => {
    const nodes = ["hub", "a", "b", "c", "d"];
    const fullLinks: GraphEdge[] = [
      { source: "hub", target: "a" },
      { source: "hub", target: "b" },
      { source: "hub", target: "c" },
      { source: "hub", target: "d" },
    ];
    const selected = selectGraphNodeIds(nodes, fullLinks, "hub", 1);
    const visibleLinks = filterGraphEdges(fullLinks, new Set(selected));
    const fullDegree = countGraphDegrees(nodes, fullLinks).get("hub");

    expect(visibleLinks).toEqual([]);
    expect(shouldShowGraphLabel("hub", fullDegree!, 4, "hub")).toBe(true);
  });

  it("never shows tag-node labels", () => {
    expect(shouldShowGraphLabel("tags/ai", 20, 4, "tags/ai")).toBe(false);
  });
});
