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

export function resolveGraphMaxNodes(value: unknown): number {
  if (value === -1) return -1;
  if (typeof value === "number" && Number.isInteger(value) && value > 0) return value;
  return DEFAULT_GRAPH_MAX_NODES;
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

export function filterGraphEdges(
  edges: readonly GraphEdge[],
  visibleNodeIds: ReadonlySet<string>,
): GraphEdge[] {
  return edges.filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target));
}

export function shouldIncludeGraphNode(nodeId: string, showTags: boolean): boolean {
  return showTags || !nodeId.startsWith("tags/");
}

export function shouldShowGraphLabel(
  nodeId: string,
  fullGraphDegree: number,
  labelMinLinks: number,
  hoveredNodeId: string | null,
): boolean {
  return (
    !nodeId.startsWith("tags/") && fullGraphDegree >= labelMinLinks && hoveredNodeId === nodeId
  );
}
