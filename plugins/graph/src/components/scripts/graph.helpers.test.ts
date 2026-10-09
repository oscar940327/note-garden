import { describe, expect, it, vi } from "vitest";
import {
  countGraphDegrees,
  createGraphRenderScheduler,
  filterGraphEdges,
  getGraphNodeAppearance,
  getGraphNodePalette,
  getGraphNoteSlugs,
  resolveGlobalGraphMaxNodes,
  resolveGraphMaxNodes,
  resolveGraphSlug,
  selectGlobalGraphNodeIds,
  selectGraphNodeIds,
  shouldIncludeGraphNode,
  shouldShowGraphLabel,
  type GraphEdge,
} from "./graph.helpers";

describe("getGraphNoteSlugs", () => {
  it("keeps source notes and handwritten indexes while excluding virtual pages", () => {
    const files = [
      { slug: "index", filePath: "content/index.md" },
      { slug: "topics/index", filePath: "content/topics/index.md" },
      { slug: "isolated", filePath: "content/isolated.md" },
      { slug: "new-folder/note", filePath: "content/new-folder/note.MD" },
      { slug: "new-folder/index", relativePath: "new-folder/index.md" },
      { slug: "tags/topic", relativePath: "tags/topic.md" },
      { slug: "image", filePath: "content/image.png" },
    ];
    expect(getGraphNoteSlugs(files)).toEqual([
      "index",
      "topics/index",
      "isolated",
      "new-folder/note",
    ]);
  });

  it("ignores missing metadata and duplicate source entries", () => {
    expect(
      getGraphNoteSlugs([
        {},
        { slug: "virtual" },
        { filePath: "content/note.md" },
        { slug: "note", filePath: "content/note.md" },
        { slug: "note", filePath: "content/note.md" },
      ]),
    ).toEqual(["note"]);
  });
});

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

describe("global graph selection", () => {
  it("allows unlimited nodes while capping positive limits at 50", () => {
    expect(resolveGlobalGraphMaxNodes(12)).toBe(12);
    expect(resolveGlobalGraphMaxNodes(80)).toBe(50);
    expect(resolveGlobalGraphMaxNodes(-1)).toBe(-1);
    expect(resolveGlobalGraphMaxNodes(0)).toBe(50);
    expect(resolveGlobalGraphMaxNodes(undefined)).toBe(50);
  });

  it("keeps the current note and its direct neighbor, then only notes with four links", () => {
    const nodes = ["low", "hub", "current", "direct", "a", "b", "c", "d"];
    const edges: GraphEdge[] = [
      { source: "current", target: "direct" },
      { source: "hub", target: "a" },
      { source: "hub", target: "b" },
      { source: "hub", target: "c" },
      { source: "hub", target: "d" },
      { source: "low", target: "a" },
    ];

    expect(selectGlobalGraphNodeIds(nodes, edges, "current", 50)).toEqual([
      "current",
      "direct",
      "hub",
    ]);
  });

  it("keeps every candidate when the global graph limit is -1", () => {
    const neighbours = Array.from(
      { length: 55 },
      (_, index) => `note-${String(index).padStart(2, "0")}`,
    );
    const nodes = [...neighbours].reverse().concat("current");
    const edges = neighbours.map((target) => ({ source: "current", target }));
    const selected = selectGlobalGraphNodeIds(nodes, edges, "current", -1);

    expect(selected).toHaveLength(56);
    expect(selected).toEqual(nodes);
  });

  it("keeps all note and tag candidates when unlimited", () => {
    const nodes = ["current", "isolated", "tags/topic"];
    const edges: GraphEdge[] = [{ source: "current", target: "tags/topic" }];

    expect(selectGlobalGraphNodeIds(nodes, edges, "current", -1)).toEqual(nodes);
  });

  it("ranks qualifying notes by full candidate degree and then slug", () => {
    const edges: GraphEdge[] = [
      { source: "current", target: "direct" },
      { source: "alpha", target: "a1" },
      { source: "alpha", target: "a2" },
      { source: "alpha", target: "a3" },
      { source: "alpha", target: "a4" },
      { source: "beta", target: "b1" },
      { source: "beta", target: "b2" },
      { source: "beta", target: "b3" },
      { source: "beta", target: "b4" },
      { source: "beta", target: "b5" },
      { source: "zeta", target: "z1" },
      { source: "zeta", target: "z2" },
      { source: "zeta", target: "z3" },
      { source: "zeta", target: "z4" },
      { source: "zeta", target: "z5" },
    ];
    const nodes = [...new Set(edges.flatMap(({ source, target }) => [source, target]))];

    expect(selectGlobalGraphNodeIds(nodes, edges, "current", 3)).toEqual([
      "current",
      "direct",
      "beta",
    ]);
  });

  it("does not count tag edges toward a note's four-link threshold", () => {
    const nodes = ["current", "note", "tags/shared", "other"];
    const edges: GraphEdge[] = [
      { source: "note", target: "tags/shared" },
      { source: "note", target: "other" },
      { source: "note", target: "tags/shared" },
      { source: "note", target: "tags/shared" },
    ];

    expect(selectGlobalGraphNodeIds(nodes, edges, "current", 50)).toEqual(["current"]);
  });
});

describe("graph render scheduler", () => {
  it("coalesces invalidations to one render per animation frame and does not loop while idle", () => {
    let nextId = 0;
    const callbacks = new Map<number, FrameRequestCallback>();
    const requestFrame = vi.fn((callback: FrameRequestCallback) => {
      const id = ++nextId;
      callbacks.set(id, callback);
      return id;
    });
    const cancelFrame = vi.fn((id: number) => callbacks.delete(id));
    const render = vi.fn();
    const scheduler = createGraphRenderScheduler(render, requestFrame, cancelFrame);

    scheduler.invalidate();
    scheduler.invalidate();
    scheduler.invalidate();
    expect(requestFrame).toHaveBeenCalledTimes(1);

    callbacks.get(1)?.(16);
    callbacks.delete(1);
    expect(render).toHaveBeenCalledTimes(1);
    expect(requestFrame).toHaveBeenCalledTimes(1);

    scheduler.invalidate();
    expect(requestFrame).toHaveBeenCalledTimes(2);
    callbacks.get(2)?.(32);
    expect(render).toHaveBeenCalledTimes(2);
  });

  it("cancels pending work and ignores invalidations after cleanup", () => {
    let scheduledCallback: FrameRequestCallback | undefined;
    const cancelFrame = vi.fn();
    const render = vi.fn();
    const scheduler = createGraphRenderScheduler(
      render,
      (callback) => {
        scheduledCallback = callback;
        return 7;
      },
      cancelFrame,
    );

    scheduler.invalidate();
    scheduler.cancel();
    scheduledCallback?.(16);
    scheduler.invalidate();

    expect(cancelFrame).toHaveBeenCalledWith(7);
    expect(render).not.toHaveBeenCalled();
  });
});

describe("graph edge and label behavior", () => {
  it("excludes tag-page nodes when tag nodes are disabled", () => {
    expect(shouldIncludeGraphNode("projects/graph", false)).toBe(true);
    expect(shouldIncludeGraphNode("notes/#plan-and-execute", false)).toBe(true);
    expect(shouldIncludeGraphNode("tags/ai", false)).toBe(false);
    expect(shouldIncludeGraphNode("tags/ai", true)).toBe(true);
  });

  it("preserves non-tag nodes and calculates their degree without tag links", () => {
    const ids = ["index", "note", "isolated", "folder/", "tags/ai"];
    const edges = [
      { source: "index", target: "note" },
      { source: "note", target: "tags/ai" },
      { source: "isolated", target: "tags/ai" },
    ];
    const remainingIds = ids.filter((id) => shouldIncludeGraphNode(id, false));
    const remainingEdges = filterGraphEdges(edges, new Set(remainingIds));
    expect(selectGlobalGraphNodeIds(remainingIds, remainingEdges, "index", -1)).toEqual([
      "index",
      "note",
      "isolated",
      "folder/",
    ]);
    expect([...countGraphDegrees(remainingIds, remainingEdges)]).toEqual([
      ["index", 1],
      ["note", 1],
      ["isolated", 0],
      ["folder/", 0],
    ]);
  });

  it.each(["light", "dark"])("uses four consistent grayscale tiers in the %s theme", (theme) => {
    const palette = getGraphNodePalette(theme);
    const boundaries = [0, 1, 2, 3, 4, 7, 8, 9];
    const appearances = boundaries.map((degree) =>
      getGraphNodeAppearance(degree, 1.25, 4, palette),
    );
    for (let i = 0; i < appearances.length; i += 2) {
      expect(appearances[i]).toEqual(appearances[i + 1]);
      const [, red, green, blue] = appearances[i]!.color.match(/^#(..)(..)(..)$/)!;
      expect(red).toBe(green);
      expect(green).toBe(blue);
    }
    const levels = Object.values(palette).map((color) => parseInt(color.slice(1, 3), 16));
    for (let i = 1; i < levels.length; i++) {
      expect(theme === "dark" ? levels[i]! > levels[i - 1]! : levels[i]! < levels[i - 1]!).toBe(
        true,
      );
    }
    expect(new Set(appearances.map(({ radius }) => radius)).size).toBe(4);
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

  it("shows labels for every hovered node, including small notes and tags", () => {
    expect(shouldShowGraphLabel("small", "small")).toBe(true);
    expect(shouldShowGraphLabel("tags/ai", "tags/ai")).toBe(true);
    expect(shouldShowGraphLabel("small", null)).toBe(false);
  });

  it("uses matching size and color tiers for nodes with the same link count", () => {
    const palette = { low: "gray", medium: "blue", connected: "teal", hub: "orange" };
    const appearance = (degree: number) => getGraphNodeAppearance(degree, 1, 4, palette);
    const tiers = [appearance(0), appearance(2), appearance(4), appearance(8)];

    expect(appearance(1)).toEqual(tiers[0]);
    expect(appearance(3)).toEqual(tiers[1]);
    expect(appearance(7)).toEqual(tiers[2]);
    expect(appearance(9)).toEqual(tiers[3]);
    expect(new Set(tiers.map(({ radius }) => radius)).size).toBe(tiers.length);
    expect(new Set(tiers.map(({ color }) => color)).size).toBe(tiers.length);
  });

  it("still allows a hovered node label when its links are not visible", () => {
    const nodes = ["hub", "a", "b", "c", "d"];
    const fullLinks: GraphEdge[] = [
      { source: "hub", target: "a" },
      { source: "hub", target: "b" },
      { source: "hub", target: "c" },
      { source: "hub", target: "d" },
    ];
    const selected = selectGraphNodeIds(nodes, fullLinks, "hub", 1);
    const visibleLinks = filterGraphEdges(fullLinks, new Set(selected));
    expect(visibleLinks).toEqual([]);
    expect(shouldShowGraphLabel("hub", "hub")).toBe(true);
  });
});
