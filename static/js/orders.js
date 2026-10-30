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


/* ========================================
   LOAD ORDERS
======================================== */

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


/* ========================================
   RENDER ORDERS
======================================== */

function renderOrders(orders) {

    const ordersList = document.getElementById(
        "orders-list"
    );

    if (!ordersList) {
        return;
    }

    hideAllStates();

    if (!orders || orders.length === 0) {
        showEmptyState();
        return;
    }

    ordersList.hidden = false;

    ordersList.innerHTML = orders
        .map((order) => createOrderCard(order))
        .join("");
}


/* ========================================
   CREATE ORDER CARD
======================================== */

function createOrderCard(order) {

    const orderDate = new Date(
        order.created_at
    ).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );


    /* ------------------------------------
       ORDER STATUS
    ------------------------------------ */

    const status = escapeHTML(
        order.order_status || "Processing"
    );

    const statusClass = getStatusClass(
        order.order_status
    );


    /* ------------------------------------
       ORDER ITEMS
    ------------------------------------ */

    const items = Array.isArray(order.items)
        ? order.items
        : [];

    const visibleItems = items.slice(0, 3);

    const itemsPreview = visibleItems
        .map((item) => {

            const productName =
                item.product?.name ||
                "Product";

            const variantName =
                item.variant?.name
                    ? ` · ${item.variant.name}`
                    : "";

            return `
                <div class="order-item-preview">

                    <div class="order-item-preview-info">

                        <span class="order-item-name">
                            ${escapeHTML(productName)}
                        </span>

                        ${
                            variantName
                                ? `
                                    <span class="order-item-variant">
                                        ${escapeHTML(
                                            variantName
                                        )}
                                    </span>
                                `
                                : ""
                        }

                    </div>

                    <span class="order-item-quantity">
                        × ${Number(
                            item.quantity || 0
                        )}
                    </span>

                </div>
            `;
        })
        .join("");


    /* ------------------------------------
       REMAINING ITEMS
    ------------------------------------ */

    const remainingItems =
        items.length > 3
            ? `
                <p class="order-more-items">
                    + ${items.length - 3}
                    more ${
                        items.length - 3 === 1
                            ? "item"
                            : "items"
                    }
                </p>
              `
            : "";


    /* ------------------------------------
       TOTAL
    ------------------------------------ */

    const totalAmount =
        Number(order.total_amount || 0)
            .toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                }
            );


    /* ------------------------------------
       RETURN CARD
    ------------------------------------ */

    return `
        <article class="order-card">

            <div class="order-card-inner">


                <!-- =========================
                     CARD HEADER
                ========================== -->

                <header class="order-card-header">

                    <div class="order-card-heading">

                        <p class="order-label">
                            Order
                        </p>

                        <h2 class="order-number">
                            #${escapeHTML(
                                order.order_number
                            )}
                        </h2>

                        <p class="order-date">
                            ${orderDate}
                        </p>

                    </div>


                    <span
                        class="
                            order-status
                            ${statusClass}
                        "
                    >
                        ${status}
                    </span>

                </header>


                <!-- =========================
                     ORDER ITEMS
                ========================== -->

                <div class="order-card-items">

                    <p class="order-items-label">
                        Items
                    </p>

                    <div class="order-items-list">

                        ${
                            itemsPreview ||
                            `
                                <p class="order-no-items">
                                    Order items unavailable.
                                </p>
                            `
                        }

                    </div>

                    ${remainingItems}

                </div>


                <!-- =========================
                     CARD FOOTER
                ========================== -->

                <footer class="order-card-footer">

                    <div class="order-total-wrapper">

                        <p class="order-label">
                            Order Total
                        </p>

                        <p class="order-total">
                            ₹${totalAmount}
                        </p>

                    </div>


                    <a
                        href="/orders/${encodeURIComponent(
                            order.id
                        )}/"
                        class="order-details-button"
                    >
                        <span>
                            View Order
                        </span>

                        <i
                            class="fa-solid fa-arrow-right"
                            aria-hidden="true"
                        ></i>

                    </a>

                </footer>


            </div>

        </article>
    `;
}


/* ========================================
   ORDER STATUS CLASS
======================================== */

function getStatusClass(status) {

    if (!status) {
        return "status-default";
    }

    const normalizedStatus =
        status
            .toLowerCase()
            .replace(/\s+/g, "-");


    const statusMap = {

        pending:
            "status-pending",

        confirmed:
            "status-confirmed",

        processing:
            "status-processing",

        shipped:
            "status-shipped",

        delivered:
            "status-delivered",

        cancelled:
            "status-cancelled",

        canceled:
            "status-cancelled",

        failed:
            "status-cancelled",

    };

    return (
        statusMap[normalizedStatus] ||
        "status-default"
    );
}


/* ========================================
   HTML ESCAPING
======================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ========================================
   LOADING STATE
======================================== */

function showLoadingState() {

    const ordersLoading =
        document.getElementById(
            "orders-loading"
        );

    const ordersList =
        document.getElementById(
            "orders-list"
        );

    const ordersEmpty =
        document.getElementById(
            "orders-empty"
        );

    const ordersError =
        document.getElementById(
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


/* ========================================
   HIDE ALL STATES
======================================== */

function hideAllStates() {

    const ordersLoading =
        document.getElementById(
            "orders-loading"
        );

    const ordersEmpty =
        document.getElementById(
            "orders-empty"
        );

    const ordersError =
        document.getElementById(
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


/* ========================================
   EMPTY STATE
======================================== */

function showEmptyState() {

    const ordersEmpty =
        document.getElementById(
            "orders-empty"
        );

    const ordersList =
        document.getElementById(
            "orders-list"
        );


    if (ordersEmpty) {
        ordersEmpty.hidden = false;
    }

    if (ordersList) {
        ordersList.hidden = true;
    }
}


/* ========================================
   ERROR STATE
======================================== */

function showErrorState() {

    const ordersError =
        document.getElementById(
            "orders-error"
        );

    const ordersList =
        document.getElementById(
            "orders-list"
        );

    const ordersEmpty =
        document.getElementById(
            "orders-empty"
        );

    const ordersLoading =
        document.getElementById(
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