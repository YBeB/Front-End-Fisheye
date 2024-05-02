function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}

const submitButton = document.querySelectorAll(".contact_button");

submitButton.forEach((btn) => {
    btn.addEventListener("click", contactFormCheck);
    btn.setAttribute("aria-label", "Envoie du formulaire")
});

function contactFormCheck(event) {
    event.preventDefault();
    let firstnameInput = document.getElementById("firstname").value;
    let lastnameInput = document.getElementById("lastname").value;
    let emailInput = document.getElementById("email").value;
    let messageInput = document.getElementById("message").value;

    if (firstnameInput !== "" && lastnameInput !== "" && emailInput !== "" && messageInput !== "") {
        console.log(`Prénom : ${firstnameInput}, Nom : ${lastnameInput}, Adresse mail : ${emailInput}, Message : ${messageInput}`);
    }
}