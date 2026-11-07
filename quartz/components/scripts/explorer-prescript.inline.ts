// Keep a deliberately clicked folder collapsed on the very first paint. The
// main Explorer script will animate it once its delegated controls are ready.
const explorerPendingPath = sessionStorage.getItem("explorerFolderNavigation")
const explorerPageNavigation = performance.getEntriesByType("navigation")[0] as
  | PerformanceNavigationTiming
  | undefined
if (explorerPendingPath && explorerPageNavigation?.type === "navigate") {
  const selector = `.sidebar.left .explorer .folder-container[data-folderpath="${CSS.escape(explorerPendingPath + "/index")}"]`
  const style = document.createElement("style")
  style.id = "explorer-pending-style"
  style.textContent = `${selector} + .folder-outer { grid-template-rows: 0fr; visibility: collapse; transition: none !important; }
${selector} > .folder-icon { transform: rotate(-90deg); transition: none !important; }`
  document.head.append(style)
}
