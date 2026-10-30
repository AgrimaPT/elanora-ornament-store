
async function fetchWithAuth(
    url,
    options = {}
) {
    let accessToken = localStorage.getItem("access_token");

    // Send the original request with the current access token.
    let response = await fetch(
        url,
        {
            ...options,
            headers: {
                ...options.headers,
                "Authorization": `Bearer ${accessToken}`,
            },
        }
    );

    // If the response isn't 401, return it without refreshing.
    if (response.status !== 401) {
        return response;
    }

    // Get the refresh token.
    const refreshToken = localStorage.getItem("refresh_token");

    // If no refresh token exists, clear tokens and redirect to login.
    if (!refreshToken) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/login/";

        return response;
    }

    // Request a new access token.
    const refreshResponse = await fetch(
        "/api/token/refresh/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refresh: refreshToken,
            }),
        }
    );

    // If refreshing fails, clear tokens and redirect to login.
    if (!refreshResponse.ok) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/login/";

        return response;
    }

    // Read and store the new access token.
    const refreshData = await refreshResponse.json();

    accessToken = refreshData.access;

    localStorage.setItem("access_token", accessToken);

    // Retry the original request once with the new access token.
    response = await fetch(
        url,
        {
            ...options,
            headers: {
                ...options.headers,
                "Authorization": `Bearer ${accessToken}`,
            },
        }
    );

    return response;
}
