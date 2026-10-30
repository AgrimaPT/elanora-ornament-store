document.addEventListener("DOMContentLoaded", () => {

    const productDetail = document.getElementById("product-detail");
    let selectedVariant = null;
    let currentQuantity = 1;

    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    async function loadProduct() {
        try {
            const response = await fetch(`/api/products/${encodeURIComponent(productSlug)}/`);

            if (!response.ok) {
                throw new Error("Failed to fetch product");
            }

            const product = await response.json();

            if (product.name) {
                document.title = `${product.name} | ELANORA`;
            }

            displayProduct(product);

        } catch (error) {
            console.error("Error loading product:", error);

            productDetail.innerHTML = `
                <div class="product-not-found" role="alert">
                    <span class="section-eyebrow">THE COLLECTION</span>
                    <h2>Piece not found</h2>
                    <p>We couldn't find the jewellery piece you're looking for.</p>
                    <a href="/shop/" class="product-not-found-link">
                        Return to Collection
                    </a>
                </div>
            `;
        }
    }

    function getEffectivePrice(product, variant) {
        if (variant && variant.price !== null && variant.price !== undefined) {
            return Number(variant.price);
        }
        return Number(product.price);
    }

    function displayProduct(product) {
        const images = Array.isArray(product.images) ? product.images : [];
        const variants = (Array.isArray(product.variants) ? product.variants : [])
            .filter(v => v.is_active);

        // Auto-select first in-stock variant if available
        if (variants.length > 0) {
            selectedVariant = variants.find(v => v.stock > 0) || variants[0];
        } else {
            selectedVariant = null;
        }

        const mainImage = images.length > 0 ? images[0].image : "";
        const categoryName = product.category ? product.category.name : "The Collection";
        const categorySlug = product.category ? product.category.slug : "";

        const effectivePrice = getEffectivePrice(product, selectedVariant);
        const availableStock = getAvailableStock(product, selectedVariant);

        // Build breadcrumb
        const categoryBreadcrumb = product.category
            ? `<a href="/shop/?category=${encodeURIComponent(categorySlug)}">${escapeHtml(categoryName)}</a><span class="breadcrumb-separator">/</span>`
            : "";

        const breadcrumbsHtml = `
            <nav class="product-breadcrumbs" aria-label="Breadcrumb">
                <a href="/">Home</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/shop/">Collection</a>
                <span class="breadcrumb-separator">/</span>
                ${categoryBreadcrumb}
                <span class="breadcrumb-current" aria-current="page">${escapeHtml(product.name)}</span>
            </nav>
        `;

        // Build gallery
        const mainImageMarkup = mainImage
            ? `<img src="${encodeURI(mainImage)}" alt="${escapeHtml(product.name)}" id="main-product-img">`
            : `<div class="product-main-image-fallback" aria-hidden="true"><i class="bi bi-gem"></i></div>`;

        const thumbnailsMarkup = images.length > 1
            ? `
                <div class="product-thumbnails" role="tablist" aria-label="Product image gallery">
                    ${images.map((item, index) => `
                        <button
                            type="button"
                            class="product-thumbnail ${index === 0 ? "active" : ""}"
                            data-image="${encodeURI(item.image)}"
                            role="tab"
                            aria-selected="${index === 0 ? "true" : "false"}"
                            aria-label="Image ${index + 1} of ${images.length}"
                        >
                            <img src="${encodeURI(item.image)}" alt="${escapeHtml(product.name)} preview ${index + 1}">
                        </button>
                    `).join("")}
                </div>
              `
            : "";

        // Build variants markup
        const variantsMarkup = variants.length > 0
            ? `
                <div class="product-variants">
                    <span class="variant-label" id="variant-label">Select Size / Variant</span>
                    <div class="variant-options" role="radiogroup" aria-labelledby="variant-label">
                        ${variants.map(variant => {
                            const isSelected = selectedVariant && selectedVariant.id === variant.id;
                            const isOutOfStock = variant.stock <= 0;
                            return `
                                <button
                                    type="button"
                                    class="variant-option ${isSelected ? "selected" : ""}"
                                    data-variant-id="${variant.id}"
                                    role="radio"
                                    aria-checked="${isSelected ? "true" : "false"}"
                                    ${isOutOfStock ? "disabled" : ""}
                                    aria-label="${escapeHtml(variant.name)}${isOutOfStock ? ' (Out of stock)' : ''}"
                                >
                                    ${escapeHtml(variant.name)}
                                </button>
                            `;
                        }).join("")}
                    </div>
                </div>
              `
            : "";

        // Build stock badge
        const stockBadgeMarkup = availableStock > 0
            ? `<div class="product-stock in-stock" id="product-stock" role="status"><i class="bi bi-check-circle" aria-hidden="true"></i> In Stock</div>`
            : `<div class="product-stock out-of-stock" id="product-stock" role="status"><i class="bi bi-x-circle" aria-hidden="true"></i> Currently Out of Stock</div>`;

        // Build description section if description exists in data
        const descriptionMarkup = product.description && product.description.trim()
            ? `
                <div class="product-description-section">
                    <h3 class="product-description-title">About This Piece</h3>
                    <div class="product-description-text">
                        ${escapeHtml(product.description)
                            .split(/\n\n+/)
                            .filter(Boolean)
                            .map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`)
                            .join("")}
                    </div>
                </div>
              `
            : "";

        productDetail.innerHTML = `
            ${breadcrumbsHtml}

            <div class="product-detail-layout">

                <!-- Product Gallery -->
                <div class="product-gallery">
                    <div class="product-main-image">
                        ${mainImageMarkup}
                    </div>
                    ${thumbnailsMarkup}
                </div>

                <!-- Product Content -->
                <div class="product-detail-content">
                    <span class="section-eyebrow">${escapeHtml(categoryName)}</span>
                    <h1 class="product-detail-title">${escapeHtml(product.name)}</h1>

                    <div class="product-price-container">
                        <p class="product-price" id="product-price">
                            ₹${effectivePrice.toLocaleString("en-IN")}
                        </p>
                        <span class="product-price-tax-note">Taxes included</span>
                    </div>

                    ${stockBadgeMarkup}

                    ${variantsMarkup}

                    <div class="product-purchase">
                        <div class="product-purchase-row">
                            <div class="product-quantity" role="group" aria-label="Quantity selector">
                                <button
                                    type="button"
                                    class="quantity-button"
                                    id="quantity-decrease"
                                    aria-label="Decrease quantity"
                                    ${currentQuantity <= 1 || availableStock <= 0 ? "disabled" : ""}
                                >
                                    −
                                </button>
                                <span class="quantity-value" id="quantity-value" aria-live="polite">
                                    ${currentQuantity}
                                </span>
                                <button
                                    type="button"
                                    class="quantity-button"
                                    id="quantity-increase"
                                    aria-label="Increase quantity"
                                    ${currentQuantity >= availableStock || availableStock <= 0 ? "disabled" : ""}
                                >
                                    +
                                </button>
                            </div>

                            <button
                                type="button"
                                class="add-to-cart-button ${availableStock <= 0 ? "out-of-stock-button" : ""}"
                                id="add-to-cart"
                                ${availableStock <= 0 ? "disabled" : ""}
                            >
                                ${availableStock > 0 ? "Add to Cart" : "Out of Stock"}
                            </button>
                        </div>

                        <!-- Inline Feedback Container -->
                        <div id="cart-feedback-container" class="product-cart-feedback" hidden role="status" aria-live="polite"></div>
                    </div>

                    ${descriptionMarkup}

                </div>

            </div>
        `;

        setupThumbnailInteractions();
        setupPurchaseControls(product, variants);
    }

    function setupThumbnailInteractions() {
        const thumbnails = document.querySelectorAll(".product-thumbnail");
        const mainImageElement = document.getElementById("main-product-img");

        if (!mainImageElement) return;

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener("click", () => {
                const newSrc = thumbnail.dataset.image;
                if (!newSrc) return;

                mainImageElement.src = newSrc;

                thumbnails.forEach(t => {
                    t.classList.remove("active");
                    t.setAttribute("aria-selected", "false");
                });

                thumbnail.classList.add("active");
                thumbnail.setAttribute("aria-selected", "true");
            });
        });
    }

    function getAvailableStock(product, variant) {
        if (variant && variant.stock !== undefined && variant.stock !== null) {
            return Number(variant.stock);
        }
        return Number(product.stock || 0);
    }

    function setupPurchaseControls(product, variants) {
        const quantityValue = document.getElementById("quantity-value");
        const decreaseButton = document.getElementById("quantity-decrease");
        const increaseButton = document.getElementById("quantity-increase");
        const addToCartButton = document.getElementById("add-to-cart");
        const priceElement = document.getElementById("product-price");
        const stockElement = document.getElementById("product-stock");
        const feedbackContainer = document.getElementById("cart-feedback-container");

        function updateDisplay() {
            const effectivePrice = getEffectivePrice(product, selectedVariant);
            const availableStock = getAvailableStock(product, selectedVariant);

            priceElement.textContent = `₹${effectivePrice.toLocaleString("en-IN")}`;

            if (availableStock > 0) {
                stockElement.className = "product-stock in-stock";
                stockElement.innerHTML = `<i class="bi bi-check-circle" aria-hidden="true"></i> In Stock`;
            } else {
                stockElement.className = "product-stock out-of-stock";
                stockElement.innerHTML = `<i class="bi bi-x-circle" aria-hidden="true"></i> Currently Out of Stock`;
            }

            if (currentQuantity > availableStock && availableStock > 0) {
                currentQuantity = availableStock;
            } else if (availableStock <= 0) {
                currentQuantity = 1;
            }

            if (currentQuantity < 1) {
                currentQuantity = 1;
            }

            quantityValue.textContent = currentQuantity;

            decreaseButton.disabled = currentQuantity <= 1 || availableStock <= 0;
            increaseButton.disabled = currentQuantity >= availableStock || availableStock <= 0;

            if (addToCartButton) {
                const canAdd = availableStock > 0;
                addToCartButton.disabled = !canAdd;
                addToCartButton.classList.toggle("out-of-stock-button", !canAdd);
                addToCartButton.textContent = canAdd ? "Add to Cart" : "Out of Stock";
            }
        }

        // Variant selection listeners
        const variantButtons = document.querySelectorAll(".variant-option");
        variantButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                if (btn.disabled) return;

                const variantId = Number(btn.dataset.variantId);
                selectedVariant = variants.find(v => v.id === variantId) || null;

                variantButtons.forEach(b => {
                    b.classList.remove("selected");
                    b.setAttribute("aria-checked", "false");
                });

                btn.classList.add("selected");
                btn.setAttribute("aria-checked", "true");

                currentQuantity = 1;
                updateDisplay();
            });
        });

        // Quantity decrement
        if (decreaseButton) {
            decreaseButton.addEventListener("click", () => {
                if (currentQuantity > 1) {
                    currentQuantity--;
                    updateDisplay();
                }
            });
        }

        // Quantity increment
        if (increaseButton) {
            increaseButton.addEventListener("click", () => {
                const availableStock = getAvailableStock(product, selectedVariant);
                if (currentQuantity < availableStock) {
                    currentQuantity++;
                    updateDisplay();
                }
            });
        }

        function showFeedback(message, isError = false) {
            if (!feedbackContainer) return;
            feedbackContainer.innerHTML = message;
            feedbackContainer.hidden = false;
            if (isError) {
                feedbackContainer.style.borderLeftColor = "#9f3d3d";
            } else {
                feedbackContainer.style.borderLeftColor = "var(--color-gold, #B89B5E)";
            }
        }

        // Add to cart listener
        if (addToCartButton) {
            addToCartButton.addEventListener("click", async () => {
                const availableStock = getAvailableStock(product, selectedVariant);
                if (availableStock <= 0) return;

                const cartData = {
                    product: product.id,
                    quantity: currentQuantity,
                };

                if (selectedVariant) {
                    cartData.variant = selectedVariant.id;
                }

                try {
                    addToCartButton.disabled = true;
                    addToCartButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding...`;

                    const response = await fetchWithAuth(
                        "/api/cart/add/",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(cartData),
                        }
                    );

                    const data = await response.json();

                    if (!response.ok) {
                        console.error("Add to cart failed:", data);
                        showFeedback(data.detail || "Unable to add this item to your bag.", true);
                        updateDisplay();
                        return;
                    }

                    addToCartButton.textContent = "Added to Bag ✓";

                    // Refresh navbar cart badge
                    if (typeof window.updateNavbarCartCount === "function") {
                        await window.updateNavbarCartCount();
                    }

                    // Show inline feedback with direct links
                    showFeedback(`
                        <span>Added to your shopping bag.</span>
                        <div class="product-cart-feedback-actions">
                            <a href="/cart/" class="product-cart-feedback-link">View Bag</a>
                            <a href="/checkout/" class="product-cart-feedback-link">Checkout</a>
                        </div>
                    `, false);

                    setTimeout(() => {
                        updateDisplay();
                    }, 3500);

                } catch (error) {
                    console.error("Add to cart error:", error);
                    showFeedback("An unexpected error occurred. Please try again.", true);
                    updateDisplay();
                }
            });
        }

        updateDisplay();
    }

    loadProduct();

});