export function resolveGraphSlug(
  pageSlug: string | undefined,
  fullSlug: string,
  basePath: string,
): string {
  if (pageSlug) return pageSlug;

  let slug = fullSlug;
  const base = basePath.replace(/^\//, "");
  if (base && slug.startsWith(base)) {
    slug = slug.slice(base.length);
    if (slug.startsWith("/")) slug = slug.slice(1);
  }

  return slug;
}

export type GraphEdge = {
  source: string;
  target: string;
};

export const DEFAULT_GRAPH_MAX_NODES = 50;
export const GLOBAL_GRAPH_MAX_NODES = 50;
export const GLOBAL_GRAPH_MIN_NODE_LINKS = 4;

export type GraphRenderScheduler = {
  invalidate: () => void;
  cancel: () => void;
};

export function createGraphRenderScheduler(
  render: () => void,
  requestFrame: (callback: FrameRequestCallback) => number = (callback) =>
    requestAnimationFrame(callback),
  cancelFrame: (frameId: number) => void = (frameId) => cancelAnimationFrame(frameId),
): GraphRenderScheduler {
  let frameId: number | null = null;
  let cancelled = false;

  return {
    invalidate() {
      if (cancelled || frameId !== null) return;
      frameId = requestFrame(() => {
        frameId = null;
        if (!cancelled) render();
      });
    },
    cancel() {
      cancelled = true;
      if (frameId !== null) {
        cancelFrame(frameId);
        frameId = null;
      }
    },
  };
}

export function resolveGraphMaxNodes(value: unknown): number {
  if (value === -1) return -1;
  if (typeof value === "number" && Number.isInteger(value) && value > 0) return value;
  return DEFAULT_GRAPH_MAX_NODES;
}

export function resolveGlobalGraphMaxNodes(value: unknown): number {
  if (value === -1) return -1;
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    return GLOBAL_GRAPH_MAX_NODES;
  }
  return Math.min(value, GLOBAL_GRAPH_MAX_NODES);
}

export function countGraphDegrees(
  nodeIds: readonly string[],
  edges: readonly GraphEdge[],
): Map<string, number> {
  const degrees = new Map<string, number>(nodeIds.map((id): [string, number] => [id, 0]));

  for (const edge of edges) {
    if (!degrees.has(edge.source) || !degrees.has(edge.target)) continue;

    degrees.set(edge.source, degrees.get(edge.source)! + 1);
    if (edge.target !== edge.source) {
      degrees.set(edge.target, degrees.get(edge.target)! + 1);
    }
  }

  return degrees;
}

function compareGraphIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function selectGraphNodeIds(
  nodeIds: readonly string[],
  edges: readonly GraphEdge[],
  currentSlug: string,
  maxNodes: unknown,
): string[] {
  const uniqueNodeIds = [...new Set(nodeIds)];
  const limit = resolveGraphMaxNodes(maxNodes);
  if (limit === -1 || uniqueNodeIds.length <= limit) return uniqueNodeIds;

  const candidateIds = new Set(uniqueNodeIds);
  const degrees = countGraphDegrees(uniqueNodeIds, edges);
  const rankedIds = uniqueNodeIds
    .filter((id) => id !== currentSlug)
    .sort((left, right) => {
      const degreeDifference = degrees.get(right)! - degrees.get(left)!;
      return degreeDifference || compareGraphIds(left, right);
    });

  const selectedIds: string[] = [];
  if (candidateIds.has(currentSlug)) selectedIds.push(currentSlug);

  for (const id of rankedIds) {
    if (selectedIds.length >= limit) break;
    selectedIds.push(id);
  }

  return selectedIds;
}

export function selectGlobalGraphNodeIds(
  nodeIds: readonly string[],
  edges: readonly GraphEdge[],
  currentSlug: string,
  maxNodes: unknown,
): string[] {
  const uniqueNodeIds = [...new Set(nodeIds)];
  const candidateIds = new Set(uniqueNodeIds);
  const limit = resolveGlobalGraphMaxNodes(maxNodes);
  if (limit === -1) return uniqueNodeIds;

  const noteIds = uniqueNodeIds.filter((id) => !id.startsWith("tags/"));
  const noteIdSet = new Set(noteIds);
  const noteEdges = edges.filter(
    (edge) => noteIdSet.has(edge.source) && noteIdSet.has(edge.target),
  );
  const noteDegrees = countGraphDegrees(noteIds, noteEdges);
  const allDegrees = countGraphDegrees(uniqueNodeIds, edges);

  const directNeighbours = new Set<string>();
  if (noteIdSet.has(currentSlug)) {
    for (const edge of noteEdges) {
      if (edge.source === currentSlug) directNeighbours.add(edge.target);
      if (edge.target === currentSlug) directNeighbours.add(edge.source);
    }
  }

  const selected: string[] = [];
  if (candidateIds.has(currentSlug)) selected.push(currentSlug);
  const selectedIds = new Set(selected);

  for (const id of [...directNeighbours].sort(compareGraphIds)) {
    if (selected.length >= limit) break;
    if (!selectedIds.has(id)) {
      selected.push(id);
      selectedIds.add(id);
    }
  }

  const eligibleIds = uniqueNodeIds.filter((id) => {
    if (selectedIds.has(id)) return false;
    if (id.startsWith("tags/")) return allDegrees.get(id)! >= GLOBAL_GRAPH_MIN_NODE_LINKS;
    return noteDegrees.get(id)! >= GLOBAL_GRAPH_MIN_NODE_LINKS;
  });
  eligibleIds.sort((left, right) => {
    const leftDegree = left.startsWith("tags/") ? allDegrees.get(left)! : noteDegrees.get(left)!;
    const rightDegree = right.startsWith("tags/")
      ? allDegrees.get(right)!
      : noteDegrees.get(right)!;
    return rightDegree - leftDegree || compareGraphIds(left, right);
  });

  for (const id of eligibleIds) {
    if (selected.length >= limit) break;
    selected.push(id);
    selectedIds.add(id);
  }

  return selected;
}

export function filterGraphEdges(
  edges: readonly GraphEdge[],
  visibleNodeIds: ReadonlySet<string>,
): GraphEdge[] {
  return edges.filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target));
}

export type GraphNodePalette = {
  low: string;
  medium: string;
  connected: string;
  hub: string;
};

export type GraphNodeAppearance = {
  radius: number;
  color: string;
};

export function getGraphNodeAppearance(
  degree: number,
  nodeSizeScale: number,
  hubMinLinks: number,
  palette: GraphNodePalette,
): GraphNodeAppearance {
  if (degree >= hubMinLinks * 2) return { radius: 8 * nodeSizeScale, color: palette.hub };
  if (degree >= hubMinLinks) return { radius: 6.5 * nodeSizeScale, color: palette.connected };
  if (degree >= 2) return { radius: 5 * nodeSizeScale, color: palette.medium };
  return { radius: 3.5 * nodeSizeScale, color: palette.low };
}

export function shouldIncludeGraphNode(nodeId: string, showTags: boolean): boolean {
  return showTags || !nodeId.startsWith("tags/");
}

export function shouldShowGraphLabel(nodeId: string, hoveredNodeId: string | null): boolean {
  return hoveredNodeId === nodeId;
}
