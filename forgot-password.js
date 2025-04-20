function sendResetEmail(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const message = document.getElementById("confirmation-message");

  if (email.trim() === "") {
    message.textContent = "Email is required.";
    message.style.color = "red";
    return;
  }

  fetch("http://localhost:3000/api/send-reset-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .then(data => {
      message.textContent = data.message;
      message.style.color = "green";
      setTimeout(() => {
        window.location.href = "main.html";
      }, 5000);
    })
    .catch(err => {
      console.error("Email error:", err);
      message.textContent = "Failed to send email.";
      message.style.color = "red";
    });
}
