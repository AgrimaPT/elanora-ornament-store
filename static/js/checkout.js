
document.addEventListener("DOMContentLoaded", () => {
    const $ = (id) => document.getElementById(id);

    const addressLoading = $("address-loading");
    const addressError = $("address-error");
    const addressEmpty = $("address-empty");
    const addressList = $("address-list");
    const addressForm = $("address-form");
    const addressFormContainer = $("address-form-container");

    const selectedAddressCard = $("selected-address-card");
    const selectedAddressName = $("selected-address-name");
    const selectedAddressPhone = $("selected-address-phone");
    const selectedAddressPreview = $("selected-address-preview");
    const selectedAddressBadge = $("selected-address-badge");

    const addressPickerDialog = $("address-picker-dialog");
    const addressFormDialog = $("address-form-dialog");
    const addressPickerLoading = $("address-picker-loading");
    const addressFormError = $("address-form-error");

    const checkoutItems = $("checkout-items");
    const checkoutSubtotal = $("checkout-subtotal");
    const checkoutTotal = $("checkout-total");
    const placeOrderButton = $("place-order-button");
    const checkoutLayout = document.querySelector(".checkout-layout");
    const checkoutSuccess = $("checkout-success");
    const successOrderNumber = $("success-order-number");
    const viewOrderButton = $("view-order-button");
    const checkoutAlert = $("checkout-alert");

    let addresses = [];
    let selectedAddressId = null;
    let pendingAddressId = null;
    let cartHasItems = false;
    let isSubmittingOrder = false;
    let isSavingAddress = false;

    function showAlert(message, type = "error") {
        checkoutAlert.textContent = message;
        checkoutAlert.className = `checkout-alert is-${type}`;
        checkoutAlert.hidden = false;
        checkoutAlert.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function hideAlert() {
        checkoutAlert.hidden = true;
        checkoutAlert.textContent = "";
    }

    function formatCurrency(value) {
        return `₹${Number(value || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }

    function updateContinueButton() {
        placeOrderButton.disabled =
            !selectedAddressId || !cartHasItems || isSubmittingOrder;
    }

    function openDialog(dialog) {
        if (!dialog) return;

        if (typeof dialog.showModal === "function") {
            if (!dialog.open) dialog.showModal();
        } else {
            dialog.setAttribute("open", "");
        }
    }

    function closeDialog(dialog) {
        if (!dialog) return;

        if (typeof dialog.close === "function" && dialog.open) {
            dialog.close();
        } else {
            dialog.removeAttribute("open");
        }
    }

    function makeTextElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        element.textContent = text ?? "";
        return element;
    }

    function formatAddress(address) {
        return [
            address.address_line_1,
            address.address_line_2,
            `${address.city}, ${address.state} ${address.pincode}`,
        ].filter(Boolean).join(", ");
    }

    function getAddressById(id) {
        return addresses.find((address) => String(address.id) === String(id));
    }

    function renderSelectedAddress() {
        const address = getAddressById(selectedAddressId);

        selectedAddressCard.hidden = !address;
        addressEmpty.hidden = addresses.length > 0;


        if (!address) {
            selectedAddressName.textContent = "";
            selectedAddressPhone.textContent = "";
            selectedAddressPreview.textContent = "";
            selectedAddressBadge.hidden = true;
            updateContinueButton();
            return;
        }

        selectedAddressName.textContent = address.full_name || "";
        selectedAddressPhone.textContent = address.phone_number || "";
        selectedAddressPreview.textContent = formatAddress(address);
        selectedAddressBadge.hidden = !address.is_default;

        updateContinueButton();
    }

    function renderAddressPicker() {
        addressList.replaceChildren();

        addresses.forEach((address) => {
            const label = document.createElement("label");
            label.className = "address-card";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "checkout-address-choice";
            radio.value = address.id;
            radio.checked = String(address.id) === String(pendingAddressId);
            radio.className = "address-card-radio";

            radio.addEventListener("change", () => {
                pendingAddressId = address.id;
                renderAddressPicker();
            });

            const details = document.createElement("span");
            details.className = "address-card-details";

            const heading = document.createElement("span");
            heading.className = "address-card-header";

            heading.appendChild(
                makeTextElement("strong", "address-card-name", address.full_name)
            );

            if (address.is_default) {
                heading.appendChild(
                    makeTextElement("span", "address-default-badge", "Default")
                );
            }

            details.appendChild(heading);
            details.appendChild(
                makeTextElement("span", "address-card-phone", address.phone_number)
            );
            details.appendChild(
                makeTextElement("span", "address-card-full-address", formatAddress(address))
            );

            label.append(radio, details);

            if (String(address.id) === String(pendingAddressId)) {
                label.classList.add("selected");
            }

            addressList.appendChild(label);
        });

        $("confirm-address-button").disabled = !getAddressById(pendingAddressId);
    }

    async function loadAddresses() {
        addressLoading.hidden = false;
        addressError.hidden = true;

        try {
            const response = await fetchWithAuth("/api/auth/addresses/");

            if (!response.ok) {
                throw new Error("We couldn't load your saved addresses.");
            }

            const data = await response.json();
            addresses = Array.isArray(data) ? data : [];

            if (!getAddressById(selectedAddressId)) {
                const defaultAddress = addresses.find((address) => address.is_default);
                selectedAddressId = defaultAddress?.id ?? addresses[0]?.id ?? null;
            }

            pendingAddressId = selectedAddressId;
            renderSelectedAddress();
            renderAddressPicker();
        } catch (error) {
            console.error("Address loading error:", error);
            addressError.textContent =
                error.message || "Unable to load addresses. Please try again.";
            addressError.hidden = false;
        } finally {
            addressLoading.hidden = true;
        }
    }

    function renderCartItem(item) {
        const article = document.createElement("article");
        article.className = "checkout-item";

        const image = document.createElement("img");
        image.className = "checkout-item-image";
        image.alt = item.product?.name || "Product";
        image.loading = "lazy";

        if (item.product?.image) {
            image.src = item.product.image;
            image.addEventListener("error", () => {
                image.hidden = true;
            }, { once: true });
        } else {
            image.hidden = true;
        }

        const info = document.createElement("div");
        info.className = "checkout-item-info";
        info.appendChild(
            makeTextElement("h3", "checkout-item-name", item.product?.name || "Product")
        );

        if (item.variant?.name) {
            info.appendChild(
                makeTextElement("p", "checkout-item-variant", item.variant.name)
            );
        }

        info.appendChild(
            makeTextElement("p", "checkout-item-quantity", `Qty: ${item.quantity}`)
        );

        article.append(
            image,
            info,
            makeTextElement("p", "checkout-item-price", formatCurrency(item.subtotal))
        );

        return article;
    }

    async function loadCart() {
        checkoutItems.replaceChildren();
        checkoutItems.appendChild(
            makeTextElement("p", "checkout-state", "Loading your bag...")
        );

        try {
            const response = await fetchWithAuth("/api/cart/");

            if (!response.ok) {
                throw new Error("We couldn't load your cart.");
            }

            const cart = await response.json();
            const items = Array.isArray(cart.items) ? cart.items : [];

            checkoutItems.replaceChildren();

            if (items.length === 0) {
                cartHasItems = false;
                checkoutItems.appendChild(
                    makeTextElement("p", "checkout-state", "Your bag is empty.")
                );
                checkoutSubtotal.textContent = formatCurrency(0);
                checkoutTotal.textContent = formatCurrency(0);
                updateContinueButton();
                return;
            }

            cartHasItems = true;
            let subtotal = 0;

            items.forEach((item) => {
                subtotal += Number(item.subtotal || 0);
                checkoutItems.appendChild(renderCartItem(item));
            });

            checkoutSubtotal.textContent = formatCurrency(subtotal);
            checkoutTotal.textContent = formatCurrency(subtotal);
            updateContinueButton();
        } catch (error) {
            console.error("Cart loading error:", error);
            cartHasItems = false;
            checkoutItems.replaceChildren(
                makeTextElement(
                    "p",
                    "checkout-state checkout-error",
                    error.message || "Unable to load your cart. Please try again."
                )
            );
            updateContinueButton();
        }
    }

    function openAddressForm() {
        addressForm.reset();
        addressFormError.hidden = true;
        openDialog(addressFormDialog);
        $("full-name").focus();
    }

    $("change-address-button").addEventListener("click", () => {
        pendingAddressId = selectedAddressId;
        renderAddressPicker();
        openDialog(addressPickerDialog);
    });

    $("close-address-picker").addEventListener("click", () => {
        closeDialog(addressPickerDialog);
    });

    $("confirm-address-button").addEventListener("click", () => {
        if (!getAddressById(pendingAddressId)) return;

        selectedAddressId = pendingAddressId;
        renderSelectedAddress();
        closeDialog(addressPickerDialog);
        hideAlert();
    });

    $("add-address-button").addEventListener("click", openAddressForm);
    $("picker-add-address-button").addEventListener("click", () => {
        closeDialog(addressPickerDialog);
        openAddressForm();
    });

    $("close-address-form").addEventListener("click", () => {
        closeDialog(addressFormDialog);
    });

    $("cancel-address-button").addEventListener("click", () => {
        addressForm.reset();
        closeDialog(addressFormDialog);
    });

    // Clicking a dialog's backdrop closes it without submitting anything.
    [addressPickerDialog, addressFormDialog].forEach((dialog) => {
        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) closeDialog(dialog);
        });
    });

    addressForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (isSavingAddress) return;

        isSavingAddress = true;
        const saveButton = $("save-address-button");
        saveButton.disabled = true;
        saveButton.textContent = "Saving address...";
        addressFormError.hidden = true;

        const formData = new FormData(addressForm);
        const addressData = {
            full_name: formData.get("full_name")?.toString().trim(),
            phone_number: formData.get("phone_number")?.toString().trim(),
            address_line_1: formData.get("address_line_1")?.toString().trim(),
            address_line_2: formData.get("address_line_2")?.toString().trim(),
            city: formData.get("city")?.toString().trim(),
            state: formData.get("state")?.toString().trim(),
            pincode: formData.get("pincode")?.toString().trim(),
            is_default: formData.get("is_default") === "on",
        };

        try {
            const response = await fetchWithAuth("/api/auth/addresses/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(addressData),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const detail = data.detail ||
                    Object.values(data).flat().join(" ") ||
                    "Unable to save this address. Check your details.";

                throw new Error(detail);
            }

            // Use the saved address as the selection after creation.
            closeDialog(addressFormDialog);
            await loadAddresses();

            if (data.id != null && getAddressById(data.id)) {
                selectedAddressId = data.id;
            } else if (addressData.is_default) {
                selectedAddressId =
                    addresses.find((address) => address.is_default)?.id ??
                    selectedAddressId;
            } else if (addresses.length) {
                selectedAddressId =
                    addresses[addresses.length - 1].id;
            }

            pendingAddressId = selectedAddressId;
            renderSelectedAddress();
            renderAddressPicker();
            showAlert("Your delivery address has been saved.", "success");
        } catch (error) {
            console.error("Address creation error:", error);
            addressFormError.textContent =
                error.message || "Unable to save your address.";
            addressFormError.hidden = false;
        } finally {
            isSavingAddress = false;
            saveButton.disabled = false;
            saveButton.textContent = "Save address";
        }
    });

    function showCheckoutSuccess(order) {
        checkoutLayout.hidden = true;
        checkoutSuccess.hidden = false;
        successOrderNumber.textContent = `#${order.order_number}`;
        viewOrderButton.href = `/orders/${order.id}/`;
        checkoutSuccess.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    async function createPayment(orderId) {
        const response = await fetchWithAuth("/api/payment/create/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: orderId }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.detail || "Unable to create payment.");
        }

        return data;
    }

    async function verifyPayment(response) {
        const apiResponse = await fetchWithAuth("/api/payment/verify/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
            }),
        });

        const data = await apiResponse.json().catch(() => ({}));

        if (!apiResponse.ok) {
            throw new Error(data.detail || "Payment verification failed.");
        }

        return data;
    }

    function resetOrderButton() {
        isSubmittingOrder = false;
        placeOrderButton.innerHTML =
            '<span>Place order &amp; pay</span><i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
        updateContinueButton();
    }

    function openRazorpayCheckout(payment, orderId) {
        const options = {
            key: payment.key_id,
            amount: payment.amount_in_paise,
            currency: payment.currency,
            name: "ELANORA",
            description: `Payment for Order #${payment.order_number}`,
            order_id: payment.razorpay_order_id,

            handler: async function (response) {
                try {
                    const verification = await verifyPayment(response);
                    showCheckoutSuccess({
                        id: verification.order_id || orderId,
                        order_number: verification.order_number || payment.order_number,
                    });
                } catch (error) {
                    console.error("Payment verification failed:", error);
                    showAlert(
                        "We couldn't confirm your payment yet. Please don't place another order. Check your order status or contact support.",
                        "error"
                    );
                    resetOrderButton();
                }
            },

            modal: {
                ondismiss: function () {
                    showAlert(
                        "Payment wasn't completed in the payment window. Check your order status before trying again.",
                        "error"
                    );
                    resetOrderButton();
                },
            },

            theme: { color: "#B89B5E" },
        };

        const razorpay = new Razorpay(options);

        razorpay.on("payment.failed", function (response) {
            console.error("Razorpay payment failed:", response.error);
            showAlert(
                "Payment failed or was declined. Check your order status before trying again.",
                "error"
            );
            resetOrderButton();
        });

        razorpay.open();
    }

    async function placeOrder() {
        if (isSubmittingOrder || !selectedAddressId || !cartHasItems) {
            return;
        }

        isSubmittingOrder = true;
        hideAlert();
        placeOrderButton.disabled = true;
        placeOrderButton.textContent = "Preparing secure payment...";

        let orderCreated = false;

        try {
            const response = await fetchWithAuth("/api/orders/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address_id: selectedAddressId }),
            });

            const order = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(order.detail || "Unable to create your order.");
            }

            orderCreated = true;
            const payment = await createPayment(order.id);
            openRazorpayCheckout(payment, order.id);
        } catch (error) {
            console.error("Place order error:", error);

            showAlert(
                orderCreated
                    ? "Your order was created, but payment setup failed. Please check your order status before trying again."
                    : (error.message || "Unable to place your order. Please try again."),
                "error"
            );

            resetOrderButton();
        }
    }

    placeOrderButton.addEventListener("click", placeOrder);

    loadAddresses();
    loadCart();
});
