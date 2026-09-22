const responsiveExplorerMedia = window.matchMedia("(max-width: 1199px)")

const closeResponsiveExplorer = (explorer: Element) => {
  if (explorer.classList.contains("collapsed")) return

  explorer.classList.add("collapsed")
  explorer.setAttribute("aria-expanded", "false")
  explorer.querySelector("button.mobile-explorer")?.setAttribute("aria-expanded", "false")
  document.documentElement.classList.remove("mobile-no-scroll")
}

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
