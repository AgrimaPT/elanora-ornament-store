
document.addEventListener("DOMContentLoaded", () => {

    const registerForm =
        document.getElementById("register-form");

    const registerMessage =
        document.getElementById("register-message");

    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const firstName =
                document.getElementById(
                    "register-first-name"
                ).value;

            const lastName =
                document.getElementById(
                    "register-last-name"
                ).value;

            const email =
                document.getElementById(
                    "register-email"
                ).value;

            const phoneNumber =
                document.getElementById(
                    "register-phone"
                ).value;

            const password =
                document.getElementById(
                    "register-password"
                ).value;

            registerMessage.textContent =
                "Creating your account...";

            try {

                const response = await fetch(
                    "/api/auth/register/",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                        },

                        body: JSON.stringify({
                            first_name: firstName,
                            last_name: lastName,
                            email: email,
                            phone_number: phoneNumber,
                            password: password,
                        }),
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {

                    console.error(
                        "Registration failed:",
                        data
                    );

                    registerMessage.textContent =
                        "Unable to create your account. Please check your details.";

                    return;
                }

                console.log(
                    "Registration successful:",
                    data
                );

                registerMessage.textContent =
                    "Account created successfully. Redirecting...";

                window.location.href =
                    "/login/";

            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );

                registerMessage.textContent =
                    "Something went wrong. Please try again.";

            }

        }
    );

});

