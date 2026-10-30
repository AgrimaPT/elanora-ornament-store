
document.addEventListener("DOMContentLoaded", () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        window.location.href = "/login/";
        return;
    }

    // Shared elements
    const profileMessage = document.getElementById("profile-message");
    const profileDetails = document.getElementById("profile-details");
    const editProfileForm = document.getElementById("edit-profile-form");
    const editProfileMessage = document.getElementById("edit-profile-message");
    const changePasswordForm = document.getElementById("change-password-form");
    const changePasswordMessage = document.getElementById("change-password-message");
    const ordersMessage = document.getElementById("orders-message");
    const ordersList = document.getElementById("orders-list");
    const ordersPagination = document.getElementById("orders-pagination");

    const editProfileButton = document.getElementById("edit-profile-button");
    const cancelEditButton = document.getElementById("cancel-edit-button");
    const cancelPasswordButton = document.getElementById("cancel-password-button");
    const logoutButton = document.getElementById("logout-button");

    const navButtons = document.querySelectorAll("[data-account-view]");
    const accountViews = document.querySelectorAll(".account-view");

    let ordersLoaded = false;
    let ordersLoading = false;

    // -----------------------------------------
    // SECTION NAVIGATION
    // -----------------------------------------

    function showAccountView(viewName, updateHash = true) {
        accountViews.forEach((view) => {
            view.hidden = view.id !== `account-view-${viewName}`;
        });

        navButtons.forEach((button) => {
            const isActive = button.dataset.accountView === viewName;

            button.classList.toggle("is-active", isActive);

            if (isActive) {
                button.setAttribute("aria-current", "page");
            } else {
                button.removeAttribute("aria-current");
            }
        });

        if (updateHash && window.history.replaceState) {
            window.history.replaceState(null, "", `#${viewName}`);
        }

        if (viewName === "orders" && !ordersLoaded) {
            loadOrders();
        }

        if (viewName === "details") {
            editProfileForm.hidden = true;
            profileDetails.hidden = false;
            editProfileMessage.textContent = "";
        }

        if (viewName === "security") {
            changePasswordMessage.textContent = "";
        }
    }

    navButtons.forEach((button) => {
        button.addEventListener("click", () => {
            showAccountView(button.dataset.accountView);
        });
    });

    // -----------------------------------------
    // PROFILE
    // -----------------------------------------

    async function loadProfile() {
        try {
            const response = await fetchWithAuth(
                "/api/auth/profile/",
                { method: "GET" }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("Failed to load profile:", data);
                profileMessage.textContent = "Unable to load your profile.";
                return;
            }

            displayProfile(data);
        } catch (error) {
            console.error("Profile error:", error);
            profileMessage.textContent =
                "Something went wrong. Please try again.";
        }
    }

    function displayProfile(user) {
        document.getElementById("profile-first-name").textContent =
            user.first_name || "—";

        document.getElementById("profile-last-name").textContent =
            user.last_name || "—";

        document.getElementById("profile-email").textContent =
            user.email || "—";

        document.getElementById("profile-phone").textContent =
            user.phone_number || "—";

        document.getElementById("edit-first-name").value =
            user.first_name || "";

        document.getElementById("edit-last-name").value =
            user.last_name || "";

        document.getElementById("edit-email").value =
            user.email || "";

        document.getElementById("edit-phone").value =
            user.phone_number || "";

        const customerName = [
            user.first_name,
            user.last_name,
        ].filter(Boolean).join(" ");

        document.getElementById("account-customer-name").textContent =
            customerName || "Your account";
    }

    editProfileButton.addEventListener("click", () => {
        editProfileMessage.textContent = "";
        profileDetails.hidden = true;
        editProfileForm.hidden = false;
        document.getElementById("edit-first-name").focus();
    });

    cancelEditButton.addEventListener("click", () => {
        editProfileForm.hidden = true;
        profileDetails.hidden = false;
        editProfileMessage.textContent = "";
    });

    editProfileForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const firstName =
            document.getElementById("edit-first-name").value.trim();

        const lastName =
            document.getElementById("edit-last-name").value.trim();

        const phoneNumber =
            document.getElementById("edit-phone").value.trim();

        editProfileMessage.textContent = "Saving changes...";

        try {
            const response = await fetchWithAuth(
                "/api/auth/profile/update/",
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        first_name: firstName,
                        last_name: lastName,
                        phone_number: phoneNumber,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("Profile update failed:", data);
                editProfileMessage.textContent =
                    getApiError(data, "Unable to update your profile.");
                return;
            }

            displayProfile(data);
            editProfileMessage.textContent = "";
            editProfileForm.hidden = true;
            profileDetails.hidden = false;
            profileMessage.textContent = "Your details have been updated.";
        } catch (error) {
            console.error("Profile update error:", error);
            editProfileMessage.textContent =
                "Something went wrong. Please try again.";
        }
    });

    // -----------------------------------------
    // PASSWORD & SECURITY
    // -----------------------------------------

    cancelPasswordButton.addEventListener("click", () => {
        changePasswordForm.reset();
        changePasswordMessage.textContent = "";
    });

    changePasswordForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const oldPassword =
            document.getElementById("current-password").value;

        const newPassword =
            document.getElementById("new-password").value;

        const confirmPassword =
            document.getElementById("confirm-password").value;

        if (newPassword !== confirmPassword) {
            changePasswordMessage.textContent =
                "Your new passwords do not match.";
            return;
        }

        if (oldPassword === newPassword) {
            changePasswordMessage.textContent =
                "Choose a password different from your current one.";
            return;
        }

        changePasswordMessage.textContent = "Updating your password...";

        try {
            const response = await fetchWithAuth(
                "/api/auth/change-password/",
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        old_password: oldPassword,
                        new_password: newPassword,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("Password change failed:", data);
                changePasswordMessage.textContent =
                    getApiError(data, "Unable to change your password.");
                return;
            }

            changePasswordForm.reset();
            changePasswordMessage.textContent =
                "Your password has been updated successfully.";
        } catch (error) {
            console.error("Password change error:", error);
            changePasswordMessage.textContent =
                "Something went wrong. Please try again.";
        }
    });

    // -----------------------------------------
    // ORDER HISTORY
    // -----------------------------------------

    let allOrders = [];
    let currentOrdersPage = 1;
    const ORDERS_PER_PAGE = 4;
    const MAX_PRODUCT_PREVIEWS = 2;

    function isPurchaseOrder(order) {
        const paymentStatus = String(
            order.payment_status || order.payment?.status || ""
        ).toUpperCase();

        // Include successful purchases and purchases that were refunded.
        // Do not use order_status alone to determine payment success.
        return ["PAID", "REFUNDED"].includes(paymentStatus);
    }

    async function loadOrders() {
        if (ordersLoading || ordersLoaded) return;

        ordersLoading = true;
        ordersMessage.textContent = "Loading your orders...";
        ordersList.replaceChildren();

        if (ordersPagination) {
            ordersPagination.hidden = true;
            ordersPagination.replaceChildren();
        }

        try {
            const response = await fetchWithAuth(
                "/api/orders/history/",
                { method: "GET" }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("Failed to load orders:", data);
                ordersMessage.textContent =
                    getApiError(data, "Unable to load your orders.");
                return;
            }

            // Support a regular list or common paginated response shapes.
            const orders = Array.isArray(data)
                ? data
                : Array.isArray(data.results)
                    ? data.results
                    : Array.isArray(data.orders)
                        ? data.orders
                        : Array.isArray(data.data)
                            ? data.data
                            : null;

            if (!orders) {
                console.error("Unexpected order history response:", data);
                ordersMessage.textContent =
                    "We couldn't read your order history. Please try again.";
                return;
            }

            // Filter before pagination so hidden orders do not occupy pages.
            allOrders = orders.filter(isPurchaseOrder);
            currentOrdersPage = 1;
            ordersLoaded = true;
            ordersMessage.textContent = "";

            if (allOrders.length === 0) {
                renderEmptyOrders();
                return;
            }

            renderOrdersPage(currentOrdersPage);
        } catch (error) {
            console.error("Order history error:", error);
            ordersMessage.textContent =
                "Something went wrong while loading your orders.";
        } finally {
            ordersLoading = false;
        }
    }

    function renderOrdersPage(page) {
        const totalPages = Math.ceil(allOrders.length / ORDERS_PER_PAGE);

        if (totalPages === 0) {
            renderEmptyOrders();
            return;
        }

        currentOrdersPage = Math.max(1, Math.min(page, totalPages));

        const startIndex = (currentOrdersPage - 1) * ORDERS_PER_PAGE;
        const pageOrders = allOrders.slice(
            startIndex,
            startIndex + ORDERS_PER_PAGE
        );

        ordersList.replaceChildren();

        pageOrders.forEach((order) => {
            ordersList.appendChild(createOrderElement(order));
        });

        renderPaginationControls(totalPages);
    }

    function renderPaginationControls(totalPages) {
        if (!ordersPagination) return;

        if (totalPages <= 1) {
            ordersPagination.hidden = true;
            ordersPagination.replaceChildren();
            return;
        }

        ordersPagination.hidden = false;
        ordersPagination.replaceChildren();

        const startNum =
            (currentOrdersPage - 1) * ORDERS_PER_PAGE + 1;

        const endNum = Math.min(
            currentOrdersPage * ORDERS_PER_PAGE,
            allOrders.length
        );

        const info = document.createElement("div");
        info.className = "account-pagination-info";
        info.textContent =
            `Showing ${startNum}–${endNum} of ${allOrders.length} orders`;

        const controls = document.createElement("div");
        controls.className = "account-pagination-controls";
        controls.setAttribute("role", "navigation");
        controls.setAttribute("aria-label", "Orders pagination");

        const prevBtn = document.createElement("button");
        prevBtn.type = "button";
        prevBtn.className = "account-page-btn account-page-nav-btn";
        prevBtn.disabled = currentOrdersPage === 1;
        prevBtn.setAttribute("aria-label", "Previous page");
        prevBtn.innerHTML =
            `<i class="bi bi-chevron-left" aria-hidden="true"></i> Prev`;

        prevBtn.addEventListener("click", () => {
            if (currentOrdersPage > 1) {
                renderOrdersPage(currentOrdersPage - 1);
                scrollToOrdersTop();
            }
        });

        controls.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.type = "button";
            pageBtn.className =
                `account-page-btn ${i === currentOrdersPage ? "is-active" : ""}`;
            pageBtn.textContent = String(i);
            pageBtn.setAttribute("aria-label", `Page ${i}`);

            if (i === currentOrdersPage) {
                pageBtn.setAttribute("aria-current", "page");
            }

            pageBtn.addEventListener("click", () => {
                if (i !== currentOrdersPage) {
                    renderOrdersPage(i);
                    scrollToOrdersTop();
                }
            });

            controls.appendChild(pageBtn);
        }

        const nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.className = "account-page-btn account-page-nav-btn";
        nextBtn.disabled = currentOrdersPage === totalPages;
        nextBtn.setAttribute("aria-label", "Next page");
        nextBtn.innerHTML =
            `Next <i class="bi bi-chevron-right" aria-hidden="true"></i>`;

        nextBtn.addEventListener("click", () => {
            if (currentOrdersPage < totalPages) {
                renderOrdersPage(currentOrdersPage + 1);
                scrollToOrdersTop();
            }
        });

        controls.appendChild(nextBtn);
        ordersPagination.append(info, controls);
    }

    function scrollToOrdersTop() {
        const ordersHeading = document.getElementById("orders-heading");

        if (ordersHeading) {
            ordersHeading.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }

    // -----------------------------------------
    // ORDER CARD
    // -----------------------------------------

    function createOrderElement(order) {
        const orderId = order.id ?? order.order_id ?? "";
        const orderUrl = orderId ? `/orders/${orderId}/` : "#";

        const orderNumberText =
            order.order_number ||
            order.order_id ||
            `Order #${order.id ?? "—"}`;

        const link = document.createElement("a");
        link.className = "account-order";
        link.href = orderUrl;
        link.setAttribute(
            "aria-label",
            `View details for ${orderNumberText}`
        );

        const main = document.createElement("div");
        main.className = "account-order-main";

        // Order heading and details link
        const header = document.createElement("div");
        header.className = "account-order-header";

        const number = document.createElement("h3");
        number.className = "account-order-number";
        number.textContent = orderNumberText;

        const arrow = document.createElement("span");
        arrow.className = "account-order-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.innerHTML =
            `View details <i class="bi bi-arrow-right"></i>`;

        header.append(number, arrow);

        // Date and payment information
        const meta = document.createElement("div");
        meta.className = "account-order-meta";

        const dateValue =
            order.created_at || order.ordered_at || order.created;

        if (dateValue) {
            const date = document.createElement("span");
            date.innerHTML =
                `<i class="bi bi-calendar3" aria-hidden="true"></i> `;

            const dateText = document.createElement("span");
            dateText.textContent = formatOrderDate(dateValue);
            date.appendChild(dateText);
            meta.appendChild(date);
        }

        const paymentValue =
            order.payment_status || order.payment?.status;

        if (paymentValue) {
            const payment = document.createElement("span");
            payment.innerHTML =
                `<i class="bi bi-credit-card" aria-hidden="true"></i> `;

            const paymentText = document.createElement("span");
            paymentText.textContent =
                `Payment: ${formatStatus(paymentValue)}`;

            payment.appendChild(paymentText);
            meta.appendChild(payment);
        }

        const refundValue =
            order.refund_status || order.payment?.refund_status;

        // Show refund details only when a refund is relevant.
        if (
            refundValue &&
            String(refundValue).toUpperCase() !== "NOT_REQUIRED"
        ) {
            const refund = document.createElement("span");
            refund.innerHTML =
                `<i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i> `;

            const refundText = document.createElement("span");
            refundText.textContent =
                `Refund: ${formatRefundStatus(refundValue)}`;

            refund.appendChild(refundText);
            meta.appendChild(refund);
        }

        // Product thumbnail previews
        const products = createProductPreviews(order.items);

        // Order total
        const total = document.createElement("div");
        total.className = "account-order-total";

        const amount =
            order.total_amount ?? order.total_price ?? order.total;

        const totalLabel = document.createElement("span");
        totalLabel.textContent = "Total · ";

        const totalAmount = document.createElement("strong");
        totalAmount.textContent =
            amount !== undefined && amount !== null
                ? formatCurrency(amount)
                : "—";

        total.append(totalLabel, totalAmount);

        // Order status
        const statusWrap = document.createElement("div");
        statusWrap.className = "account-order-status-wrap";

        const statusRaw = String(
            order.order_status || order.status || "Processing"
        );

        const statusClass =
            `status-${statusRaw.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

        const status = document.createElement("span");
        status.className = `account-order-status ${statusClass}`;
        status.textContent = formatStatus(statusRaw);

        statusWrap.appendChild(status);

        main.append(header, meta);

        if (products) {
            main.appendChild(products);
        }

        main.appendChild(total);
        link.append(main, statusWrap);

        return link;
    }

    function createProductPreviews(items) {
        if (!Array.isArray(items) || items.length === 0) {
            return null;
        }

        const wrapper = document.createElement("div");
        wrapper.className = "account-order-products";

        const visibleItems = items.slice(0, MAX_PRODUCT_PREVIEWS);

        visibleItems.forEach((item) => {
            const product = item.product || {};
            const preview = document.createElement("div");
            preview.className = "account-order-product";

            const imageWrap = document.createElement("div");
            imageWrap.className = "account-order-product-image";

            const imageUrl = getSafeProductImageUrl(product.image);

            if (imageUrl) {
                const image = document.createElement("img");
                image.src = imageUrl;
                image.alt = product.name || "Order product";
                image.loading = "lazy";
                image.decoding = "async";

                image.addEventListener("error", () => {
                    image.remove();
                    imageWrap.classList.add("has-no-image");
                    imageWrap.innerHTML =
                        `<i class="bi bi-gem" aria-hidden="true"></i>`;
                }, { once: true });

                imageWrap.appendChild(image);
            } else {
                imageWrap.classList.add("has-no-image");
                imageWrap.innerHTML =
                    `<i class="bi bi-gem" aria-hidden="true"></i>`;
            }

            const details = document.createElement("div");
            details.className = "account-order-product-details";

            const name = document.createElement("span");
            name.className = "account-order-product-name";
            name.textContent = product.name || "Jewellery piece";

            details.appendChild(name);

            if (item.variant && item.variant.name) {
                const variant = document.createElement("span");
                variant.className = "account-order-product-variant";
                variant.textContent = item.variant.name;
                details.appendChild(variant);
            }

            const quantity = document.createElement("span");
            quantity.className = "account-order-product-quantity";
            quantity.textContent = `Qty: ${item.quantity ?? 1}`;
            details.appendChild(quantity);

            preview.append(imageWrap, details);
            wrapper.appendChild(preview);
        });

        if (items.length > MAX_PRODUCT_PREVIEWS) {
            const more = document.createElement("span");
            more.className = "account-order-products-more";
            more.textContent =
                `+${items.length - MAX_PRODUCT_PREVIEWS} more`;
            wrapper.appendChild(more);
        }

        return wrapper;
    }

    function getSafeProductImageUrl(value) {
        if (typeof value !== "string" || !value.trim()) {
            return "";
        }

        const imagePath = value.trim();

        // Allow local media paths and same-origin absolute URLs only.
        if (imagePath.startsWith("/") && !imagePath.startsWith("//")) {
            return imagePath;
        }

        try {
            const parsedUrl = new URL(imagePath, window.location.origin);

            if (
                parsedUrl.origin === window.location.origin &&
                ["http:", "https:"].includes(parsedUrl.protocol)
            ) {
                return parsedUrl.href;
            }
        } catch (error) {
            console.warn("Invalid product image URL:", imagePath);
        }

        return "";
    }

    // -----------------------------------------
    // EMPTY ORDER HISTORY
    // -----------------------------------------

    function renderEmptyOrders() {
        const empty = document.createElement("div");
        empty.className = "account-orders-empty";

        const icon = document.createElement("div");
        icon.className = "account-orders-empty-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.innerHTML = `<i class="bi bi-gem"></i>`;

        const heading = document.createElement("h3");
        heading.textContent = "Your story starts here.";

        const description = document.createElement("p");
        description.textContent =
            "Your completed purchases will appear here. Explore the collection to find a piece that feels like you.";

        const link = document.createElement("a");
        link.className = "account-shop-link";
        link.href = "/shop/";
        link.textContent = "Explore the collection";

        empty.append(icon, heading, description, link);
        ordersList.replaceChildren(empty);

        if (ordersPagination) {
            ordersPagination.hidden = true;
            ordersPagination.replaceChildren();
        }
    }

    // -----------------------------------------
    // FORMATTING HELPERS
    // -----------------------------------------

    function formatOrderDate(value) {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(date);
    }

    function formatCurrency(value) {
        const amount = Number(value);

        if (!Number.isFinite(amount)) {
            return String(value);
        }

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(amount);
    }

    function formatStatus(value) {
        return String(value)
            .replace(/[_-]+/g, " ")
            .replace(/\b\w/g, (character) => character.toUpperCase());
    }

    function formatRefundStatus(value) {
        const status = String(value).toUpperCase();

        const labels = {
            NOT_REQUIRED: "Not required",
            PENDING: "Refund pending",
            PROCESSING: "Refund processing",
            REFUNDED: "Refund completed",
            FAILED: "Refund failed — please contact support",
            UNKNOWN: "Refund status being verified",
        };

        return labels[status] || formatStatus(value);
    }

    function getApiError(data, fallback) {
        if (typeof data.detail === "string") return data.detail;
        if (typeof data.message === "string") return data.message;

        if (typeof data === "object" && data !== null) {
            const messages = Object.values(data)
                .flat(Infinity)
                .filter((value) => typeof value === "string");

            if (messages.length) return messages.join(" ");
        }

        return fallback;
    }

    // -----------------------------------------
    // LOGOUT
    // -----------------------------------------

    logoutButton.addEventListener("click", async () => {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login/";
            return;
        }

        logoutButton.disabled = true;

        try {
            const response = await fetchWithAuth(
                "/api/auth/logout/",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh: refreshToken }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("Logout failed:", data);
                profileMessage.textContent =
                    getApiError(data, "Unable to sign out. Please try again.");
                return;
            }

            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login/";
        } catch (error) {
            console.error("Logout error:", error);
            profileMessage.textContent =
                "Something went wrong while signing out.";
        } finally {
            logoutButton.disabled = false;
        }
    });

    // Initial page state
    const hashView = window.location.hash.replace("#", "");
    const initialView = ["details", "security", "orders"].includes(hashView)
        ? hashView
        : "details";

    showAccountView(initialView, false);
    loadProfile();
});
