document.addEventListener("DOMContentLoaded", () => {


const loadingState =
    document.getElementById("cart-loading");

const errorState =
    document.getElementById("cart-error");

const emptyState =
    document.getElementById("cart-empty");

const cartItemsContainer =
    document.getElementById("cart-items");

const cartSubtotal =
    document.getElementById("cart-subtotal");

const cartTotal =
    document.getElementById("cart-total");


function getEffectivePrice(item) {

    if (
        item.variant &&
        item.variant.price !== null
    ) {

        return Number(
            item.variant.price
        );

    }


    return Number(
        item.product.price
    );

}

function getAvailableStock(item) {

    if (item.variant) {

        return item.variant.stock;

    }


    return item.product.stock;

}


async function loadCart() {

    try {

        const response =
            await fetchWithAuth("/api/cart/");


        if (!response.ok) {

            throw new Error(
                "Unable to load cart."
            );

        }


        const cart =
            await response.json();


        loadingState.style.display =
            "none";
        
        emptyState.hidden = true;

        cartItemsContainer.innerHTML = "";

        if (
            !cart.items ||
            cart.items.length === 0
        ) {

            cartItemsContainer.innerHTML = "";

            cartSubtotal.textContent =
                "₹0";

            cartTotal.textContent =
                "₹0";

            emptyState.hidden = false;

            return;
        }


        cartItemsContainer.innerHTML = "";


        let total = 0;


        cart.items.forEach(
            (item) => {

                const unitPrice =
                    getEffectivePrice(item);

                const availableStock =
                    getAvailableStock(item);

                total +=
                    Number(item.subtotal);


                const cartItem =
                    document.createElement(
                        "article"
                    );

                cartItem.className =
                    "cart-item";


                cartItem.innerHTML = `

                    <img
                        src="${item.product.image}"
                        alt="${item.product.name}"
                        class="cart-item-image"
                    >

                    <div class="cart-item-info">

                        <div>

                            <span
                                class="cart-item-category"
                            >
                                Jewellery
                            </span>

                            <h2
                                class="cart-item-name"
                            >
                                ${item.product.name}
                            </h2>

                            <p
                                class="cart-item-price"
                            >
                                ₹${unitPrice.toLocaleString("en-IN")}
                            </p>

                            ${
                                item.variant
                                    ? `
                                        <p
                                            class="cart-item-variant"
                                        >
                                            ${item.variant.name}
                                        </p>
                                    `
                                    : ""
                            }

                        </div>


                        <div
                            class="cart-item-quantity"
                        >

                            <button
                                type="button"
                                class="quantity-button quantity-decrease"
                                data-item-id="${item.id}"
                            >
                                −
                            </button>

                            <span
                                class="quantity-value"
                            >
                                ${item.quantity}
                            </span>

                            <button
                                type="button"
                                class="quantity-button quantity-increase"
                                data-item-id="${item.id}"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <div
                        class="cart-item-actions"
                    >

                        <span
                            class="cart-item-subtotal"
                        >
                            ₹${Number(
                                item.subtotal
                            ).toLocaleString("en-IN")}
                        </span>

                        <button
                            type="button"
                            class="cart-remove-button"
                            data-item-id="${item.id}"
                        >
                            Remove
                        </button>

                    </div>

                `;


                cartItemsContainer.appendChild(
                    cartItem
                );


                const decreaseButton =
                    cartItem.querySelector(
                        ".quantity-decrease"
                    );

                const increaseButton =
                    cartItem.querySelector(
                        ".quantity-increase"
                    );

                decreaseButton.addEventListener(
                    "click",
                    () => {

                        const newQuantity =
                            item.quantity - 1;


                        if (newQuantity < 1) {
                            return;
                        }


                        updateQuantity(
                            item.id,
                            newQuantity
                        );

                    }
                );


                increaseButton.addEventListener(
                    "click",
                    () => {

                        const newQuantity =
                            item.quantity + 1;


                        if (
                            newQuantity >
                            availableStock
                        ) {

                            return;

                        }


                        updateQuantity(
                            item.id,
                            newQuantity
                        );

                    }
                );

                const removeButton =
                    cartItem.querySelector(
                        ".cart-remove-button"
                    );

                removeButton.addEventListener(
                    "click",
                    () => {

                        removeCartItem(
                            item.id
                        );

                    }
                );

            }
        );


        cartSubtotal.textContent =
            `₹${total.toLocaleString("en-IN")}`;

        cartTotal.textContent =
            `₹${total.toLocaleString("en-IN")}`;


    } catch (error) {

        console.error(
            "Cart loading error:",
            error
        );


        loadingState.style.display =
            "none";

        errorState.textContent =
            "We couldn't load your cart. Please try again.";

        errorState.style.display =
            "block";

    }

}


async function updateQuantity(itemId, quantity) {

    try {

        const response =
            await fetchWithAuth(
                `/api/cart/items/${itemId}/`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        quantity: quantity,
                    }),
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "Quantity update failed:",
                data
            );

            alert(
                data.detail ||
                "Unable to update quantity."
            );

            return;
        }


        console.log(
            "Quantity updated:",
            data
        );


        await loadCart();


    } catch (error) {

        console.error(
            "Quantity update error:",
            error
        );

    }

}


async function removeCartItem(itemId) {

    try {

        const response =
            await fetchWithAuth(
                `/api/cart/items/${itemId}/`,
                {
                    method: "DELETE",
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "Remove item failed:",
                data
            );

            alert(
                data.detail ||
                "Unable to remove item."
            );

            return;
        }


        console.log(
            "Item removed:",
            data
        );


        await loadCart();


    } catch (error) {

        console.error(
            "Remove item error:",
            error
        );

    }

}

loadCart();


});
