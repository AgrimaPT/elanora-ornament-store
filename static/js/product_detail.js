document.addEventListener("DOMContentLoaded", () => {

    const productDetail =
        document.getElementById("product-detail");


    let selectedVariant = null;


    async function loadProduct() {

        try {

            const response = await fetch(
                `/api/products/${productSlug}/`
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch product"
                );

            }


            const product =
                await response.json();


            displayProduct(product);

        }
        catch (error) {

            console.error(
                "Error loading product:",
                error
            );


            productDetail.innerHTML = `
                <div class="product-not-found">

                    <span class="section-eyebrow">
                        THE COLLECTION
                    </span>

                    <h2>
                        Piece not found.
                    </h2>

                    <p>
                        We couldn't find the jewellery
                        you're looking for.
                    </p>

                    <a
                        href="/shop/"
                        class="product-not-found-link"
                    >
                        Return to the collection
                    </a>

                </div>
            `;

        }

    }


    function getEffectivePrice(product, variant) {

        if (
            variant &&
            variant.price !== null
        ) {

            return Number(
                variant.price
            );

        }


        return Number(
            product.price
        );

    }


    function displayProduct(product) {

        const images =
            product.images || [];


        const variants =
            (product.variants || [])
                .filter(
                    variant =>
                        variant.is_active
                );


        const mainImage =
            images.length > 0
                ? images[0].image
                : "";


        productDetail.innerHTML = `

            <div class="product-detail-layout">


                <!-- Product Gallery -->

                <div class="product-gallery">

                    <div class="product-main-image">

                        ${
                            mainImage
                                ? `
                                    <img
                                        src="${mainImage}"
                                        alt="${product.name}"
                                    >
                                  `
                                : `
                                    <p>
                                        No image available
                                    </p>
                                  `
                        }

                    </div>


                    <div class="product-thumbnails">

                        ${
                            images.map((item, index) => `

                                <button
                                    type="button"
                                    class="product-thumbnail ${
                                        index === 0
                                            ? "active"
                                            : ""
                                    }"
                                    data-image="${item.image}"
                                >

                                    <img
                                        src="${item.image}"
                                        alt="${product.name}"
                                    >

                                </button>

                            `).join("")
                        }

                    </div>

                </div>


                <!-- Product Information -->

                <div class="product-detail-content">

                    <span class="section-eyebrow">
                        ${product.category.name}
                    </span>


                    <h1>
                        ${product.name}
                    </h1>


                    <p
                        class="product-price"
                        id="product-price"
                    >
                        ₹${Number(
                            product.price
                        ).toLocaleString("en-IN")}
                    </p>


                    ${
                        variants.length > 0
                            ? `

                                <div
                                    class="product-variants"
                                >

                                    <span
                                        class="variant-label"
                                    >
                                        Select Size
                                    </span>


                                    <div
                                        class="variant-options"
                                        id="variant-options"
                                    >

                                        ${
                                            variants.map(
                                                (variant) => `

                                                    <button
                                                        type="button"
                                                        class="variant-option"
                                                        data-variant-id="${variant.id}"
                                                        ${variant.stock <= 0 ? "disabled" : ""}
                                                    >
                                                        ${variant.name}
                                                    </button>

                                                `
                                            ).join("")
                                        }

                                    </div>

                                </div>

                              `
                            : ""
                    }


                    <p
                        class="product-stock"
                        id="product-stock"
                    >
                        ${
                            product.stock > 0
                                ? "In Stock"
                                : "Out of Stock"
                        }
                    </p>


                    <div class="product-purchase">

                        ${
                            product.stock > 0
                                ? `

                                    <div class="product-quantity">

                                        <span class="quantity-label">
                                            Quantity
                                        </span>


                                        <div class="quantity-control">

                                            <button
                                                type="button"
                                                class="quantity-button"
                                                id="quantity-decrease"
                                            >
                                                −
                                            </button>


                                            <span
                                                class="quantity-value"
                                                id="quantity-value"
                                            >
                                                1
                                            </span>


                                            <button
                                                type="button"
                                                class="quantity-button"
                                                id="quantity-increase"
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>


                                    <button
                                        type="button"
                                        class="add-to-cart-button"
                                        id="add-to-cart"
                                    >
                                        Add to Cart
                                    </button>

                                  `
                                : `

                                    <button
                                        type="button"
                                        class="add-to-cart-button out-of-stock-button"
                                        disabled
                                    >
                                        Out of Stock
                                    </button>

                                  `
                        }

                    </div>


                </div>


            </div>

        `;


        setupThumbnailFunctionality(
            product
        );


        setupProductPurchase(
            product,
            variants
        );

    }


    function setupThumbnailFunctionality(
        product
    ) {

        const thumbnails =
            document.querySelectorAll(
                ".product-thumbnail"
            );


        const mainProductImage =
            document.querySelector(
                ".product-main-image img"
            );


        thumbnails.forEach(
            thumbnail => {

                thumbnail.addEventListener(
                    "click",
                    () => {

                        mainProductImage.src =
                            thumbnail.dataset.image;


                        thumbnails.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        thumbnail.classList.add(
                            "active"
                        );

                    }
                );

            }
        );

    }


    function setupProductPurchase(
        product,
        variants
    ) {

        const quantityValue =
            document.getElementById(
                "quantity-value"
            );


        const decreaseButton =
            document.getElementById(
                "quantity-decrease"
            );


        const increaseButton =
            document.getElementById(
                "quantity-increase"
            );


        const addToCartButton =
            document.getElementById(
                "add-to-cart"
            );


        const priceElement =
            document.getElementById(
                "product-price"
            );


        const stockElement =
            document.getElementById(
                "product-stock"
            );


        let quantity = 1;


        /*
         * If the product has variants,
         * select the first active variant
         * by default.
         */
        if (variants.length > 0) {

            selectedVariant =
                variants.find(
                    variant =>
                        variant.stock > 0
                ) || null;

        }

        function getAvailableStock() {

            if (variants.length > 0) {

                return selectedVariant
                    ? selectedVariant.stock
                    : 0;

            }


            return product.stock;

        }


        function updateProductDisplay() {

            const effectivePrice =
                getEffectivePrice(
                    product,
                    selectedVariant
                );


            const availableStock =
                getAvailableStock();


            priceElement.textContent =
                `₹${effectivePrice.toLocaleString(
                    "en-IN"
                )}`;


            if (availableStock > 0) {

                stockElement.textContent =
                    `In Stock — ${availableStock} available`;

            }
            else {

                stockElement.textContent =
                    "Out of Stock";

            }


            if (
                quantity > availableStock
            ) {

                quantity =
                    availableStock;

            }


            if (quantity < 1) {

                quantity = 1;

            }


            quantityValue.textContent =
                quantity;


            if (addToCartButton) {

                addToCartButton.disabled =
                    availableStock <= 0;

                addToCartButton.classList.toggle(
                    "out-of-stock-button",
                    availableStock <= 0
                );


                addToCartButton.textContent =
                    availableStock > 0
                        ? "Add to Cart"
                        : "Out of Stock";

            }

        }


        /*
         * Variant selection
         */

        const variantOptions =
            document.querySelectorAll(
                ".variant-option"
            );


        variantOptions.forEach(
            option => {

                option.addEventListener(
                    "click",
                    () => {

                        if (option.disabled) {

                            return;

                        }


                        const variantId =
                            Number(
                                option.dataset.variantId
                            );


                        selectedVariant =
                            variants.find(
                                variant =>
                                    variant.id ===
                                    variantId
                            );


                        variantOptions.forEach(
                            item => {

                                item.classList.remove(
                                    "selected"
                                );

                            }
                        );


                        option.classList.add(
                            "selected"
                        );


                        quantity = 1;


                        updateProductDisplay();

                    }
                );

            }
        );


        /*
         * Mark the default variant
         * as selected.
         */

        if (selectedVariant) {

            const selectedOption =
                document.querySelector(
                    `.variant-option[data-variant-id="${selectedVariant.id}"]`
                );


            if (selectedOption) {

                selectedOption.classList.add(
                    "selected"
                );

            }

        }


        /*
         * Quantity decrease
         */

        if (decreaseButton) {

            decreaseButton.addEventListener(
                "click",
                () => {

                    if (quantity > 1) {

                        quantity--;

                        quantityValue.textContent =
                            quantity;

                    }

                }
            );

        }


        /*
         * Quantity increase
         */

        if (increaseButton) {

            increaseButton.addEventListener(
                "click",
                () => {

                    const availableStock =
                        getAvailableStock();


                    if (
                        quantity <
                        availableStock
                    ) {

                        quantity++;

                        quantityValue.textContent =
                            quantity;

                    }

                }
            );

        }


        /*
         * Add to Cart
         */

        if (addToCartButton) {

            addToCartButton.addEventListener(
                "click",
                async () => {

                    const availableStock =
                        getAvailableStock();


                    if (
                        availableStock <= 0
                    ) {

                        return;

                    }


                    const cartData = {

                        product:
                            product.id,

                        quantity:
                            quantity,

                    };


                    /*
                     * Only send variant when
                     * the product actually has
                     * a selected variant.
                     */

                    if (
                        selectedVariant
                    ) {

                        cartData.variant =
                            selectedVariant.id;

                    }


                    try {

                        addToCartButton.disabled =
                            true;


                        const response =
                            await fetchWithAuth(
                                "/api/cart/add/",
                                {
                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json",
                                    },

                                    body:
                                        JSON.stringify(
                                            cartData
                                        ),
                                }
                            );


                        const data =
                            await response.json();


                        if (!response.ok) {

                            console.error(
                                "Add to cart failed:",
                                data
                            );


                            alert(
                                data.detail ||
                                "Unable to add this item to your cart."
                            );


                            updateProductDisplay();

                            return;

                        }


                        console.log(
                            "Added to cart:",
                            data
                        );


                        addToCartButton.textContent =
                            "Added to Cart ✓";


                    }
                    catch (error) {

                        console.error(
                            "Add to cart error:",
                            error
                        );


                        alert(
                            "Something went wrong. Please try again."
                        );


                        updateProductDisplay();

                    }

                }
            );

        }


        /*
         * Initial product state
         */

        updateProductDisplay();

    }


    loadProduct();

});