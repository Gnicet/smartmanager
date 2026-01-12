const welcome = document.getElementById('welcome');
const logoutBtn = document.getElementById('logoutBtn');

const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'index.html';
} else {
  fetch('http://127.0.0.1:8000/users/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error('Não autorizado');
      return res.json();
    })
    .then(data => {
      welcome.textContent = `Bem-vindo, ${data.name}!`;
    })
    .catch(() => {
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});
