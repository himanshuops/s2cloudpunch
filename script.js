let BACKEND_URL;

if (window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1")) {
  BACKEND_URL = "http://localhost:3000";   // backend local
} else {
  BACKEND_URL = "https://api.s2cloudpunch.in";  // backend deployed on Render
}

const form = document.querySelector('section .ragister form') || document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = form.querySelector('input[type="text"]').value.trim();
  const phone = form.querySelector('input[type="tel"]').value.trim();
  const city = form.querySelector('select').value;
  const email = form.querySelector('input[type="email"]').value.trim();
  const message = form.querySelector('textarea').value.trim();

  const payload = { name, phone, city, email, message };

  try {
    const res = await fetch(`${BACKEND_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      form.reset();
      alert('✅ Thanks — message sent!');
    } else {
      alert('❌ Error: ' + (data.error || 'server error'));
    }
  } catch (err) {
    console.error(err);
    alert('⚠️ Network error (check backend URL)');
  }
});

