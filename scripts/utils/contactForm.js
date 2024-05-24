function displayModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
}
//Contact form check
function contactFormCheck(event) {
  event.preventDefault();
  let isValid = true;
  const nomRegex = /^[a-zA-ZÀ-ÿ\s']{2,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const messageRegex = /^[\w\s,.!?'"-]{10,}$/;

  let formData = {
    firstname: document.getElementById("firstname").value,
    lastname: document.getElementById("lastname").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };

  let firstName = document.getElementById("firstname");
  let lastName = document.getElementById("lastname");
  let eMail = document.getElementById("email");
  let mEssage = document.getElementById("message");

  const errorFirst = document.querySelector(".first");
  const errorLast = document.querySelector(".last");
  const errorMail = document.querySelector(".mail");
  const errorMes=document.querySelector(".mess")


  // Vérification du prénom
  if (!nomRegex.test(formData.firstname)) {
    errorFirst.style.display = "block";
    firstName.style.border = "3px solid red";
    firstName.setAttribute("aria-invalid", "true");
    isValid = false;
  } else {
    errorFirst.style.display = "none";
    firstName.style.border = "0px";
    firstName.removeAttribute("aria-invalid");
  }

  // Vérification du nom
  if (!nomRegex.test(formData.lastname)) {
    errorLast.style.display = "block";
    lastName.style.border = "3px solid red";
    lastName.setAttribute("aria-invalid", "true");
    isValid = false;
  } else {
    errorLast.style.display = "none";
    lastName.style.border = "0px";
    lastName.removeAttribute("aria-invalid");
  }

  // Vérification de l'email
  if (!emailRegex.test(formData.email)) {
    errorMail.style.display = "block";
    eMail.style.border = "3px solid red";
    eMail.setAttribute("aria-invalid", "true");
    isValid = false;
  } else {
    errorMail.style.display = "none";
    eMail.style.border = "0px";
    eMail.removeAttribute("aria-invalid");
  }

  // Vérification du message
  if (!messageRegex.test(formData.message)) {
    errorMes.style.display = "block";
    mEssage.style.border = "3px solid red";
    mEssage.setAttribute("aria-invalid", "true");
    isValid = false;
  } else {
    errorMes.style.display = "none";
    mEssage.style.border = "0px";
    mEssage.removeAttribute("aria-invalid");
  }

  if (isValid) {
    console.log(formData);
  }
  return isValid;
}

document
  .getElementById("contact_form")
  .addEventListener("submit", contactFormCheck);
