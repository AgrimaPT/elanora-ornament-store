document.addEventListener("DOMContentLoaded", () => {
    loadOrders();

    const retryButton = document.getElementById(
        "orders-retry-button"
    );

    if (retryButton) {
        retryButton.addEventListener(
            "click",
            loadOrders
        );
    }
});


async function loadOrders() {
    showLoadingState();

    try {
        const response = await fetchWithAuth(
            "/api/orders/history/"
        );

        if (!response.ok) {
            throw new Error(
                "Failed to load orders."
            );
        }

        const orders = await response.json();

        console.log("Orders:", orders);

        renderOrders(orders);

    } catch (error) {
        console.error(
            "Error loading orders:",
            error
        );

        showErrorState();
    }
}


function renderOrders(orders) {
    const ordersList = document.getElementById(
        "orders-list"
    );

    if (!ordersList) {
        return;
    }

    hideAllStates();

    if (orders.length === 0) {
        showEmptyState();
        return;
    }

    ordersList.hidden = false;

    ordersList.innerHTML = orders
        .map((order) => createOrderCard(order))
        .join("");
}


function createOrderCard(order) {
    const orderDate = new Date(
        order.created_at
    ).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );

    const itemsPreview = order.items
        .map((item) => {
            const variantName = item.variant
                ? ` (${item.variant.name})`
                : "";

            return `
                <div class="order-item-preview">
                    <span>
                        ${item.product.name}${variantName}
                    </span>

                    <span>
                        × ${item.quantity}
                    </span>
                </div>
            `;
        })
        .join("");

    return `
        <article class="order-card">

            <div class="order-card-header">

                <div>
                    <p class="order-label">
                        Order
                    </p>

                    <h2 class="order-number">
                        #${order.order_number}
                    </h2>

                    <p class="order-date">
                        ${orderDate}
                    </p>
                </div>

                <span class="order-status">
                    ${order.order_status}
                </span>

            </div>

            <div class="order-card-items">
                ${itemsPreview}
            </div>

            <div class="order-card-footer">

                <div>
                    <p class="order-label">
                        Total
                    </p>

                    <p class="order-total">
                        ₹${Number(
                            order.total_amount
                        ).toLocaleString("en-IN")}
                    </p>
                </div>

                <a
                    href="/orders/${order.id}/"
                    class="btn order-details-button"
                >
                    View Details
                </a>

            </div>

        </article>
    `;
}


function showLoadingState() {
    const ordersLoading = document.getElementById(
        "orders-loading"
    );

    const ordersList = document.getElementById(
        "orders-list"
    );

    const ordersEmpty = document.getElementById(
        "orders-empty"
    );

    const ordersError = document.getElementById(
        "orders-error"
    );

    if (ordersLoading) {
        ordersLoading.hidden = false;
    }

    if (ordersList) {
        ordersList.hidden = true;
    }

    if (ordersEmpty) {
        ordersEmpty.hidden = true;
    }

    if (ordersError) {
        ordersError.hidden = true;
    }
}


function hideAllStates() {
    const ordersLoading = document.getElementById(
        "orders-loading"
    );

    const ordersEmpty = document.getElementById(
        "orders-empty"
    );

    const ordersError = document.getElementById(
        "orders-error"
    );

    if (ordersLoading) {
        ordersLoading.hidden = true;
    }

    if (ordersEmpty) {
        ordersEmpty.hidden = true;
    }

    if (ordersError) {
        ordersError.hidden = true;
    }
}


function showEmptyState() {
    const ordersEmpty = document.getElementById(
        "orders-empty"
    );

    const ordersList = document.getElementById(
        "orders-list"
    );

    if (ordersEmpty) {
        ordersEmpty.hidden = false;
    }

    if (ordersList) {
        ordersList.hidden = true;
    }
}


function showErrorState() {
    const ordersError = document.getElementById(
        "orders-error"
    );

    const ordersList = document.getElementById(
        "orders-list"
    );

    const ordersEmpty = document.getElementById(
        "orders-empty"
    );

    const ordersLoading = document.getElementById(
        "orders-loading"
    );

    if (ordersError) {
        ordersError.hidden = false;
    }

    if (ordersList) {
        ordersList.hidden = true;
    }

    if (ordersEmpty) {
        ordersEmpty.hidden = true;
    }

    if (ordersLoading) {
        ordersLoading.hidden = true;
    }
}