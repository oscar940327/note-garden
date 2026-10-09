const responsiveExplorerMedia = window.matchMedia("(max-width: 1199px)")

const closeResponsiveExplorer = (explorer: Element) => {
  explorer.classList.add("collapsed")
  explorer.setAttribute("aria-expanded", "false")
  for (const button of explorer.querySelectorAll(".explorer-toggle")) {
    button.setAttribute("aria-expanded", "false")
  }
  document.documentElement.classList.remove("mobile-no-scroll")
}

const initializeCollapsedExplorers = () => {
  for (const explorer of document.querySelectorAll(".sidebar.left .explorer")) {
    closeResponsiveExplorer(explorer)
  }
}

initializeCollapsedExplorers()
document.addEventListener("nav", initializeCollapsedExplorers)
document.addEventListener("render", initializeCollapsedExplorers)

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return
  const explorer = event.target.closest(".explorer-toggle")?.closest(".explorer")
  if (!explorer) return

  const expanded = String(!explorer.classList.contains("collapsed"))
  for (const button of explorer.querySelectorAll(".explorer-toggle")) {
    button.setAttribute("aria-expanded", expanded)
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
