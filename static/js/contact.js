document.addEventListener("DOMContentLoaded", () => {

    const contactForm =
        document.getElementById("contact-form");

    const contactMessage =
        document.getElementById("contact-form-message");


    contactForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            contactMessage.textContent =
                "Thank you for contacting us. We'll get back to you soon.";

            contactForm.reset();

        }
    );

});