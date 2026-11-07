import { cloneElement, isValidElement, type ComponentChildren, type VNode } from "preact"
import { FileTrieNode } from "../util/fileTrie"
import { simplifySlug } from "../util/path"
import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-expect-error - inline script loaded as text by the Quartz esbuild plugin
import explorerScript from "./scripts/responsive-explorer.inline"
// @ts-expect-error - inline script loaded as text by the Quartz esbuild plugin
import explorerPrescript from "./scripts/explorer-prescript.inline"

interface ExplorerFile {
  slug: string
  title: string
  filePath: string
}

type ExplorerNode = FileTrieNode<ExplorerFile>
interface ExplorerOptions {
  sortFn?: (a: ExplorerNode, b: ExplorerNode) => number
  filterFn?: (node: ExplorerNode) => boolean
  mapFn?: (node: ExplorerNode) => void
  folderClickBehavior?: "link" | "collapse"
}

function populateExplorer(node: ComponentChildren, entries: ComponentChildren): ComponentChildren {
  if (Array.isArray(node)) return node.map((child) => populateExplorer(child, entries))
  if (!isValidElement(node)) return node
  const element = node as VNode<{ class?: string; children?: ComponentChildren }>
  if (element.props.class?.split(" ").includes("explorer-content")) {
    // Keep the community component's OverflowList, including its unique id
    // and end marker, but supply real entries instead of an empty placeholder.
    const list = element.props.children as VNode
    return cloneElement(element, { "aria-expanded": true }, cloneElement(list, {}, entries))
  }
  return cloneElement(element, {}, populateExplorer(element.props.children, entries))
}

function renderEntry(
  node: ExplorerNode,
  currentPath: string,
  basePath: string,
  behavior: "link" | "collapse",
): ComponentChildren {
  if (!node.isFolder) {
    return (
      <li>
        <a
          href={`${basePath}/${node.slug}`}
          class={`nav-file-title tree-item-self${node.slug === currentPath ? " active is-active" : ""}`}
        >
          {node.displayName}
        </a>
      </li>
    )
  }

  const folderPath = simplifySlug(node.slug).replace(/\/$/, "")
  const open = currentPath === folderPath || currentPath.startsWith(`${folderPath}/`)
  const title = <span class="folder-title">{node.displayName}</span>
  return (
    <li>
      <div class="folder-container nav-folder-title tree-item-self" data-folderpath={node.slug}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="5 8 14 8"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="folder-icon nav-folder-collapse-indicator collapse-icon"
          role="button"
          tabindex={0}
          aria-label={node.displayName}
          aria-expanded={open}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <div>
          {behavior === "link" ? (
            <a class="folder-button" href={`${basePath}/${simplifySlug(node.slug)}`}>
              {title}
            </a>
          ) : (
            <button type="button" class="folder-button">
              {title}
            </button>
          )}
        </div>
      </div>
      <div class={`folder-outer${open ? " open" : ""}`}>
        <ul class="content tree-item-children">
          {node.children.map((child) => renderEntry(child, currentPath, basePath, behavior))}
        </ul>
      </div>
    </li>
  )
}

/** Reuse the installed Explorer's shell/styles with a tree generated at build time. */
export function withStaticExplorerTree(
  original: QuartzComponentConstructor,
): QuartzComponentConstructor {
  return (options) => {
    const shell = original(options)
    const opts = (options ?? {}) as ExplorerOptions
    let cachedFiles: QuartzComponentProps["allFiles"] | undefined
    let cachedTree: ExplorerNode

    const Explorer: QuartzComponent = (props) => {
      if (cachedFiles !== props.allFiles) {
        cachedFiles = props.allFiles
        cachedTree = new FileTrieNode<ExplorerFile>([])
        for (const file of props.allFiles) {
          if (!file.slug || file.slug === "404" || file.unlisted === true) continue
          cachedTree.add({
            slug: file.slug,
            title: file.frontmatter?.title ?? file.slug.split("/").at(-1)!,
            filePath: String(file.relativePath ?? file.filePath ?? file.slug).replace(/\\/g, "/"),
          })
        }
        cachedTree.filter(opts.filterFn ?? ((node) => node.slugSegment !== "tags"))
        if (opts.mapFn) cachedTree.map(opts.mapFn)
        cachedTree.sort(
          opts.sortFn ??
            ((a, b) =>
              Number(b.isFolder) - Number(a.isFolder) ||
              a.displayName.localeCompare(b.displayName, undefined, {
                numeric: true,
                sensitivity: "base",
              })),
        )
      }

      const basePath =
        props.ctx.argv.serve || !props.cfg.baseUrl
          ? ""
          : new URL(`https://${props.cfg.baseUrl}`).pathname.replace(/\/$/, "")
      const currentPath = simplifySlug(props.fileData.slug!).replace(/\/$/, "")
      const entries = cachedTree.children.map((node) =>
        renderEntry(node, currentPath, basePath, opts.folderClickBehavior ?? "link"),
      )
      const root = populateExplorer(shell(props), entries) as VNode
      return cloneElement(root, { "data-explorer-rendered": true, "aria-expanded": true })
    }

    return Object.assign(Explorer, {
      css: shell.css,
      beforeDOMLoaded: explorerPrescript,
      afterDOMLoaded: explorerScript,
    })
  }
}
