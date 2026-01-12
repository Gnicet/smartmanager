const registerForm = document.getElementById('registerForm');
const registerError = document.getElementById('registerError');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://127.0.0.1:8000/users/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) throw new Error('Erro ao cadastrar usuário');

    alert('Cadastro realizado com sucesso!');
    window.location.href = 'index.html';
  } catch (err) {
    registerError.textContent = err.message;
  }
});
