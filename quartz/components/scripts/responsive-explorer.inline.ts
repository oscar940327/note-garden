import { getFullSlug, simplifySlug } from "../../util/path"

const responsiveExplorerMedia = window.matchMedia("(max-width: 1199px)")

const setExplorerExpanded = (explorer: Element, expanded: boolean) => {
  explorer.classList.toggle("collapsed", !expanded)
  explorer.setAttribute("aria-expanded", String(expanded))
  for (const button of explorer.querySelectorAll(".explorer-toggle")) {
    button.setAttribute("aria-expanded", String(expanded))
  }
  explorer.querySelector(".explorer-content")?.setAttribute("aria-expanded", String(expanded))
  document.documentElement.classList.toggle(
    "mobile-no-scroll",
    expanded && responsiveExplorerMedia.matches,
  )
}

const closeResponsiveExplorer = (explorer: Element) => setExplorerExpanded(explorer, false)

const initializedExplorerTrees = new WeakMap<Element, string>()
const explorerFolderNavigationKey = "explorerFolderNavigation"
const savedFolderNavigation = sessionStorage.getItem(explorerFolderNavigationKey)
sessionStorage.removeItem(explorerFolderNavigationKey)
const explorerNavigation = performance.getEntriesByType("navigation")[0] as
  | PerformanceNavigationTiming
  | undefined
// Carry one explicit folder click across full-page navigation, never reloads
// or browser history. The entry is consumed immediately so it cannot replay.
let pendingExplorerFolderPath =
  explorerNavigation?.type === "navigate" ? (savedFolderNavigation ?? undefined) : undefined

const resetExplorerTree = (explorer: Element, list: HTMLElement, treeRendered = false) => {
  // Automatic navigation updates should appear in their final state, while
  // manual folder clicks can still use the plugin's normal transitions.
  explorer.classList.add("explorer-initializing")

  // Open the current folder and its ancestors, showing one level beneath it.
  // Ignore saved unrelated branches, but keep manual toggles until navigation.
  const currentPath = simplifySlug(getFullSlug(window)).replace(/\/$/, "")
  let clickedFolder: Element | undefined
  for (const container of list.querySelectorAll<HTMLElement>(
    ".folder-container[data-folderpath]",
  )) {
    const folder = container.nextElementSibling
    if (!folder?.classList.contains("folder-outer")) continue

    const folderPath = simplifySlug(container.dataset.folderpath!).replace(/\/$/, "")
    const belongsToCurrentPath =
      folderPath !== "" && (currentPath === folderPath || currentPath.startsWith(`${folderPath}/`))
    const animateClickedFolder =
      treeRendered && folderPath === pendingExplorerFolderPath && folderPath === currentPath
    folder.classList.toggle("open", belongsToCurrentPath && !animateClickedFolder)
    container
      .querySelector(".folder-icon")
      ?.setAttribute("aria-expanded", String(belongsToCurrentPath))
    if (animateClickedFolder) clickedFolder = folder
  }

  // The plugin inserts this marker before the files when rebuilding its tree.
  const end = list.querySelector(".overflow-end")
  if (end && end !== list.lastElementChild) list.append(end)

  list.scrollTop = 0
  if (list.parentElement) list.parentElement.scrollTop = 0
  explorer.scrollTop = 0
  setExplorerExpanded(explorer, !responsiveExplorerMedia.matches)
  explorer.querySelector(".mobile-explorer")?.classList.remove("hide-until-loaded")
  document.getElementById("explorer-pending-style")?.remove()

  // Commit the final layout with transitions disabled before restoring them.
  // Keeping this synchronous also handles repeated renders before the next paint.
  explorer.getBoundingClientRect()
  explorer.classList.remove("explorer-initializing")
  explorer.setAttribute("data-explorer-ready", "true")

  if (clickedFolder) {
    pendingExplorerFolderPath = undefined
    sessionStorage.removeItem(explorerFolderNavigationKey)
    // Establish the collapsed state with normal transitions restored, then
    // animate only the folder explicitly selected by the user.
    clickedFolder.getBoundingClientRect()
    clickedFolder.classList.add("open")
  }
}

const initializeExplorers = () => {
  const currentPath = simplifySlug(getFullSlug(window)).replace(/\/$/, "")
  if (pendingExplorerFolderPath !== currentPath) pendingExplorerFolderPath = undefined

  for (const explorer of document.querySelectorAll(".sidebar.left .explorer")) {
    const list = explorer.querySelector<HTMLElement>(".explorer-ul")
    if (!list || initializedExplorerTrees.get(list) === currentPath) continue
    resetExplorerTree(explorer, list, true)
    initializedExplorerTrees.set(list, currentPath)
  }
}

initializeExplorers()
// Full-page loads initialize immediately; these also support SPA/render events.
document.addEventListener("nav", initializeExplorers, { capture: true })
document.addEventListener("render", initializeExplorers, { capture: true })
responsiveExplorerMedia.addEventListener("change", () => {
  for (const explorer of document.querySelectorAll(".sidebar.left .explorer")) {
    setExplorerExpanded(explorer, !responsiveExplorerMedia.matches)
  }
})

document.addEventListener(
  "click",
  (event) => {
    pendingExplorerFolderPath = undefined
    sessionStorage.removeItem(explorerFolderNavigationKey)
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      responsiveExplorerMedia.matches ||
      !(event.target instanceof Element)
    ) {
      return
    }

    const link = event.target.closest<HTMLAnchorElement>(".sidebar.left .explorer a.folder-button")
    if (!link || (link.target && link.target !== "_self")) return

    const container = link.closest<HTMLElement>(".folder-container[data-folderpath]")
    if (!container || container.nextElementSibling?.classList.contains("open")) return

    pendingExplorerFolderPath = simplifySlug(container.dataset.folderpath!).replace(/\/$/, "")
    sessionStorage.setItem(explorerFolderNavigationKey, pendingExplorerFolderPath)
  },
  { capture: true },
)

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return
  const explorer = event.target.closest(".explorer-toggle")?.closest(".explorer")
  if (explorer) {
    setExplorerExpanded(explorer, explorer.classList.contains("collapsed"))
    return
  }

  const control = event.target.closest(".folder-icon, button.folder-button")
  const container = control?.closest(".sidebar.left .explorer .folder-container")
  const folder = container?.nextElementSibling
  if (!folder?.classList.contains("folder-outer")) return
  const expanded = folder.classList.toggle("open")
  container?.querySelector(".folder-icon")?.setAttribute("aria-expanded", String(expanded))
})

document.addEventListener("keydown", (event) => {
  if (
    (event.key === "Enter" || event.key === " ") &&
    event.target instanceof Element &&
    event.target.matches(".sidebar.left .explorer .folder-icon")
  ) {
    event.preventDefault()
    event.target.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  }
})

const closeExplorerOnOutsidePointer = (event: PointerEvent) => {
  if (!responsiveExplorerMedia.matches || !(event.target instanceof Node)) return

  for (const explorer of document.querySelectorAll(
    ".page > #quartz-body > .sidebar.left .explorer:not(.collapsed)",
  )) {
    if (!explorer.contains(event.target)) {
      closeResponsiveExplorer(explorer)
    }
  }
}

document.addEventListener("pointerdown", closeExplorerOnOutsidePointer, { capture: true })
