// script.js

const API_URL = "http://127.0.0.1:8000"; // URL da sua API

// -------------------- CADASTRO --------------------
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
      const res = await fetch(`${API_URL}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Erro: ${error.detail || res.status}`);
        return;
      }

      alert("Cadastro realizado com sucesso! Faça login agora.");
      registerForm.reset();
      window.location.href = "login.html"; // redireciona para login
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor.");
    }
  });
}

// -------------------- LOGIN --------------------
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Erro: ${error.detail || res.status}`);
        return;
      }

      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      alert("Login realizado com sucesso!");
      window.location.href = "dashboard.html"; // redireciona para dashboard
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor.");
    }
  });
}

// -------------------- VERIFICAR AUTENTICAÇÃO --------------------
function getToken() {
  return localStorage.getItem("access_token");
}

async function fetchProtected(route) {
  const token = getToken();
  if (!token) {
    alert("Você precisa fazer login.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_URL}${route}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      if (res.status === 401) {
        alert("Token inválido ou expirado. Faça login novamente.");
        localStorage.removeItem("access_token");
        window.location.href = "login.html";
      }
      throw new Error(`Erro: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    alert("Erro ao buscar dados protegidos.");
  }
}
