function validateForm(event) {
  event.preventDefault(); // Stop form from submitting

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const usernameError = document.getElementById("username-error");
  const passwordError = document.getElementById("password-error");
  const generalError = document.getElementById("error-message");

  // Reset all error messages
  usernameError.style.display = "none";
  passwordError.style.display = "none";
  generalError.style.display = "none";

  let hasError = false;

  if (username === "") {
    usernameError.style.display = "block";
    hasError = true;
  }

  if (password === "") {
    passwordError.style.display = "block";
    hasError = true;
  }

  if (hasError) {
    generalError.style.display = "block";
    return;
  }

  // Optional: Save to backend
  fetch("http://localhost:3000/api/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      // Role-based redirect
      if (username.toLowerCase() === "admin" && password === "admin@123") {
        window.location.href = "admin.html";
      } else if (username.toLowerCase() === "student" && password === "student@123") {
        window.location.href = "student.html";
      } else {
        generalError.textContent = "Invalid username or password.";
        generalError.style.display = "block";
      }
    })
    .catch(err => {
      console.error("Error saving data:", err);
      generalError.textContent = "Something went wrong. Try again.";
      generalError.style.display = "block";
    });
}
