
document.addEventListener("DOMContentLoaded", () => {

    const accessToken =
        localStorage.getItem("access_token");

    const profileMessage =
        document.getElementById("profile-message");

    const profileDetails =
        document.getElementById("profile-details");

    const editProfileForm =
        document.getElementById("edit-profile-form");

    const editProfileButton =
        document.getElementById("edit-profile-button");

    const cancelEditButton =
        document.getElementById("cancel-edit-button");

    if (!accessToken) {

        window.location.href = "/login/";

        return;
    }

    async function loadProfile() {

        try {

            const response = await fetchWithAuth(
                "/api/auth/profile/",
                {
                    method: "GET",
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                console.error(
                    "Failed to load profile:",
                    data
                );

                profileMessage.textContent =
                    "Unable to load your profile.";

                return;
            }

            displayProfile(data);

        } catch (error) {

            console.error(
                "Profile error:",
                error
            );

            profileMessage.textContent =
                "Something went wrong. Please try again.";

        }

    }

    
    function displayProfile(user) {

        document.getElementById(
            "profile-first-name"
        ).textContent =
            user.first_name || "—";

        document.getElementById(
            "profile-last-name"
        ).textContent =
            user.last_name || "—";

        document.getElementById(
            "profile-email"
        ).textContent =
            user.email || "—";

        document.getElementById(
            "profile-phone"
        ).textContent =
            user.phone_number || "—";


        // Populate edit form

        document.getElementById(
            "edit-first-name"
        ).value =
            user.first_name || "";

        document.getElementById(
            "edit-last-name"
        ).value =
            user.last_name || "";

        document.getElementById(
            "edit-email"
        ).value =
            user.email || "";

        document.getElementById(
            "edit-phone"
        ).value =
            user.phone_number || "";

    }


    editProfileButton.addEventListener(
        "click",
        () => {

            profileDetails.hidden = true;
            editProfileForm.hidden = false;

        }
    );

    cancelEditButton.addEventListener(
        "click",
        () => {

            editProfileForm.hidden = true;
            profileDetails.hidden = false;

        }
    );

   
    const editProfileMessage =
        document.getElementById("edit-profile-message");

    editProfileForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const firstName =
                document.getElementById(
                    "edit-first-name"
                ).value;

            const lastName =
                document.getElementById(
                    "edit-last-name"
                ).value;

            const phoneNumber =
                document.getElementById(
                    "edit-phone"
                ).value;

            editProfileMessage.textContent =
                "Saving changes...";

            try {

                const response = await fetchWithAuth(
                    "/api/auth/profile/update/",
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            first_name: firstName,
                            last_name: lastName,
                            phone_number: phoneNumber,
                        }),
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {

                    console.error(
                        "Profile update failed:",
                        data
                    );

                    editProfileMessage.textContent =
                        "Unable to update your profile.";

                    return;
                }

                console.log(
                    "Profile updated:",
                    data
                );

                editProfileMessage.textContent =
                    "Profile updated successfully.";

                displayProfile(data);

                editProfileForm.hidden = true;
                profileDetails.hidden = false;

            } catch (error) {

                console.error(
                    "Profile update error:",
                    error
                );

                editProfileMessage.textContent =
                    "Something went wrong. Please try again.";

            }

        }
    );


    const changePasswordButton =
        document.getElementById("change-password-button");

    const changePasswordCard =
        document.getElementById("change-password-card");

    const cancelPasswordButton =
        document.getElementById("cancel-password-button");

    changePasswordButton.addEventListener(
        "click",
        () => {
            changePasswordCard.hidden = false;
        }
    );

    cancelPasswordButton.addEventListener(
        "click",
        () => {
            changePasswordCard.hidden = true;
        }
    );

    const changePasswordForm =
        document.getElementById("change-password-form");

    const changePasswordMessage =
        document.getElementById("change-password-message");

    changePasswordForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const oldPassword =
                document.getElementById(
                    "current-password"
                ).value;

            const newPassword =
                document.getElementById(
                    "new-password"
                ).value;

            const confirmPassword =
                document.getElementById(
                    "confirm-password"
                ).value;

            if (newPassword !== confirmPassword) {

                changePasswordMessage.textContent =
                    "New passwords do not match.";

                return;
            }

            changePasswordMessage.textContent =
                "Changing password...";

            try {

                const response = await fetchWithAuth(
                    "/api/auth/change-password/",
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            old_password: oldPassword,
                            new_password: newPassword,
                        }),
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {

                    console.error(
                        "Password change failed:",
                        data
                    );

                    changePasswordMessage.textContent =
                        "Unable to change your password.";

                    return;
                }

                console.log(
                    "Password changed:",
                    data
                );

                changePasswordMessage.textContent =
                    "Password changed successfully.";

                changePasswordForm.reset();

            } catch (error) {

                console.error(
                    "Password change error:",
                    error
                );

                changePasswordMessage.textContent =
                    "Something went wrong. Please try again.";

            }

        }
    );


    const logoutButton =
        document.getElementById("logout-button");

    logoutButton.addEventListener(
        "click",
        async () => {

            const refreshToken =
                localStorage.getItem("refresh_token");

            if (!refreshToken) {

                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");

                window.location.href = "/login/";

                return;
            }

            try {

                const response = await fetchWithAuth(
                    "/api/auth/logout/",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json", 
                        },

                        body: JSON.stringify({
                            refresh: refreshToken,
                        }),
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {

                    console.error(
                        "Logout failed:",
                        data
                    );

                    return;
                }

                console.log(
                    "Logout successful:",
                    data
                );

                localStorage.removeItem(
                    "access_token"
                );

                localStorage.removeItem(
                    "refresh_token"
                );

                window.location.href = "/login/";

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );


    loadProfile();

});
