
document.addEventListener("DOMContentLoaded", () => {
    const filterToggle = document.getElementById("shop-filter-toggle");
    const filtersPanel = document.getElementById("shop-filters-panel");
    const chevron = document.getElementById("shop-filter-chevron");

    if (!filterToggle || !filtersPanel) {
        return;
    }

    const mobileBreakpoint = window.matchMedia("(max-width: 991.98px)");

    function updateFilterLayout(isMobile) {
        if (isMobile) {
            // Start with filters collapsed on mobile.
            filtersPanel.classList.add("is-mobile-collapsed");
            filterToggle.setAttribute("aria-expanded", "false");
        } else {
            // Keep filters visible on desktop.
            filtersPanel.classList.remove("is-mobile-collapsed");
            filterToggle.setAttribute("aria-expanded", "true");
        }

        updateChevron();
    }

    function updateChevron() {
        if (!chevron) {
            return;
        }

        const isExpanded =
            filterToggle.getAttribute("aria-expanded") === "true";

        chevron.classList.toggle("bi-chevron-down", !isExpanded);
        chevron.classList.toggle("bi-chevron-up", isExpanded);
    }

    filterToggle.addEventListener("click", () => {
        const isExpanded =
            filterToggle.getAttribute("aria-expanded") === "true";

        const shouldExpand = !isExpanded;

        filtersPanel.classList.toggle(
            "is-mobile-collapsed",
            !shouldExpand
        );

        filterToggle.setAttribute(
            "aria-expanded",
            String(shouldExpand)
        );

        updateChevron();
    });

    updateFilterLayout(mobileBreakpoint.matches);

    // Keep the layout correct if the screen is resized or rotated.
    mobileBreakpoint.addEventListener("change", (event) => {
        updateFilterLayout(event.matches);
    });
});