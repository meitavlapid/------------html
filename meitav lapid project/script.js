function toggleMenu() {
  const navbar = document.querySelector(".nav");
  navbar.classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".theform");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // מונע שליחה של הטופס ברירת מחדל

    // איפוס הודעות שגיאה
    document
      .querySelectorAll(".error")
      .forEach((error) => (error.textContent = ""));

    const fullName = document.getElementById("firstname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    let isValid = true;

    // בדיקת שם מלא
    if (!fullName) {
      setError("firstname", "Full name is required.");
      isValid = false;
    }

    // בדיקת אימייל
    if (!email) {
      setError("email", "Email is required.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("email", "Invalid email address.");
      isValid = false;
    }

    // בדיקת מספר טלפון
    if (!phone) {
      setError("phone", "Phone number is required.");
      isValid = false;
    } else if (!/^\d+$/.test(phone)) {
      setError("phone", "Phone number must contain only digits.");
      isValid = false;
    }

    // בדיקת תוכן ההודעה
    if (!message) {
      setError("message", "Message content is required.");
      isValid = false;
    }

    // אם הכל תקין
    if (isValid) {
      displaySuccessMessage();
      form.reset(); // איפוס הטופס
    }
  });

  function setError(inputId, message) {
    const input = document.getElementById(inputId);
    const error = input.nextElementSibling;
    if (error && error.classList.contains("error")) {
      error.textContent = message;
    }
  }

  function displaySuccessMessage() {
    const successMessage = document.createElement("p");
    successMessage.textContent = "Your message has been sent successfully!";
    successMessage.style.color = " white";
    successMessage.style.marginTop = "20px";
    form.appendChild(successMessage);
  }
});
