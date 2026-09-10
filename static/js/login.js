document.addEventListener("DOMContentLoaded", () => {


    const loginForm =
        document.getElementById("login-form");


    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const email =
            document.getElementById("login-email").value;

        const password =
            document.getElementById("login-password").value;


        try {

            const response = await fetch(
                "/api/auth/login/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                }
            );


            const data = await response.json();


            if (!response.ok) {

                console.error(
                    "Login failed:",
                    data
                );

                return;
            }


            localStorage.setItem(
                "access_token",
                data.access
            );

            localStorage.setItem(
                "refresh_token",
                data.refresh
            );


            console.log(
                "Login successful."
            );


            window.location.href = "/";


        } catch (error) {

            console.error(
                "Login error:",
                error
            );

        }

    });


});
