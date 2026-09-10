document.addEventListener("DOMContentLoaded", () => {

    const accountButton =
        document.getElementById("account-button");


    if (!accountButton) {
        return;
    }


    const accessToken =
        localStorage.getItem("access_token");


    accountButton.addEventListener(
        "click",
        () => {

            if (accessToken) {

                window.location.href = "/profile/";

            } else {

                window.location.href = "/login/";

            }

        }
    );
    

});
