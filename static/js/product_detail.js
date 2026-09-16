document.addEventListener("DOMContentLoaded", () => {

    const productDetail =
        document.getElementById("product-detail");


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


    function displayProduct(product) {

        const images =
            product.images || [];


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


                    <p class="product-price">
                        ₹${Number(product.price).toLocaleString("en-IN")}
                    </p>


                    <p class="product-stock">

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


        // Thumbnail functionality

        const thumbnails =
            document.querySelectorAll(
                ".product-thumbnail"
            );


        const mainProductImage =
            document.querySelector(
                ".product-main-image img"
            );


        thumbnails.forEach(thumbnail => {

            thumbnail.addEventListener(
                "click",
                () => {

                    mainProductImage.src =
                        thumbnail.dataset.image;


                    thumbnails.forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                    thumbnail.classList.add(
                        "active"
                    );

                }
            );

        });


        if (product.stock > 0) {

            let quantity = 1;

            const quantityValue =
                document.getElementById("quantity-value");

            const decreaseButton =
                document.getElementById("quantity-decrease");

            const increaseButton =
                document.getElementById("quantity-increase");

            const addToCartButton =
                document.getElementById("add-to-cart");


            decreaseButton.addEventListener("click", () => {

                if (quantity > 1) {

                    quantity--;

                    quantityValue.textContent =
                        quantity;

                }

            });


            increaseButton.addEventListener("click", () => {

                if (quantity < product.stock) {

                    quantity++;

                    quantityValue.textContent =
                        quantity;

                }

            });

            addToCartButton.addEventListener(
                "click",
                async () => {

                    try {

                        const response =
                            await fetchWithAuth(
                                "/api/cart/add/",
                                {
                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json",
                                    },

                                    body: JSON.stringify({
                                        product: product.id,
                                        quantity: quantity,
                                    }),
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

                            return;
                        }


                        console.log(
                            "Added to cart:",
                            data
                        );


                        addToCartButton.textContent =
                            "Added to Cart ✓";


                    } catch (error) {

                        console.error(
                            "Add to cart error:",
                            error
                        );

                        alert(
                            "Something went wrong. Please try again."
                        );

                    }

                }
            );

        }

    }


    loadProduct();

});