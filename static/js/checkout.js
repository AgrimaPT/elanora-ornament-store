document.addEventListener("DOMContentLoaded", () => {

    const addressLoading =
        document.getElementById("address-loading");

    const addressError =
        document.getElementById("address-error");

    const addressEmpty =
        document.getElementById("address-empty");

    const addressList =
        document.getElementById("address-list");

    const addressFormContainer =
        document.getElementById(
            "address-form-container"
        );

    const addressForm =
        document.getElementById("address-form");

    const addAddressButton =
        document.getElementById(
            "add-address-button"
        );

    const cancelAddressButton =
        document.getElementById(
            "cancel-address-button"
        );

    const checkoutItems =
        document.getElementById(
            "checkout-items"
        );

    const checkoutSubtotal =
        document.getElementById(
            "checkout-subtotal"
        );

    const checkoutTotal =
        document.getElementById(
            "checkout-total"
        );

    const placeOrderButton =
        document.getElementById(
            "place-order-button"
        );


    /*
    --------------------------------------------------
    CHECKOUT SUCCESS ELEMENTS
    --------------------------------------------------
    */

    const checkoutLayout =
        document.querySelector(".checkout-layout");

    const checkoutSuccess =
        document.getElementById(
            "checkout-success"
        );

    const successOrderNumber =
        document.getElementById(
            "success-order-number"
        );

    const viewOrderButton =
        document.getElementById(
            "view-order-button"
        );


    /*
    --------------------------------------------------
    PLACE ORDER BUTTON
    --------------------------------------------------
    */

    placeOrderButton.addEventListener(
        "click",
        placeOrder
    );


    /*
    --------------------------------------------------
    CHECKOUT STATE
    --------------------------------------------------
    */

    let selectedAddressId = null;

    let cartHasItems = false;


    /*
    --------------------------------------------------
    UPDATE CONTINUE BUTTON
    --------------------------------------------------
    */

    function updateContinueButton() {

        placeOrderButton.disabled =
            !selectedAddressId ||
            !cartHasItems;

    }


    /*
    --------------------------------------------------
    LOAD ADDRESSES
    --------------------------------------------------
    */

    async function loadAddresses() {

        try {

            const response =
                await fetchWithAuth(
                    "/api/auth/addresses/"
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to load addresses."
                );

            }


            const addresses =
                await response.json();


            addressLoading.style.display =
                "none";


            addressList.innerHTML =
                "";


            if (
                !addresses ||
                addresses.length === 0
            ) {

                addressEmpty.hidden =
                    false;

                updateContinueButton();

                return;

            }


            addressEmpty.hidden =
                true;


            /*
            --------------------------------------------------
            CREATE ADDRESS CARDS
            --------------------------------------------------
            */

            addresses.forEach(
                (address) => {

                    const addressCard =
                        document.createElement(
                            "article"
                        );


                    addressCard.className =
                        "address-card";


                    /*
                    --------------------------------------------------
                    SELECT DEFAULT ADDRESS
                    --------------------------------------------------
                    */

                    if (
                        address.is_default
                    ) {

                        addressCard.classList.add(
                            "selected"
                        );

                        selectedAddressId =
                            address.id;

                    }


                    /*
                    --------------------------------------------------
                    ADDRESS CARD HTML
                    --------------------------------------------------
                    */

                    addressCard.innerHTML = `

                        <div
                            class="address-card-header"
                        >

                            <h3
                                class="address-card-name"
                            >
                                ${address.full_name}
                            </h3>

                            ${
                                address.is_default
                                    ? `
                                        <span
                                            class="address-default-badge"
                                        >
                                            Default
                                        </span>
                                      `
                                    : ""
                            }

                        </div>


                        <p>
                            ${address.phone_number}
                        </p>


                        <p>
                            ${address.address_line_1}
                        </p>


                        ${
                            address.address_line_2
                                ? `
                                    <p>
                                        ${address.address_line_2}
                                    </p>
                                  `
                                : ""
                        }


                        <p>
                            ${address.city},
                            ${address.state}
                            - ${address.pincode}
                        </p>

                    `;


                    /*
                    --------------------------------------------------
                    ADDRESS SELECTION
                    --------------------------------------------------
                    */

                    addressCard.addEventListener(
                        "click",
                        () => {

                            selectedAddressId =
                                address.id;


                            document
                                .querySelectorAll(
                                    ".address-card"
                                )
                                .forEach(
                                    (card) => {

                                        card.classList.remove(
                                            "selected"
                                        );

                                    }
                                );


                            addressCard.classList.add(
                                "selected"
                            );


                            updateContinueButton();

                        }
                    );


                    addressList.appendChild(
                        addressCard
                    );

                }
            );


            updateContinueButton();


        } catch (error) {

            console.error(
                "Address loading error:",
                error
            );


            addressLoading.style.display =
                "none";


            addressError.textContent =
                "We couldn't load your addresses. Please try again.";


            addressError.hidden =
                false;

        }

    }


    /*
    --------------------------------------------------
    LOAD CART
    --------------------------------------------------
    */

    async function loadCart() {

        try {

            const response =
                await fetchWithAuth(
                    "/api/cart/"
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to load cart."
                );

            }


            const cart =
                await response.json();


            checkoutItems.innerHTML =
                "";


            /*
            --------------------------------------------------
            EMPTY CART
            --------------------------------------------------
            */

            if (
                !cart.items ||
                cart.items.length === 0
            ) {

                cartHasItems =
                    false;


                checkoutSubtotal.textContent =
                    "₹0";


                checkoutTotal.textContent =
                    "₹0";


                updateContinueButton();


                return;

            }


            cartHasItems =
                true;


            let total = 0;


            /*
            --------------------------------------------------
            RENDER CART ITEMS
            --------------------------------------------------
            */

            cart.items.forEach(
                (item) => {

                    total +=
                        Number(
                            item.subtotal
                        );


                    const checkoutItem =
                        document.createElement(
                            "article"
                        );


                    checkoutItem.className =
                        "checkout-item";


                    checkoutItem.innerHTML = `

                        <img
                            src="${item.product.image}"
                            alt="${item.product.name}"
                            class="checkout-item-image"
                        >


                        <div
                            class="checkout-item-info"
                        >

                            <h3
                                class="checkout-item-name"
                            >
                                ${item.product.name}
                            </h3>


                            ${
                                item.variant
                                    ? `
                                        <p
                                            class="checkout-item-variant"
                                        >
                                            ${item.variant.name}
                                        </p>
                                      `
                                    : ""
                            }


                            <p
                                class="checkout-item-quantity"
                            >
                                Quantity: ${item.quantity}
                            </p>

                        </div>


                        <p
                            class="checkout-item-price"
                        >
                            ₹${Number(
                                item.subtotal
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </p>

                    `;


                    checkoutItems.appendChild(
                        checkoutItem
                    );

                }
            );


            /*
            --------------------------------------------------
            UPDATE TOTALS
            --------------------------------------------------
            */

            checkoutSubtotal.textContent =
                `₹${total.toLocaleString(
                    "en-IN"
                )}`;


            checkoutTotal.textContent =
                `₹${total.toLocaleString(
                    "en-IN"
                )}`;


            updateContinueButton();


        } catch (error) {

            console.error(
                "Cart loading error:",
                error
            );


            checkoutItems.innerHTML = `

                <div
                    class="checkout-state checkout-error"
                >
                    We couldn't load your cart.
                    Please try again.
                </div>

            `;

        }

    }


    /*
    --------------------------------------------------
    ADD ADDRESS BUTTON
    --------------------------------------------------
    */

    addAddressButton.addEventListener(
        "click",
        () => {

            addressFormContainer.hidden =
                false;

        }
    );


    /*
    --------------------------------------------------
    CANCEL ADDRESS FORM
    --------------------------------------------------
    */

    cancelAddressButton.addEventListener(
        "click",
        () => {

            addressForm.reset();

            addressFormContainer.hidden =
                true;

        }
    );


    /*
    --------------------------------------------------
    CREATE NEW ADDRESS
    --------------------------------------------------
    */

    addressForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const formData =
                new FormData(
                    addressForm
                );


            const addressData = {

                full_name:
                    formData.get(
                        "full_name"
                    ),

                phone_number:
                    formData.get(
                        "phone_number"
                    ),

                address_line_1:
                    formData.get(
                        "address_line_1"
                    ),

                address_line_2:
                    formData.get(
                        "address_line_2"
                    ),

                city:
                    formData.get(
                        "city"
                    ),

                state:
                    formData.get(
                        "state"
                    ),

                pincode:
                    formData.get(
                        "pincode"
                    ),

                is_default:
                    formData.get(
                        "is_default"
                    ) === "on",

            };


            try {

                const response =
                    await fetchWithAuth(
                        "/api/auth/addresses/",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body:
                                JSON.stringify(
                                    addressData
                                ),
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    console.error(
                        "Address creation failed:",
                        data
                    );


                    addressError.textContent =
                        "Unable to save this address. Please check your details.";


                    addressError.hidden =
                        false;


                    return;

                }


                addressError.hidden =
                    true;


                addressForm.reset();


                addressFormContainer.hidden =
                    true;


                /*
                --------------------------------------------------
                RELOAD ADDRESSES
                --------------------------------------------------
                */

                await loadAddresses();


            } catch (error) {

                console.error(
                    "Address creation error:",
                    error
                );


                addressError.textContent =
                    "Something went wrong while saving the address.";


                addressError.hidden =
                    false;

            }

        }
    );


    /*
    --------------------------------------------------
    SHOW CHECKOUT SUCCESS
    --------------------------------------------------
    */

    function showCheckoutSuccess(order) {

        /*
        Hide the normal checkout layout.
        */

        checkoutLayout.hidden =
            true;


        /*
        Display the success section.
        */

        checkoutSuccess.hidden =
            false;


        /*
        Display the real order number.
        */

        successOrderNumber.textContent =
            `#${order.order_number}`;


        /*
        Configure the View Order button.
        */

        viewOrderButton.href =
            `/orders/${order.id}/`;

    }


    async function createPayment(orderId) {
        const response = await fetchWithAuth(
            "/api/payment/create/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    order_id: orderId,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail ||
                "Unable to create payment."
            );
        }

        return data;
    }

    async function verifyPayment(response) {
        const apiResponse = await fetchWithAuth(
            "/api/payment/verify/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    razorpay_order_id:
                        response.razorpay_order_id,

                    razorpay_payment_id:
                        response.razorpay_payment_id,

                    razorpay_signature:
                        response.razorpay_signature,
                }),
            }
        );

        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            throw new Error(
                data.detail ||
                "Payment verification failed."
            );
        }

        return data;
    }


    function openRazorpayCheckout(payment) {
        const options = {
            key: payment.key_id,

            amount: payment.amount_in_paise,

            currency: payment.currency,

            name: "Ornament Store",

            description: `Payment for Order #${payment.order_number}`,

            order_id: payment.razorpay_order_id,

            handler: async function (response) {
                try {
                    const verification =
                        await verifyPayment(response);

                    console.log(
                        "Payment verified successfully:",
                        verification
                    );

                    showCheckoutSuccess({
                        id: verification.order_id,
                        order_number: verification.order_number,
                    });

                } catch (error) {
                    console.error(
                        "Payment verification failed:",
                        error
                    );

                    alert(
                        error.message ||
                        "Payment verification failed. Please contact support."
                    );
                }
            },

            modal: {
                ondismiss: function () {
                    placeOrderButton.disabled = false;

                    placeOrderButton.textContent =
                        "Continue to Order";
                },
            },

            theme: {
                color: "#b08d57",
            },
        };

        const razorpay = new Razorpay(options);

        razorpay.on("payment.failed", function (response) {
            console.log(
                "========== RAZORPAY PAYMENT FAILED =========="
            );

            console.log(
                "Complete response:",
                response
            );

            console.log(
                "Error object:",
                response.error
            );

            console.log(
                "Error JSON:",
                JSON.stringify(response.error, null, 2)
            );

            console.log(
                "Description:",
                response.error?.description
            );

            console.log(
                "============================================="
            );

            placeOrderButton.disabled = false;

            placeOrderButton.textContent =
                "Continue to Order";
        });

        razorpay.open();
    }


    /*
    --------------------------------------------------
    PLACE ORDER
    --------------------------------------------------
    */

    async function placeOrder() {

        /*
        --------------------------------------------------
        BASIC FRONTEND VALIDATION
        --------------------------------------------------
        */

        if (
            !selectedAddressId ||
            !cartHasItems
        ) {

            return;

        }


        /*
        --------------------------------------------------
        DISABLE BUTTON WHILE REQUEST IS RUNNING
        --------------------------------------------------
        */

        placeOrderButton.disabled =
            true;


        placeOrderButton.textContent =
            "Placing Order...";


        try {

            /*
            --------------------------------------------------
            SEND ORDER REQUEST
            --------------------------------------------------
            */

            const response =
                await fetchWithAuth(
                    "/api/orders/",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify({
                                address_id:
                                    selectedAddressId,
                            }),
                    }
                );


            const data =
                await response.json();


            /*
            --------------------------------------------------
            HANDLE BACKEND ERROR
            --------------------------------------------------
            */

            if (!response.ok) {

                console.error(
                    "Order creation failed:",
                    data
                );


                throw new Error(
                    data.detail ||
                    "Unable to place your order."
                );

            }
            const payment = await createPayment(data.id);

            openRazorpayCheckout(payment);
            /*
            --------------------------------------------------
            ORDER CREATED SUCCESSFULLY
            --------------------------------------------------
            */

            console.log(
                "Order created successfully:",
                data
            );


            

        } catch (error) {

            /*
            --------------------------------------------------
            HANDLE ORDER CREATION ERROR
            --------------------------------------------------
            */

            console.error(
                "Place order error:",
                error
            );


            alert(
                error.message ||
                "Something went wrong while placing your order."
            );


            /*
            --------------------------------------------------
            RESTORE BUTTON
            --------------------------------------------------
            */

            placeOrderButton.disabled =
                false;


            placeOrderButton.textContent =
                "Continue to Order";

        }

    }


    /*
    --------------------------------------------------
    INITIAL PAGE LOAD
    --------------------------------------------------
    */

    loadAddresses();

    loadCart();

});