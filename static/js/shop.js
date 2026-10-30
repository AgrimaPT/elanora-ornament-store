document.addEventListener("DOMContentLoaded", () => {

    const productGrid = document.getElementById("product-grid");

    const productCount = document.querySelector(".shop-product-count");

    let allProducts = [];
    const PRODUCTS_PER_PAGE = 10;
    let currentPage = 1;
    const urlParams = new URLSearchParams(window.location.search);

    let selectedCategory = urlParams.get("category") || "";
    let searchTerm = "";
    let sortOption = "";
    let minPrice = "";
    let maxPrice = "";



    function updateFilterIndicator() {
        const filterCountElement =
            document.getElementById("shop-filter-count");

        const openFiltersButton =
            document.getElementById("shop-open-filters");

        if (!filterCountElement) {
            return;
        }

        // Count active filter types, not individual fields.
        // Min and max price together count as one price filter.
        let activeFilterCount = 0;

        if (selectedCategory !== "") {
            activeFilterCount++;
        }

        if (searchTerm.trim() !== "") {
            activeFilterCount++;
        }

        if (minPrice !== "" || maxPrice !== "") {
            activeFilterCount++;
        }

        filterCountElement.textContent = activeFilterCount;
        filterCountElement.hidden = activeFilterCount === 0;

        if (openFiltersButton) {
            openFiltersButton.classList.toggle(
                "has-active-filters",
                activeFilterCount > 0
            );
        }
    }

    async function loadCategories() {

        try {

            const response = await fetch(
                "/api/products/categories/"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }

            const categories = await response.json();

            console.log("Categories:", categories);

            displayCategories(categories);

        } catch (error) {

            console.error(
                "Error loading categories:",
                error
            );

        }
    }




    async function loadProducts() {
        try {
            let nextUrl = "/api/products/";
            const products = [];

            // Fetch every page of products from the API.
            while (nextUrl) {
                const response = await fetch(nextUrl);

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch products: ${response.status} ${response.statusText}`
                    );
                }

                const data = await response.json();

                // Handle Django REST Framework's paginated response.
                if (Array.isArray(data.results)) {
                    products.push(...data.results);

                    // Fix HTTP/HTTPS mismatch in the pagination URL.
                    if (data.next) {
                        const nextPageUrl = new URL(
                            data.next,
                            window.location.origin
                        );

                        // Preserve the current protocol for same-host requests.
                        if (nextPageUrl.host === window.location.host) {
                            nextPageUrl.protocol = window.location.protocol;
                        }

                        nextUrl = nextPageUrl.href;
                    } else {
                        nextUrl = null;
                    }
                } else if (Array.isArray(data)) {
                    // Also support an unpaginated API response.
                    products.push(...data);
                    nextUrl = null;
                } else {
                    throw new Error("Unexpected products API response");
                }
            }

            // Store the complete product catalogue.
            allProducts = products;

            console.log("Total products loaded:", allProducts.length);

            // Apply existing search, filters, and sorting to all products.
            filterProducts();

        } catch (error) {
            console.error("Error loading products:", error);
        }
    }


    function displayProducts(products) {
        console.log("Displaying products:", products);

        const totalProducts = products.length;
        const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

        // Keep the current page within the valid range.
        if (totalPages === 0) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
        const endIndex = Math.min(
            startIndex + PRODUCTS_PER_PAGE,
            totalProducts
        );

        // Display only the products for the current page.
        const pageProducts = products.slice(startIndex, endIndex);

        productCount.textContent = totalProducts === 0
            ? "0 Products"
            : `Showing ${startIndex + 1}–${endIndex} of ${totalProducts} Products`;

        productGrid.innerHTML = "";

        // Create the pagination container once.
        let paginationContainer =
            document.getElementById("product-pagination");

        if (!paginationContainer) {
            paginationContainer = document.createElement("nav");
            paginationContainer.id = "product-pagination";
            paginationContainer.className =
                "d-flex justify-content-center mt-4 mb-4";
            paginationContainer.setAttribute(
                "aria-label",
                "Product pages"
            );

            productGrid.insertAdjacentElement(
                "afterend",
                paginationContainer
            );
        }

        paginationContainer.innerHTML = "";

        // Show the existing empty state when no products match.
        if (totalProducts === 0) {
            productGrid.innerHTML = `
                <div class="col-12">
                    <div class="no-products">
                        <span class="no-products-line"></span>

                        <p class="no-products-label">
                            YOUR COLLECTION
                        </p>

                        <h3>No pieces found.</h3>

                        <p class="no-products-message">
                            We couldn't find anything matching
                            your current selection.
                        </p>

                        <button
                            type="button"
                            class="no-products-reset"
                            id="reset-filters"
                        >
                            Clear all filters
                        </button>
                    </div>
                </div>
            `;

            document
                .getElementById("reset-filters")
                .addEventListener("click", resetFilters);

            return;
        }

        // Render product cards using your existing design.
        pageProducts.forEach(product => {
            const productColumn = document.createElement("div");
            productColumn.className = "col-6 col-md-4";

            productColumn.innerHTML = `
                <div class="product-card">
                    <a
                        href="/product/${product.slug}/"
                        class="product-card-link"
                    >
                        <div class="product-card-image">
                            <img
                                src="${product.image || '/static/images/product-placeholder.jpg'}"
                                alt="${product.name}"
                            >
                        </div>

                        <div class="product-card-content">
                            <span class="product-card-category">
                                ${product.category.name}
                            </span>

                            <h3>${product.name}</h3>

                            <p>
                                ₹${Number(product.price).toLocaleString("en-IN")}
                            </p>
                        </div>
                    </a>
                </div>
            `;

            productGrid.appendChild(productColumn);
        });

        // No pagination controls are needed for a single page.
        if (totalPages <= 1) {
            return;
        }

        // Build Previous, numbered pages, and Next controls.
        let paginationHTML = `
            <ul class="pagination mb-0">
                <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
                    <button
                        type="button"
                        class="page-link"
                        data-page="${currentPage - 1}"
                        ${currentPage === 1 ? "disabled" : ""}
                        aria-label="Previous page"
                    >
                        <span class="pagination-arrow pagination-arrow-left"
                            aria-hidden="true"></span>
                        <span class="visually-hidden">Previous page</span>
                    </button>
                </li>
        `;

        for (let page = 1; page <= totalPages; page++) {
            paginationHTML += `
                <li class="page-item ${page === currentPage ? "active" : ""}">
                    <button
                        type="button"
                        class="page-link"
                        data-page="${page}"
                        ${page === currentPage ? 'aria-current="page"' : ""}
                    >
                        ${page}
                    </button>
                </li>
            `;
        }

        paginationHTML += `
                <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
                    <button
                        type="button"
                        class="page-link"
                        data-page="${currentPage + 1}"
                        ${currentPage === totalPages ? "disabled" : ""}
                        aria-label="Next page"
                    >
                        <span class="pagination-arrow pagination-arrow-right"
                            aria-hidden="true"></span>
                        <span class="visually-hidden">Next page</span>
                    </button>
                </li>
            </ul>
        `;

        paginationContainer.innerHTML = paginationHTML;

        // Handle page changes without resetting the selected page.
        paginationContainer
            .querySelectorAll("button[data-page]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    const requestedPage = Number(button.dataset.page);

                    if (
                        requestedPage >= 1 &&
                        requestedPage <= totalPages &&
                        requestedPage !== currentPage
                    ) {
                        currentPage = requestedPage;
                        filterProducts(false);

                        // Return to the product listing after changing pages.
                        productGrid.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }
                });
            });
    }

    function filterProducts(resetPage = true) {
        if (resetPage) {
            currentPage = 1;
        }
        //let filteredProducts = allProducts;
        let filteredProducts = [...allProducts];  //... is the spread operator.It creates a new array containing the same products.This prevents our sorting operation from accidentally changing the original allProducts order.

        // Category filter
        if (selectedCategory !== "") {

            filteredProducts =
                filteredProducts.filter(
                    product =>
                        product.category.slug ===
                        selectedCategory
                );

        }


        // Search filter
        if (searchTerm !== "") {

            filteredProducts =
                filteredProducts.filter(
                    product =>
                        product.name
                            .toLowerCase()
                            .includes(searchTerm)
                );

        }


        // Minimum price filter
        if (minPrice !== "") {

            filteredProducts =
                filteredProducts.filter(
                    product =>
                        Number(product.price) >= Number(minPrice)
                );

        }


        // Maximum price filter
        if (maxPrice !== "") {

            filteredProducts =
                filteredProducts.filter(
                    product =>
                        Number(product.price) <= Number(maxPrice)
                );

        }


        // Sorting
        if (sortOption === "price") {

            filteredProducts.sort(
                (a, b) =>
                    Number(a.price) - Number(b.price)
            );

        } else if (sortOption === "-price") {

            filteredProducts.sort(
                (a, b) =>
                    Number(b.price) - Number(a.price)
            );

        } else if (sortOption === "name") {

            filteredProducts.sort(
                (a, b) =>
                    a.name.localeCompare(b.name)
            );

        }


        displayProducts(filteredProducts);
        updateFilterIndicator();
    }

    function displayCategories(categories) {

        const categoryOptions =
            document.getElementById("category-options");


        categories.forEach(category => {

            const categoryLabel =
                document.createElement("label");

            categoryLabel.className =
                "category-option";


            categoryLabel.innerHTML = `

                <input
                    type="radio"
                    name="category"
                    value="${category.slug}"
                    ${category.slug === selectedCategory ? "checked" : ""}
                >
                <span>
                    ${category.name}
                </span>

            `;


            categoryOptions.appendChild(
                categoryLabel
            );

        });

    }

    function setupCategoryFilter() {

        const categoryOptions =
            document.getElementById("category-options");

        categoryOptions.addEventListener("change", (event) => {

            selectedCategory =
                event.target.value;

            console.log(
                "Selected category:",
                selectedCategory
            );

            filterProducts();

        });
    }

    function setupSearch() {

        const searchInput =
            document.getElementById("shop-search");


        searchInput.addEventListener(
            "input",
            (event) => {

                searchTerm =
                    event.target.value.toLowerCase();


                console.log(
                    "Search:",
                    searchTerm
                );


                filterProducts();

            }
        );
    }


    function setupSorting() {

        const orderSelect =
            document.querySelector(".shop-order-select");


        orderSelect.addEventListener(
            "change",
            (event) => {

                sortOption =
                    event.target.value;


                console.log(
                    "Sort option:",
                    sortOption
                );


                filterProducts();

            }
        );
    }


    function setupPriceFilter() {

        const minPriceInput =
            document.getElementById("min-price");

        const maxPriceInput =
            document.getElementById("max-price");


        minPriceInput.addEventListener(
            "input",
            (event) => {

                minPrice = event.target.value;

                filterProducts();

            }
        );


        maxPriceInput.addEventListener(
            "input",
            (event) => {

                maxPrice = event.target.value;

                filterProducts();

            }
        );
    }


    function resetFilters() {

        // Reset JavaScript state
        selectedCategory = "";
        searchTerm = "";
        sortOption = "";
        minPrice = "";
        maxPrice = "";

        // Reset search input
        const searchInput =
            document.getElementById("shop-search");

        searchInput.value = "";

        // Reset price inputs
        document.getElementById("min-price").value = "";
        document.getElementById("max-price").value = "";

        // Reset category selection to All
        const allCategory =
            document.querySelector(
                'input[name="category"][value=""]'
            );

        if (allCategory) {
            allCategory.checked = true;
        }

        // Reset sorting dropdown
        const orderSelect =
            document.querySelector(".shop-order-select");

        orderSelect.value = "";

        // Show all products again
        filterProducts();
    }
    // Allow the mobile filter interface to reset all filters.
    document.addEventListener("shop:reset-filters", resetFilters);

    loadProducts();
    loadCategories();

    setupCategoryFilter();
    setupSearch();
    setupSorting();
    setupPriceFilter();
});