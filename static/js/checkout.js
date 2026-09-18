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


    let selectedAddressId = null;

    let cartHasItems = false;


    function updateContinueButton() {

        placeOrderButton.disabled =
            !selectedAddressId ||
            !cartHasItems;

    }


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

                return;

            }


            addressEmpty.hidden =
                true;


            addresses.forEach(
                (address) => {

                    const addressCard =
                        document.createElement(
                            "article"
                        );


                    addressCard.className =
                        "address-card";


                    if (
                        address.is_default
                    ) {

                        addressCard.classList.add(
                            "selected"
                        );

                        selectedAddressId =
                            address.id;

                    }


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


            cart.items.forEach(
                (item) => {

                    total +=
                        Number(item.subtotal);


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
                            ).toLocaleString("en-IN")}
                        </p>

                    `;


                    checkoutItems.appendChild(
                        checkoutItem
                    );

                }
            );


            checkoutSubtotal.textContent =
                `₹${total.toLocaleString("en-IN")}`;

            checkoutTotal.textContent =
                `₹${total.toLocaleString("en-IN")}`;


            updateContinueButton();


        } catch (error) {

            console.error(
                "Cart loading error:",
                error
            );

            checkoutItems.innerHTML = `
                <div class="checkout-state checkout-error">
                    We couldn't load your cart. Please try again.
                </div>
            `;

        }

    }


    addAddressButton.addEventListener(
        "click",
        () => {

            addressFormContainer.hidden =
                false;

        }
    );


    cancelAddressButton.addEventListener(
        "click",
        () => {

            addressForm.reset();

            addressFormContainer.hidden =
                true;

        }
    );


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


    loadAddresses();

    loadCart();

});