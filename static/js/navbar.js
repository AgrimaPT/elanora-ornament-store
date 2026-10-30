document.addEventListener("DOMContentLoaded", () => {
    // Account navigation
    const accountButton = document.getElementById("account-button");

    if (accountButton) {
        accountButton.addEventListener("click", (event) => {
            event.preventDefault();

            const accessToken = localStorage.getItem("access_token");

            const profileUrl = accountButton.dataset.profileUrl;
            const loginUrl = accountButton.dataset.loginUrl;

            window.location.href = accessToken
                ? profileUrl
                : loginUrl;
        });
    }

    // Navbar cart count
    const cartCountElement = document.getElementById("cart-count");

    async function updateNavbarCartCount() {
        if (!cartCountElement) return;

        const accessToken = localStorage.getItem("access_token");

        // Show an empty cart when the user is logged out.
        if (!accessToken) {
            cartCountElement.textContent = "0";
            return;
        }

        try {
            // Reuse the existing authenticated API helper.
            if (typeof fetchWithAuth !== "function") {
                console.error("fetchWithAuth() is not available.");
                return;
            }

            const response = await fetchWithAuth("/api/cart/");

            if (!response.ok) {
                console.error("Unable to fetch cart:", response.status);
                return;
            }

            const data = await response.json();

            // Support common paginated and non-paginated cart responses.
            const items = Array.isArray(data.items)
                ? data.items
                : [];
            // Count total quantities, not just distinct product rows.
            const totalQuantity = items.reduce((total, item) => {
                return total + (Number(item.quantity) || 0);
            }, 0);

            cartCountElement.textContent = String(totalQuantity);
        } catch (error) {
            console.error("Error updating navbar cart count:", error);
        }
    }

    // Load the count when each page opens.
    updateNavbarCartCount();

    // Allow other scripts to refresh the count after cart changes.
    window.updateNavbarCartCount = updateNavbarCartCount;
});