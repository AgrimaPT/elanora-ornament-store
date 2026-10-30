document.addEventListener("DOMContentLoaded", () => {

    const loadingState = document.getElementById("cart-loading");
    const errorState = document.getElementById("cart-error");
    const errorMessage = document.getElementById("cart-error-message");
    const retryButton = document.getElementById("cart-retry-button");
    const emptyState = document.getElementById("cart-empty");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartFooterActions = document.getElementById("cart-footer-actions");
    const cartSubtotal = document.getElementById("cart-subtotal");
    const cartTotal = document.getElementById("cart-total");
    const checkoutButton = document.getElementById("cart-checkout-button");

    if (retryButton) {
        retryButton.addEventListener("click", () => {
            loadCart();
        });
    }

    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getEffectivePrice(item) {
        if (item.variant && item.variant.price !== null) {
            return Number(item.variant.price);
        }
        return Number(item.product.price);
    }

    function getAvailableStock(item) {
        if (item.variant) {
            return item.variant.stock;
        }
        return item.product.stock;
    }

    function setCheckoutState(isEnabled) {
        if (!checkoutButton) return;
        if (isEnabled) {
            checkoutButton.classList.remove("disabled");
            checkoutButton.removeAttribute("aria-disabled");
            checkoutButton.removeAttribute("tabindex");
        } else {
            checkoutButton.classList.add("disabled");
            checkoutButton.setAttribute("aria-disabled", "true");
            checkoutButton.setAttribute("tabindex", "-1");
        }
    }

    async function loadCart() {
        try {
            if (loadingState) {
                loadingState.style.display = "block";
            }
            if (errorState) {
                errorState.hidden = true;
            }

            const response = await fetchWithAuth("/api/cart/");

            if (!response.ok) {
                throw new Error("Unable to load cart. Status: " + response.status);
            }

            const cart = await response.json();

            // Refresh the navbar cart badge count.
            if (typeof window.updateNavbarCartCount === "function") {
                window.updateNavbarCartCount();
            }

            if (loadingState) {
                loadingState.style.display = "none";
            }

            const items = Array.isArray(cart.items) ? cart.items : [];

            if (items.length === 0) {
                cartItemsContainer.innerHTML = "";
                if (emptyState) {
                    emptyState.hidden = false;
                }
                if (cartFooterActions) {
                    cartFooterActions.hidden = true;
                }
                cartSubtotal.textContent = "₹0";
                cartTotal.textContent = "₹0";
                setCheckoutState(false);
                return;
            }

            if (emptyState) {
                emptyState.hidden = true;
            }
            if (cartFooterActions) {
                cartFooterActions.hidden = false;
            }
            setCheckoutState(true);

            cartItemsContainer.innerHTML = "";
            let total = 0;

            items.forEach((item) => {
                const unitPrice = getEffectivePrice(item);
                const availableStock = getAvailableStock(item);
                total += Number(item.subtotal);

                const productUrl = `/product/${encodeURIComponent(item.product.slug)}/`;
                const isDecreaseDisabled = item.quantity <= 1;
                const isIncreaseDisabled = item.quantity >= availableStock;

                const cartItem = document.createElement("article");
                cartItem.className = "cart-item";
                cartItem.setAttribute("role", "listitem");
                cartItem.dataset.itemId = String(item.id);

                const imageMarkup = item.product.image
                    ? `<img src="${encodeURI(item.product.image)}" alt="${escapeHtml(item.product.name)}" class="cart-item-image">`
                    : `<div class="cart-item-image-fallback" aria-hidden="true"><i class="bi bi-gem"></i></div>`;

                const variantMarkup = item.variant
                    ? `<p class="cart-item-variant">Size / Variant: ${escapeHtml(item.variant.name)}</p>`
                    : "";

                cartItem.innerHTML = `
                    <a href="${productUrl}" class="cart-item-image-wrapper" aria-label="View ${escapeHtml(item.product.name)}">
                        ${imageMarkup}
                    </a>

                    <div class="cart-item-info">
                        <h2 class="cart-item-name">
                            <a href="${productUrl}" class="cart-item-link">
                                ${escapeHtml(item.product.name)}
                            </a>
                        </h2>

                        ${variantMarkup}

                        <p class="cart-item-price">
                            ₹${unitPrice.toLocaleString("en-IN")}
                        </p>

                        <div class="cart-item-quantity" role="group" aria-label="Quantity for ${escapeHtml(item.product.name)}">
                            <button
                                type="button"
                                class="quantity-button quantity-decrease"
                                data-item-id="${item.id}"
                                aria-label="Decrease quantity"
                                ${isDecreaseDisabled ? "disabled" : ""}
                            >
                                −
                            </button>

                            <span class="quantity-value" aria-live="polite">
                                ${item.quantity}
                            </span>

                            <button
                                type="button"
                                class="quantity-button quantity-increase"
                                data-item-id="${item.id}"
                                aria-label="Increase quantity"
                                ${isIncreaseDisabled ? "disabled" : ""}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div class="cart-item-actions">
                        <span class="cart-item-subtotal" aria-label="Subtotal">
                            ₹${Number(item.subtotal).toLocaleString("en-IN")}
                        </span>

                        <button
                            type="button"
                            class="cart-remove-button"
                            data-item-id="${item.id}"
                            aria-label="Remove ${escapeHtml(item.product.name)} from bag"
                        >
                            Remove
                        </button>
                    </div>
                `;

                cartItemsContainer.appendChild(cartItem);

                // Wire decrease button
                const decreaseButton = cartItem.querySelector(".quantity-decrease");
                decreaseButton.addEventListener("click", () => {
                    const newQuantity = item.quantity - 1;
                    if (newQuantity < 1) return;
                    updateQuantity(item.id, newQuantity, cartItem);
                });

                // Wire increase button
                const increaseButton = cartItem.querySelector(".quantity-increase");
                increaseButton.addEventListener("click", () => {
                    const newQuantity = item.quantity + 1;
                    if (newQuantity > availableStock) return;
                    updateQuantity(item.id, newQuantity, cartItem);
                });

                // Wire remove button
                const removeButton = cartItem.querySelector(".cart-remove-button");
                removeButton.addEventListener("click", () => {
                    removeCartItem(item.id, cartItem);
                });
            });

            cartSubtotal.textContent = `₹${total.toLocaleString("en-IN")}`;
            cartTotal.textContent = `₹${total.toLocaleString("en-IN")}`;

        } catch (error) {
            console.error("Cart loading error:", error);
            if (loadingState) {
                loadingState.style.display = "none";
            }
            if (errorState) {
                if (errorMessage) {
                    errorMessage.textContent = "We couldn't retrieve your cart details. Please check your connection and try again.";
                }
                errorState.hidden = false;
            }
        }
    }

    async function updateQuantity(itemId, quantity, itemElement) {
        if (itemElement) {
            itemElement.classList.add("is-updating");
        }

        try {
            const response = await fetchWithAuth(
                `/api/cart/items/${itemId}/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        quantity: quantity,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("Quantity update failed:", data);
                if (itemElement) {
                    itemElement.classList.remove("is-updating");
                }
                showInlineNotification(data.detail || "Unable to update quantity.");
                return;
            }

            await loadCart();

        } catch (error) {
            console.error("Quantity update error:", error);
            if (itemElement) {
                itemElement.classList.remove("is-updating");
            }
            showInlineNotification("Network issue while updating quantity. Please try again.");
        }
    }

    async function removeCartItem(itemId, itemElement) {
        if (itemElement) {
            itemElement.classList.add("is-updating");
        }

        try {
            const response = await fetchWithAuth(
                `/api/cart/items/${itemId}/`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                console.error("Remove item failed:", data);
                if (itemElement) {
                    itemElement.classList.remove("is-updating");
                }
                showInlineNotification(data.detail || "Unable to remove item from bag.");
                return;
            }

            await loadCart();

        } catch (error) {
            console.error("Remove item error:", error);
            if (itemElement) {
                itemElement.classList.remove("is-updating");
            }
            showInlineNotification("Network issue while removing item. Please try again.");
        }
    }

    function showInlineNotification(message) {
        let toast = document.getElementById("cart-notification");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "cart-notification";
            toast.className = "cart-notification-banner";
            toast.setAttribute("role", "alert");
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add("is-visible");

        setTimeout(() => {
            toast.classList.remove("is-visible");
        }, 4000);
    }

    // Initial cart load
    loadCart();

});
