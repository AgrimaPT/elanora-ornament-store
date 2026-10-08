document.addEventListener("DOMContentLoaded", function () {

    const chatToggle = document.getElementById("aiChatToggle");
    const chatWindow = document.getElementById("aiChatWindow");
    const chatClose = document.getElementById("aiChatClose");

    const chatForm = document.getElementById("aiChatForm");
    const chatInput = document.getElementById("aiChatInput");
    const chatMessages = document.getElementById("aiChatMessages");


    if (
        !chatToggle ||
        !chatWindow ||
        !chatClose ||
        !chatForm ||
        !chatInput ||
        !chatMessages
    ) {
        return;
    }


    // --------------------------------
    // Open chat
    // --------------------------------

    chatToggle.addEventListener("click", function () {

        chatWindow.classList.add("active");

        chatInput.focus();

    });


    // --------------------------------
    // Close chat
    // --------------------------------

    chatClose.addEventListener("click", function () {

        chatWindow.classList.remove("active");

    });


    // --------------------------------
    // Add user message
    // --------------------------------

    function addUserMessage(message) {

        const messageWrapper = document.createElement("div");

        messageWrapper.className = "user-message";

        messageWrapper.innerHTML = `
            <div class="user-message-bubble">
                ${escapeHtml(message)}
            </div>
        `;

        chatMessages.appendChild(messageWrapper);

        scrollToBottom();
    }


    // --------------------------------
    // Add AI message
    // --------------------------------

    function addAIMessage(message) {

        const messageWrapper = document.createElement("div");

        messageWrapper.className = "ai-message";

        messageWrapper.innerHTML = `
            <div class="ai-message-bubble">
                ${formatAIMessage(message)}
            </div>
        `;

        chatMessages.appendChild(messageWrapper);

        scrollToBottom();
    }


    function addProductCards(products) {

        const productsWrapper = document.createElement("div");

        productsWrapper.className = "ai-product-cards";

        products.forEach(function (product) {

            // --------------------------------
            // Product card
            // --------------------------------

            const card = document.createElement("a");

            card.className = "ai-product-card";

            card.href = `/product/${product.slug}/`;


            // --------------------------------
            // Product image
            // --------------------------------

            if (product.image) {

                const image = document.createElement("img");

                image.src = product.image;

                image.alt = product.name;

                image.className = "ai-product-image";

                card.appendChild(image);

            }


            // --------------------------------
            // Product information
            // --------------------------------

            const productInfo = document.createElement("div");

            productInfo.className = "ai-product-info";


            // --------------------------------
            // Product name
            // --------------------------------

            const productName = document.createElement("div");

            productName.className = "ai-product-name";

            productName.textContent = product.name;

            productInfo.appendChild(productName);


            // --------------------------------
            // Product price
            // --------------------------------

            if (product.price !== null) {

                const productPrice = document.createElement("div");

                productPrice.className = "ai-product-price";

                productPrice.textContent =
                    `₹${Number(product.price).toFixed(2)}`;

                productInfo.appendChild(productPrice);

            }


            // --------------------------------
            // Variant prices
            // --------------------------------

            if (
                product.variants &&
                product.variants.length > 0
            ) {

                const variantsWrapper =
                    document.createElement("div");

                variantsWrapper.className =
                    "ai-product-variants";

                product.variants.forEach(function (variant) {

                    const variantPrice =
                        document.createElement("div");

                    variantPrice.className =
                        "ai-product-variant";

                    variantPrice.textContent =
                        `${variant.name} – ₹${Number(
                            variant.price
                        ).toFixed(2)}`;

                    variantsWrapper.appendChild(
                        variantPrice
                    );

                });

                productInfo.appendChild(
                    variantsWrapper
                );

            }


            // --------------------------------
            // Add information to card
            // --------------------------------

            card.appendChild(productInfo);

            productsWrapper.appendChild(card);

        });


        // --------------------------------
        // Add cards to chat
        // --------------------------------

        chatMessages.appendChild(
            productsWrapper
        );

        scrollToBottom();
    }

    // --------------------------------
    // Loading indicator
    // --------------------------------

    function addTypingIndicator() {

        const messageWrapper = document.createElement("div");

        messageWrapper.className = "ai-message";

        messageWrapper.id = "aiTypingIndicator";

        messageWrapper.innerHTML = `
            <div class="ai-message-bubble">
                <span class="ai-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </div>
        `;

        chatMessages.appendChild(messageWrapper);

        scrollToBottom();
    }


    // --------------------------------
    // Remove loading indicator
    // --------------------------------

    function removeTypingIndicator() {

        const indicator = document.getElementById(
            "aiTypingIndicator"
        );

        if (indicator) {
            indicator.remove();
        }

    }


    // --------------------------------
    // Scroll chat to bottom
    // --------------------------------

    function scrollToBottom() {

        chatMessages.scrollTop = chatMessages.scrollHeight;

    }


    // --------------------------------
    // Escape HTML
    // --------------------------------

    function escapeHtml(text) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }

    function formatAIMessage(message) {

        let safeMessage = escapeHtml(message);

        const lines = safeMessage.split("\n");

        const formattedLines = lines.map(function (line) {

            // Convert escaped bullet
            if (line.trim().startsWith("\\*")) {
                line = "•" + line.trim().substring(2);
            }

            // Convert normal bullet
            else if (line.trim().startsWith("*")) {
                line = "•" + line.trim().substring(1);
            }

            // Remove Markdown bold markers
            line = line.replaceAll("**", "");

            return line;

        });

        return formattedLines.join("<br>");
    }

    // --------------------------------
    // Send message
    // --------------------------------

    chatForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const message = chatInput.value.trim();


        if (!message) {
            return;
        }


        // Show user's message
        addUserMessage(message);


        // Clear input
        chatInput.value = "";


        // Show loading indicator
        addTypingIndicator();


        // Disable input while waiting
        chatInput.disabled = true;


        try {

            const response = await fetch(
                "/api/ai/chat/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })
                }
            );


            const data = await response.json();


            removeTypingIndicator();


            if (!response.ok) {

                addAIMessage(
                    data.error ||
                    "Sorry, something went wrong. Please try again."
                );

                return;
            }


            addAIMessage(data.response);

            if (data.products && data.products.length > 0) {
                addProductCards(data.products);
            }


        } catch (error) {

            removeTypingIndicator();

            addAIMessage(
                "I'm sorry, I'm having trouble connecting right now. Please try again."
            );

            console.error(
                "AI chat error:",
                error
            );

        } finally {

            chatInput.disabled = false;

            chatInput.focus();

        }

    });

});