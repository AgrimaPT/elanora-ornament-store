document.addEventListener("DOMContentLoaded", () => {
    loadOrderDetails();

    const retryButton = document.getElementById(
        "order-detail-retry-button"
    );

    if (retryButton) {
        retryButton.addEventListener(
            "click",
            loadOrderDetails
        );
    }

    const cancelButton = document.getElementById(
        "cancel-order-button"
    );

    if (cancelButton) {
        cancelButton.addEventListener(
            "click",
            cancelOrder
        );
    }
});


async function loadOrderDetails() {
    showLoadingState();

    try {
        const orderId = getOrderIdFromUrl();

        const response = await fetchWithAuth(
            `/api/orders/${orderId}/`
        );

        if (!response.ok) {
            throw new Error(
                "Failed to load order details."
            );
        }

        const order = await response.json();

        console.log(
            "Order details:",
            order
        );

        renderOrderDetails(order);

    } catch (error) {
        console.error(
            "Error loading order details:",
            error
        );

        showErrorState();
    }
}


function getOrderIdFromUrl() {
    const pathParts = window.location.pathname
        .split("/")
        .filter(Boolean);

    return pathParts[pathParts.length - 1];
}


function renderOrderDetails(order) {
    const orderContent = document.getElementById(
        "order-detail-content"
    );

    if (!orderContent) {
        return;
    }

    document.getElementById(
        "order-number"
    ).textContent = `#${order.order_number}`;

    document.getElementById(
        "order-date"
    ).textContent = formatOrderDate(
        order.created_at
    );

    document.getElementById(
        "order-status"
    ).textContent = order.order_status;

    document.getElementById(
        "order-total"
    ).textContent = formatCurrency(
        order.total_amount
    );

    document.getElementById(
        "payment-status"
    ).textContent = order.payment_status;

    renderOrderItems(order.items);

    renderShippingAddress(
        order.shipping_address
    );

    updateOrderActions(
        order
    );

    hideLoadingState();

    orderContent.hidden = false;
}


function renderOrderItems(items) {
    const itemsContainer = document.getElementById(
        "order-items"
    );

    if (!itemsContainer) {
        return;
    }

    itemsContainer.innerHTML = items
        .map((item) => {
            const variantName = item.variant
                ? item.variant.name
                : "";

            const variantMarkup = variantName
                ? `
                    <p class="order-item-variant">
                        ${variantName}
                    </p>
                `
                : "";

            return `
                <div class="order-detail-item">

                    <div class="order-item-info">

                        <h3>
                            ${item.product.name}
                        </h3>

                        ${variantMarkup}

                    </div>

                    <div class="order-item-quantity">
                        × ${item.quantity}
                    </div>

                    <div class="order-item-price">

                        ${formatCurrency(
                            item.subtotal
                        )}

                    </div>

                </div>
            `;
        })
        .join("");
}


function renderShippingAddress(address) {
    const addressContainer = document.getElementById(
        "shipping-address"
    );

    if (!addressContainer) {
        return;
    }

    const addressLine2 = address.address_line_2
        ? `
            <div>
                ${address.address_line_2}
            </div>
        `
        : "";

    addressContainer.innerHTML = `
        <div>
            <strong>
                ${address.full_name}
            </strong>
        </div>

        <div>
            ${address.phone_number}
        </div>

        <div>
            ${address.address_line_1}
        </div>

        ${addressLine2}

        <div>
            ${address.city},
            ${address.state}
            -
            ${address.pincode}
        </div>
    `;
}


function updateOrderActions(order) {
    const actionsContainer = document.getElementById(
        "order-actions"
    );

    const cancelButton = document.getElementById(
        "cancel-order-button"
    );

    if (
        !actionsContainer ||
        !cancelButton
    ) {
        return;
    }

    const canCancel =
        order.order_status === "PENDING" ||
        order.order_status === "CONFIRMED";

    if (canCancel) {
        actionsContainer.hidden = false;
    } else {
        actionsContainer.hidden = true;
    }
}


function formatOrderDate(dateString) {
    return new Date(
        dateString
    ).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );
}


function formatCurrency(amount) {
    return `₹${Number(
        amount
    ).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;
}


function showLoadingState() {
    const loading = document.getElementById(
        "order-detail-loading"
    );

    const error = document.getElementById(
        "order-detail-error"
    );

    const content = document.getElementById(
        "order-detail-content"
    );

    if (loading) {
        loading.hidden = false;
    }

    if (error) {
        error.hidden = true;
    }

    if (content) {
        content.hidden = true;
    }
}


function hideLoadingState() {
    const loading = document.getElementById(
        "order-detail-loading"
    );

    if (loading) {
        loading.hidden = true;
    }
}


function showErrorState() {
    const loading = document.getElementById(
        "order-detail-loading"
    );

    const error = document.getElementById(
        "order-detail-error"
    );

    const content = document.getElementById(
        "order-detail-content"
    );

    if (loading) {
        loading.hidden = true;
    }

    if (error) {
        error.hidden = false;
    }

    if (content) {
        content.hidden = true;
    }
}


async function cancelOrder() {
    const orderId = getOrderIdFromUrl();

    const confirmed = window.confirm(
        "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
        return;
    }

    const cancelButton = document.getElementById(
        "cancel-order-button"
    );

    if (cancelButton) {
        cancelButton.disabled = true;
        cancelButton.textContent = "Cancelling...";
    }

    try {
        const response = await fetchWithAuth(
            `/api/orders/${orderId}/cancel/`,
            {
                method: "POST",
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail ||
                "Unable to cancel the order."
            );
        }

        await loadOrderDetails();

    } catch (error) {
        console.error(
            "Error cancelling order:",
            error
        );

        alert(
            error.message ||
            "Unable to cancel the order. Please try again."
        );

        if (cancelButton) {
            cancelButton.disabled = false;
            cancelButton.textContent = "Cancel Order";
        }
    }
}
