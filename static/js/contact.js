
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contact-form");
    const contactMessage = document.getElementById("contact-form-message");

    if (!contactForm || !contactMessage) {
        console.error("Contact form or message element not found.");
        return;
    }

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const submitButton = contactForm.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        const originalButtonText = submitButton
            ? submitButton.textContent
            : "";

        // Collect the form values.
        const formData = {
            name: document.getElementById("contact-name").value.trim(),
            email: document.getElementById("contact-email").value.trim(),
            subject: document.getElementById("contact-subject").value.trim(),
            message: document.getElementById("contact-message").value.trim()
        };

        // Show a sending message.
        contactMessage.textContent = "Sending your message...";
        contactMessage.classList.remove("success-message", "error-message");

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        try {
            const response = await fetch("/api/contact/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json().catch(() => ({}));


            if (!response.ok) {
                if (response.status === 429) {
                    contactMessage.textContent =
                        "You've sent several enquiries recently. Please wait a minute before trying again.";

                    contactMessage.classList.add("error-message");
                    return;
                }

                const errorText = Object.entries(data)
                    .map(([field, errors]) => {
                        const details = Array.isArray(errors)
                            ? errors.join(" ")
                            : typeof errors === "string"
                                ? errors
                                : JSON.stringify(errors);

                        return `${field}: ${details}`;
                    })
                    .join(" ");

                throw new Error(
                    errorText || `Request failed (${response.status}).`
                );
            }



            contactMessage.textContent =
                data.message ||
                "Thank you for contacting ELANORA.";

            if (data.email_sent === true) {
                contactMessage.classList.add("success-message");
                contactForm.reset();
            } else {
                contactMessage.classList.add("error-message");
            }


        } catch (error) {
            console.error("Contact form submission failed:", error);

            contactMessage.textContent =
                "Sorry, we couldn't send your message. Please try again.";

            contactMessage.classList.add("error-message");

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText || "Send Message";
            }
        }
    });
});
