async function fetchWithAuth(
    url,
    options = {}
) {

    let accessToken =
        localStorage.getItem("access_token");

    let response = await fetch(
        url,
        {
            ...options,
            headers: {
                ...options.headers,
                "Authorization":
                    `Bearer ${accessToken}`,
            },
        }
    );

    if (response.status !== 401) {
        return response;
    }

    const refreshToken =
        localStorage.getItem("refresh_token");

    if (!refreshToken) {
        localStorage.removeItem(
            "access_token"
        );

        localStorage.removeItem(
            "refresh_token"
        );

        window.location.href = "/login/";

        return response;
    }

    const refreshResponse =
        await fetch(
            "/api/token/refresh/",
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

    if (!refreshResponse.ok) {

        localStorage.removeItem(
            "access_token"
        );

        localStorage.removeItem(
            "refresh_token"
        );

        window.location.href = "/login/";

        return response;
    }

    const refreshData =
        await refreshResponse.json();

    accessToken =
        refreshData.access;

    localStorage.setItem(
        "access_token",
        accessToken
    );

    response = await fetch(
        url,
        {
            ...options,
            headers: {
                ...options.headers,
                "Authorization":
                    `Bearer ${accessToken}`,
            },
        }
    );

    return response;
}