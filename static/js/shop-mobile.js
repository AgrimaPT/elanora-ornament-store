
document.addEventListener("DOMContentLoaded", () => {
    const filtersPanel = document.getElementById("shop-filters-panel");
    const backdrop = document.getElementById("shop-filter-backdrop");

    const openFiltersButton = document.getElementById("shop-open-filters");
    const applyFiltersButton = document.getElementById("shop-apply-filters");
    const clearFiltersButton = document.getElementById("shop-clear-filters");

    if (!filtersPanel || !backdrop || !openFiltersButton) {
        return;
    }

    let previousScrollPosition = 0;

    function openFilters() {
        previousScrollPosition = window.scrollY;

        filtersPanel.classList.add("is-open");
        backdrop.classList.add("is-visible");

        backdrop.setAttribute("aria-hidden", "false");
        openFiltersButton.setAttribute("aria-expanded", "true");

        document.body.classList.add("shop-filter-open");

        // Prevent the page behind the sheet from scrolling.
        document.body.style.overflow = "hidden";

        // Put keyboard focus inside the filter panel.
        const firstInput = filtersPanel.querySelector(
            'input:not([type="radio"]), input[type="radio"]'
        );

        if (firstInput) {
            firstInput.focus({ preventScroll: true });
        }
    }

    function closeFilters() {
        filtersPanel.classList.remove("is-open");
        backdrop.classList.remove("is-visible");

        backdrop.setAttribute("aria-hidden", "true");
        openFiltersButton.setAttribute("aria-expanded", "false");

        document.body.classList.remove("shop-filter-open");
        document.body.style.overflow = "";

        // Restore the customer's previous browsing position.
        window.scrollTo({
            top: previousScrollPosition,
            behavior: "instant"
        });

        openFiltersButton.focus({ preventScroll: true });
    }

    // Open the filter sheet.
    openFiltersButton.addEventListener("click", openFilters);

    // Apply means close the sheet.
    // Filtering already happens automatically in shop.js.
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener("click", closeFilters);
    }

    // Close when the customer taps the dark backdrop.
    backdrop.addEventListener("click", closeFilters);

    // Close with the Escape key.
    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            filtersPanel.classList.contains("is-open")
        ) {
            closeFilters();
        }
    });

    // Clear all filters using the existing shop.js logic.
    if (clearFiltersButton) {
        clearFiltersButton.addEventListener("click", () => {
            document.dispatchEvent(
                new CustomEvent("shop:reset-filters")
            );
        });
    }

    // Open the existing native sorting dropdown.


    // Close the sheet if the screen changes to desktop width.
    const desktopBreakpoint = window.matchMedia("(min-width: 992px)");

    desktopBreakpoint.addEventListener("change", (event) => {
        if (event.matches && filtersPanel.classList.contains("is-open")) {
            closeFilters();
        }
    });


    // ========================================
    // CUSTOM SORT MENU
    // ========================================

    const sortTrigger = document.getElementById("shop-sort-trigger");
    const sortMenu = document.getElementById("shop-sort-menu");
    const sortCurrent = document.getElementById("shop-sort-current");
    const sortSelect = document.querySelector(".shop-order-select");
    const sortOptions = document.querySelectorAll(".shop-sort-option");

    function closeSortMenu() {
        if (!sortTrigger || !sortMenu) {
            return;
        }

        sortMenu.hidden = true;
        sortTrigger.setAttribute("aria-expanded", "false");
    }

    function updateSortMenu() {
        if (!sortSelect || !sortCurrent) {
            return;
        }

        const selectedOption = Array.from(sortOptions).find(
            option => option.dataset.sort === sortSelect.value
        );

        sortCurrent.textContent = selectedOption
            ? selectedOption.querySelector("span").textContent
            : "Featured";

        sortOptions.forEach(option => {
            const isSelected = option.dataset.sort === sortSelect.value;

            option.classList.toggle("is-selected", isSelected);

            if (isSelected) {
                option.setAttribute("aria-pressed", "true");
            } else {
                option.setAttribute("aria-pressed", "false");
            }
        });
    }

    if (sortTrigger && sortMenu && sortSelect) {
        sortTrigger.addEventListener("click", () => {
            const shouldOpen =
                sortMenu.hidden;

            sortMenu.hidden = !shouldOpen;

            sortTrigger.setAttribute(
                "aria-expanded",
                String(shouldOpen)
            );
        });

        sortOptions.forEach(option => {
            option.addEventListener("click", () => {
                // Update the original select used by shop.js.
                sortSelect.value = option.dataset.sort;

                // Tell shop.js to sort the products.
                sortSelect.dispatchEvent(
                    new Event("change", { bubbles: true })
                );

                updateSortMenu();
                closeSortMenu();
                sortTrigger.focus({ preventScroll: true });
            });
        });

        // Close the menu when clicking elsewhere.
        document.addEventListener("click", event => {
            if (
                !event.target.closest(".shop-sort")
            ) {
                closeSortMenu();
            }
        });

        // Keep the custom label in sync with the selected value.
        sortSelect.addEventListener("change", updateSortMenu);

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && !sortMenu.hidden) {
                closeSortMenu();
                sortTrigger.focus({ preventScroll: true });
            }
        });

        updateSortMenu();
    }

});