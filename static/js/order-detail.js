
document.addEventListener("DOMContentLoaded", () => {
    const orderId = getOrderIdFromUrl();
    const loadingElement = document.getElementById("order-detail-loading");
    const errorElement = document.getElementById("order-detail-error");
    const errorMessageElement = document.getElementById("order-detail-error-message");
    const contentElement = document.getElementById("order-detail-content");
    const retryButton = document.getElementById("order-detail-retry-button");
    const cancelButton = document.getElementById("cancel-order-button");

    let refreshTimer = null;
    let currentOrder = null;
    let isLoading = false;
    let isCancelling = false;

    const ORDER_STEPS = [
        {
            status: "PENDING",
            title: "Order placed",
            description: "Your order has been received.",
            icon: "fa-box"
        },
        {
            status: "CONFIRMED",
            title: "Order confirmed",
            description: "Your order is confirmed and moving forward.",
            icon: "fa-circle-check"
        },
        {
            status: "PROCESSING",
            title: "Being prepared",
            description: "Your selected pieces are being prepared.",
            icon: "fa-gem"
        },
        {
            status: "SHIPPED",
            title: "On its way",
            description: "Your order has been shipped.",
            icon: "fa-truck-fast"
        },
        {
            status: "DELIVERED",
            title: "Delivered",
            description: "Your order has reached its destination.",
            icon: "fa-gift"
        }
    ];

    const ORDER_UPDATES = {
        PENDING: {
            title: "We've received your order",
            message: "Your order is in our system. We'll keep you updated as it progresses.",
            icon: "fa-box",
            style: ""
        },
        CONFIRMED: {
            title: "Your order is confirmed",
            message: "Your order is confirmed and will move to preparation soon.",
            icon: "fa-circle-check",
            style: "is-success"
        },
        PROCESSING: {
            title: "Your order is being prepared",
            message: "We're preparing your order. We'll update you when it ships.",
            icon: "fa-gem",
            style: ""
        },
        SHIPPED: {
            title: "Your order is on its way",
            message: "Your order has been shipped. Please keep an eye out for delivery updates.",
            icon: "fa-truck-fast",
            style: "is-success"
        },
        DELIVERED: {
            title: "Your order has been delivered",
            message: "We hope you love your ELANORA pieces. Thank you for choosing us.",
            icon: "fa-gift",
            style: "is-success"
        },
        CANCELLED: {
            title: "This order has been cancelled",
            message: "Your order is cancelled. See the payment update below if a refund applies.",
            icon: "fa-circle-xmark",
            style: "is-danger"
        }
    };

    if (!orderId) {
        showErrorState("We couldn't identify this order. Please return to your orders and try again.");
        return;
    }

    retryButton.addEventListener("click", () => loadOrderDetails());

    if (cancelButton) {
        cancelButton.addEventListener("click", openCancellationDialog);
    }

    const backLink = document.querySelector(".order-back-link");
    if (
        backLink &&
        document.referrer &&
        document.referrer.includes("/profile")
    ) {
        backLink.href = "/profile/#orders";
    }

    loadOrderDetails();

    refreshTimer = window.setInterval(() => {
        if (!document.hidden && !isLoading && !isCancelling) {
            loadOrderDetails({ silent: true });
        }
    }, 15000);

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden && !isLoading && !isCancelling) {
            loadOrderDetails({ silent: true });
        }
    });

    window.addEventListener("pagehide", () => {
        if (refreshTimer) {
            window.clearInterval(refreshTimer);
        }
    });

    async function loadOrderDetails({ silent = false } = {}) {
        if (isLoading) return;
        isLoading = true;

        if (!silent) {
            showLoadingState();
        }

        try {
            const response = await fetchWithAuth(`/api/orders/${encodeURIComponent(orderId)}/`);

            if (!response.ok) {
                let message = "We couldn't load your order. Please try again.";

                try {
                    const errorData = await response.json();
                    message =
                        errorData.detail ||
                        errorData.message ||
                        message;
                } catch (_) {
                    // Keep the default message if the response isn't JSON.
                }

                throw new Error(message);
            }

            const order = await response.json();

            if (!order || !order.order_number) {
                throw new Error("The order information returned was incomplete.");
            }

            currentOrder = order;
            renderOrderDetails(order);
            showContentState();
        } catch (error) {
            if (!silent || !currentOrder) {
                showErrorState(
                    error.message || "Something went wrong while loading your order."
                );
            }
        } finally {
            isLoading = false;
        }
    }

    function getOrderIdFromUrl() {
        const pathParts = window.location.pathname
            .split("/")
            .filter(Boolean);

        // Supports /orders/123/ and /orders/123/details/.
        if (pathParts.length >= 2 && pathParts[0] === "orders") {
            return pathParts[1];
        }

        return null;
    }

    function renderOrderDetails(order) {
        setText("order-number", order.order_number);
        setText("order-date", formatOrderDate(order.created_at));
        setText("order-total", formatCurrency(order.total_amount));

        renderCustomerOrderUpdate(order);
        renderOrderTimeline(order);
        renderOrderItems(order.items || []);
        renderShippingAddress(order.shipping_address || {});
        updateOrderActions(order);
    }

    function renderCustomerOrderUpdate(order) {
        const card = document.getElementById("order-update-card");
        const icon = document.getElementById("order-update-icon");
        const title = document.getElementById("order-update-title");
        const message = document.getElementById("order-update-message");

        if (!card || !icon || !title || !message) return;

        const orderStatus = String(order.order_status || "").toUpperCase();
        const paymentStatus = String(order.payment_status || "").toUpperCase();
        const refundStatus = String(order.refund_status || "").toUpperCase();

        const update = ORDER_UPDATES[orderStatus] || ORDER_UPDATES.PENDING;

        card.classList.remove("is-success", "is-warning", "is-danger");
        if (update.style) card.classList.add(update.style);

        icon.replaceChildren();
        const iconElement = document.createElement("i");
        iconElement.className = `fa-solid ${update.icon}`;
        icon.appendChild(iconElement);

        title.textContent = update.title;
        message.textContent = update.message;

        if (orderStatus === "CANCELLED") {
            const refundMessage = getRelevantRefundMessage(paymentStatus, refundStatus);

            if (refundMessage) {
                message.textContent = `${update.message} ${refundMessage}`;
                if (refundStatus === "FAILED") {
                    card.classList.remove("is-danger");
                    card.classList.add("is-warning");
                }
            }

            return;
        }

        if (paymentStatus === "FAILED") {
            title.textContent = "Payment was unsuccessful";
            message.textContent =
                "The payment was not completed successfully. Please check your order and payment status before trying again.";
            card.classList.remove("is-success");
            card.classList.add("is-warning");
        } else if (paymentStatus === "EXPIRED") {
            title.textContent = "Payment session expired";
            message.textContent =
                "The payment session has expired. Check your order status before attempting another payment.";
            card.classList.remove("is-success");
            card.classList.add("is-warning");
        } else if (
            paymentStatus === "PENDING" &&
            ["PENDING", "CONFIRMED"].includes(orderStatus)
        ) {
            message.textContent =
                "Your order is recorded, but payment is still pending confirmation. Please check again shortly.";
            card.classList.remove("is-success");
            card.classList.add("is-warning");
        }
    }

    function getRelevantRefundMessage(paymentStatus, refundStatus) {
        if (
            ["NOT_REQUIRED", "NOT_APPLICABLE"].includes(refundStatus) ||
            paymentStatus === "FAILED" ||
            paymentStatus === "EXPIRED" ||
            paymentStatus === "PENDING"
        ) {
            return "";
        }

        if (refundStatus === "REFUNDED") {
            return "Your refund has been marked as completed. The time it takes to appear in your account may depend on your payment provider.";
        }

        if (["PENDING", "PROCESSING"].includes(refundStatus)) {
            return "Your refund is being processed. The time it takes to reach your account may depend on your payment provider.";
        }

        if (refundStatus === "FAILED") {
            return "We couldn't confirm a successful refund. Please contact support for help with your payment.";
        }

        if (["PAID", "CAPTURED", "SUCCESS", "COMPLETED"].includes(paymentStatus)) {
            return "Please contact support if you need clarification about your payment or refund.";
        }

        return "";
    }

    function renderOrderTimeline(order) {
        const timeline = document.getElementById("order-status-timeline");
        if (!timeline) return;

        timeline.replaceChildren();

        const orderStatus = String(order.order_status || "")
            .trim()
            .toUpperCase();

        console.log("Order timeline status:", orderStatus);

        if (orderStatus === "CANCELLED") {
            const message = document.createElement("div");
            message.className = "order-cancelled-message";
            message.textContent =
                "This order will no longer move through the delivery stages.";
            timeline.appendChild(message);
            return;
        }

        const currentIndex = ORDER_STEPS.findIndex(
            step => step.status === orderStatus
        );

        console.log("Order timeline current index:", currentIndex);

        ORDER_STEPS.forEach((step, index) => {
            const isComplete = currentIndex >= 0 && index < currentIndex;
            const isCurrent = currentIndex >= 0 && index === currentIndex;

            const row = document.createElement("div");
            row.className = "order-timeline-step";

            if (isComplete) row.classList.add("is-complete");
            if (isCurrent) row.classList.add("is-current");

            const markerWrap = document.createElement("div");
            markerWrap.className = "order-timeline-marker-wrap";

            const marker = document.createElement("span");
            marker.className = "order-timeline-marker";
            marker.setAttribute("aria-hidden", "true");

            const markerIcon = document.createElement("i");

            markerIcon.className = `fa-solid ${step.icon}`;

            marker.appendChild(markerIcon);
            markerWrap.appendChild(marker);

            const copy = document.createElement("div");
            copy.className = "order-timeline-copy";

            const heading = document.createElement("h3");
            heading.className = "order-timeline-title";
            heading.textContent = step.title;

            const description = document.createElement("p");
            description.className = "order-timeline-description";
            description.textContent = step.description;

            copy.append(heading, description);
            row.append(markerWrap, copy);

            timeline.appendChild(row);
        });
    }

    function renderOrderItems(items) {
        const container = document.getElementById("order-items");
        const countElement = document.getElementById("order-item-count");

        if (!container) return;

        container.replaceChildren();

        if (countElement) {
            countElement.textContent =
                `${items.length} ${items.length === 1 ? "item" : "items"}`;
        }

        if (!items.length) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "order-empty-items";
            emptyMessage.textContent = "No items were found for this order.";
            container.appendChild(emptyMessage);
            return;
        }

        items.forEach(item => {
            const product = item.product || {};
            const variant = item.variant || {};
            const row = document.createElement("article");
            row.className = "order-detail-item";

            const productUrl = product.slug
                ? `/products/${encodeURIComponent(product.slug)}/`
                : null;

            const imageWrap = document.createElement(productUrl ? "a" : "div");
            imageWrap.className = "order-item-preview";

            if (productUrl) {
                imageWrap.href = productUrl;
                imageWrap.setAttribute(
                    "aria-label",
                    `View ${product.name || "product"}`
                );
            }

            if (product.image) {
                const image = document.createElement("img");
                image.className = "order-item-image";
                image.src = product.image;
                image.alt = product.name || "Order product";
                image.loading = "lazy";
                image.decoding = "async";

                image.addEventListener("error", () => {
                    imageWrap.replaceChildren();
                    imageWrap.classList.add("order-item-preview-empty");
                    const fallbackIcon = document.createElement("i");
                    fallbackIcon.className = "fa-regular fa-gem";
                    fallbackIcon.setAttribute("aria-hidden", "true");
                    imageWrap.appendChild(fallbackIcon);
                }, { once: true });

                imageWrap.appendChild(image);
            } else {
                imageWrap.classList.add("order-item-preview-empty");
                const fallbackIcon = document.createElement("i");
                fallbackIcon.className = "fa-regular fa-gem";
                fallbackIcon.setAttribute("aria-hidden", "true");
                imageWrap.appendChild(fallbackIcon);
            }

            const info = document.createElement("div");
            info.className = "order-item-info";

            const name = document.createElement(productUrl ? "a" : "h3");
            name.className = "order-item-name";
            name.textContent = product.name || "Jewellery piece";

            if (productUrl) {
                name.href = productUrl;
            } else {
                name.style.display = "block";
            }

            info.appendChild(name);

            if (variant.name) {
                const variantElement = document.createElement("p");
                variantElement.className = "order-item-variant";
                variantElement.textContent = variant.name;
                info.appendChild(variantElement);
            }

            const quantity = document.createElement("p");
            quantity.className = "order-item-quantity";
            quantity.textContent = `Quantity: ${item.quantity ?? 1}`;
            info.appendChild(quantity);

            const price = document.createElement("div");
            price.className = "order-item-price";

            const priceLabel = document.createElement("span");
            priceLabel.className = "order-item-price-label";
            priceLabel.textContent = "Subtotal";

            const priceValue = document.createElement("span");
            priceValue.textContent = formatCurrency(item.subtotal);

            price.append(priceLabel, priceValue);
            row.append(imageWrap, info, price);
            container.appendChild(row);
        });
    }

    function renderShippingAddress(address) {
        const container = document.getElementById("shipping-address");
        if (!container) return;

        container.replaceChildren();

        const name = document.createElement("h3");
        name.className = "shipping-address-name";
        name.textContent = address.full_name || "Shipping recipient";

        const phone = document.createElement("p");
        phone.className = "shipping-address-phone";

        const phoneIcon = document.createElement("i");
        phoneIcon.className = "fa-solid fa-phone";
        phoneIcon.setAttribute("aria-hidden", "true");

        const phoneText = document.createElement("span");
        phoneText.textContent = address.phone_number || "Phone number not available";

        phone.append(phoneIcon, phoneText);

        const lines = document.createElement("p");
        lines.className = "shipping-address-lines";

        const addressParts = [
            address.address_line_1,
            address.address_line_2,
            address.city,
            address.state,
            address.pincode
        ].filter(value => value && String(value).trim());

        lines.textContent = addressParts.join(", ") || "Address not available";

        container.append(name, phone, lines);
    }

    function updateOrderActions(order) {
        const actions = document.getElementById("order-actions");
        const button = document.getElementById("cancel-order-button");

        if (!actions || !button) return;

        const status = String(order.order_status || "").toUpperCase();
        const canCancel = ["PENDING", "CONFIRMED"].includes(status);

        actions.hidden = !canCancel;
        button.disabled = !canCancel || isCancelling;
    }

    async function openCancellationDialog() {
        if (!currentOrder || isCancelling) return;

        const status = String(currentOrder.order_status || "").toUpperCase();

        if (!["PENDING", "CONFIRMED"].includes(status)) {
            showOrderFeedback("This order can no longer be cancelled.", true);
            return;
        }

        const dialog = document.createElement("dialog");
        dialog.className = "order-cancel-dialog";

        const content = document.createElement("div");
        content.className = "order-cancel-dialog-content";

        const heading = document.createElement("h2");
        heading.textContent = "Cancel this order?";

        const message = document.createElement("p");
        message.textContent =
            "Are you sure you want to cancel this order? This action cannot be undone.";

        const actions = document.createElement("div");
        actions.className = "order-dialog-actions";

        const keepButton = document.createElement("button");
        keepButton.type = "button";
        keepButton.className = "order-dialog-button";
        keepButton.textContent = "Keep order";

        const confirmButton = document.createElement("button");
        confirmButton.type = "button";
        confirmButton.className = "order-dialog-button is-primary";
        confirmButton.textContent = "Yes, cancel";

        actions.append(keepButton, confirmButton);
        content.append(heading, message, actions);
        dialog.appendChild(content);
        document.body.appendChild(dialog);

        keepButton.addEventListener("click", () => dialog.close());

        dialog.addEventListener("close", () => {
            dialog.remove();
        }, { once: true });

        confirmButton.addEventListener("click", async () => {
            if (isCancelling) return;

            isCancelling = true;
            confirmButton.disabled = true;
            keepButton.disabled = true;
            confirmButton.textContent = "Cancelling...";

            try {
                const response = await fetchWithAuth(
                    `/api/orders/${encodeURIComponent(orderId)}/cancel/`,
                    { method: "POST" }
                );

                let result = {};

                try {
                    result = await response.json();
                } catch (_) {
                    // The endpoint may return an empty response.
                }

                if (!response.ok) {
                    throw new Error(
                        result.detail ||
                        result.message ||
                        "We couldn't cancel this order. Please try again."
                    );
                }

                dialog.close();
                await loadOrderDetails();
                showOrderFeedback(
                    result.message || "Your order has been cancelled."
                );
            } catch (error) {
                message.textContent =
                    error.message || "Cancellation failed. Please try again.";
                confirmButton.disabled = false;
                keepButton.disabled = false;
                confirmButton.textContent = "Try again";
            } finally {
                isCancelling = false;
                if (currentOrder) updateOrderActions(currentOrder);
            }
        });

        if (typeof dialog.showModal === "function") {
            dialog.showModal();
        } else {
            // A native dialog is expected in supported modern browsers.
            dialog.setAttribute("open", "");
        }
    }

    function showLoadingState() {
        loadingElement.hidden = false;
        errorElement.hidden = true;
        contentElement.hidden = true;
    }

    function showContentState() {
        loadingElement.hidden = true;
        errorElement.hidden = true;
        contentElement.hidden = false;
    }

    function showErrorState(message) {
        loadingElement.hidden = true;
        contentElement.hidden = true;
        errorElement.hidden = false;
        errorMessageElement.textContent = message;
    }

    function showOrderFeedback(message, isError = false) {
        const existing = document.querySelector(".order-feedback");
        if (existing) existing.remove();

        const feedback = document.createElement("div");
        feedback.className = "order-feedback";
        if (isError) feedback.classList.add("is-error");
        feedback.setAttribute("role", isError ? "alert" : "status");
        feedback.textContent = message;

        document.body.appendChild(feedback);

        window.setTimeout(() => {
            feedback.remove();
        }, 4500);
    }

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value ?? "";
    }

    function formatOrderDate(value) {
        if (!value) return "Date unavailable";

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "Date unavailable";

        return new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(date);
    }

    function formatCurrency(value) {
        const amount = Number(value);

        if (!Number.isFinite(amount)) {
            return "₹0.00";
        }

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
});
