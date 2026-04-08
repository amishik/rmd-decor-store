document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("admin-login-form");
  const message = document.getElementById("admin-login-message");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const login = document.getElementById("admin-login").value.trim();
    const password = document.getElementById("admin-password").value;

    try {
      const result = await adminLogin(login, password);
      setAdminToken(result.token);
      showMessage(message, "Вход выполнен. Переходим в панель.", "success");
      setTimeout(() => {
        window.location.href = "/admin";
      }, 800);
    } catch (error) {
      showMessage(message, error.message, "error");
    }
  });
});
