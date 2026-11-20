
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");

    // Stop if this page does not contain the registration form.
    if (!registerForm) return;

    const registerMessage = document.getElementById("register-message");
    const registerButton = document.getElementById("register-button");

    // Convert Django REST Framework validation errors into readable messages.
    function getErrorMessage(data) {
        const fieldLabels = {
            first_name: "First name",
            last_name: "Last name",
            email: "Email",
            phone_number: "Phone number",
            password: "Password",
            non_field_errors: "Error"
        };

        const messages = [];

        if (data && typeof data === "object") {
            Object.entries(data).forEach(([field, errors]) => {
                const label = fieldLabels[field] || field;

                if (Array.isArray(errors)) {
                    messages.push(`${label}: ${errors.join(" ")}`);
                } else if (typeof errors === "string") {
                    messages.push(`${label}: ${errors}`);
                }
            });
        }

        return messages.length
            ? messages.join("\n")
            : "Unable to create your account. Please check your details.";
    }

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const firstName = document.getElementById("register-first-name").value.trim();
        const lastName = document.getElementById("register-last-name").value.trim();
        const email = document.getElementById("register-email").value.trim();
        const phoneNumber = document.getElementById("register-phone").value.trim();
        const password = document.getElementById("register-password").value;

        if (registerMessage) {
            registerMessage.textContent = "Creating your account...";
            registerMessage.classList.remove("error", "success");
            registerMessage.setAttribute("role", "status");
        }

        if (registerButton) {
            registerButton.disabled = true;
            registerButton.textContent = "Creating account...";
        }

        try {
            const response = await fetch("/api/auth/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone_number: phoneNumber,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Registration failed:", data);

                if (registerMessage) {
                    registerMessage.textContent = getErrorMessage(data);
                    registerMessage.classList.add("error");
                    registerMessage.setAttribute("role", "alert");
                }

                return;
            }

            if (registerMessage) {
                registerMessage.textContent =
                    "Account created successfully. Redirecting...";
                registerMessage.classList.add("success");
                registerMessage.setAttribute("role", "status");
            }

            window.location.href = "/login/";

        } catch (error) {
            console.error("Registration error:", error);

            if (registerMessage) {
                registerMessage.textContent =
                    "Unable to connect right now. Please check your connection and try again.";
                registerMessage.classList.add("error");
                registerMessage.setAttribute("role", "alert");
            }

        } finally {
            if (registerButton) {
                registerButton.disabled = false;
                registerButton.textContent = "Create Account";
            }
        }
    });
});
