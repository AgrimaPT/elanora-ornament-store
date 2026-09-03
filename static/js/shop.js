document.addEventListener("DOMContentLoaded", () => {

    const productGrid = document.getElementById("product-grid");

    const productCount =document.querySelector(".shop-product-count");

    let allProducts = [];
    let selectedCategory = "";
    let searchTerm = "";
    let sortOption = "";
    let minPrice = "";
    let maxPrice = "";

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

            const response = await fetch("/api/products/");

            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await response.json();

            console.log(data);

            allProducts = data.results;

            displayProducts(allProducts);

        } catch (error) {

            console.error("Error loading products:", error);

        }
    }


    function displayProducts(products) {

        console.log("Displaying products:", products);

        productCount.textContent =
            `${products.length} ${
                products.length === 1
                    ? "Product"
                    : "Products"
            }`;

        productGrid.innerHTML = "";

        if (products.length === 0) {

            productGrid.innerHTML = `

                <div class="col-12">

                    <div class="no-products">

                        <span class="no-products-line"></span>

                        <p class="no-products-label">
                            YOUR COLLECTION
                        </p>

                        <h3>
                            No pieces found.
                        </h3>

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

            const resetButton =
                document.getElementById("reset-filters");


            resetButton.addEventListener(
                "click",
                resetFilters
            );

            return;
        }

        products.forEach(product => {

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
                                src="${product.image}"
                                alt="${product.name}"
                            >

                        </div>


                        <div class="product-card-content">

                            <span class="product-card-category">
                                ${product.category.name}
                            </span>

                            <h3>
                                ${product.name}
                            </h3>

                            <p>
                                ₹${Number(product.price).toLocaleString("en-IN")}
                            </p>

                        </div>

                    </a>

                </div>

            `;

            productGrid.appendChild(productColumn);

        });
    }


    function filterProducts() {

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


        // Reset search input
        const searchInput =
            document.getElementById("shop-search");

        searchInput.value = "";


        // Reset category selection to All
        const allCategory =
            document.querySelector(
                'input[name="category"][value=""]'
            );

        if (allCategory) {
            allCategory.checked = true;
        }


        // Show all products again
        filterProducts();
    }


    loadProducts();
    loadCategories();

    setupCategoryFilter();
    setupSearch();
    setupSorting();
    setupPriceFilter();
});