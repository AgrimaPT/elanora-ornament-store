
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    if (!loginForm) return;

    const loginButton = document.getElementById("login-button");
    const loginMessage = document.getElementById("login-message");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;

        // Clear any previous message.
        if (loginMessage) {
            loginMessage.textContent = "";
            loginMessage.classList.remove("error", "success");
            loginMessage.removeAttribute("role");
        }

        // Prevent repeated submissions while the request is running.
        if (loginButton) {
            loginButton.disabled = true;
            loginButton.textContent = "Signing in...";
        }

        try {
            const response = await fetch("/api/auth/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Login failed:", data);

                if (loginMessage) {
                    loginMessage.textContent =
                        data.detail ||
                        data.message ||
                        data.non_field_errors?.[0] ||
                        "Invalid email or password. Please try again.";

                    loginMessage.classList.add("error");
                    loginMessage.setAttribute("role", "alert");
                }

                return;
            }

            // Preserve the existing authentication behavior.
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);

            console.log("Login successful.");

            window.location.href = "/";

        } catch (error) {
            console.error("Login error:", error);

            if (loginMessage) {
                loginMessage.textContent =
                    "Unable to connect right now. Please check your connection and try again.";

                loginMessage.classList.add("error");
                loginMessage.setAttribute("role", "alert");
            }

        } finally {
            if (loginButton) {
                loginButton.disabled = false;
                loginButton.textContent = "Login";
            }
        }
    });
});
