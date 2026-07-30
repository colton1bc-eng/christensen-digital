document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), index % 6 * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Contact form — submits to Netlify Forms. Netlify detects the form (name="contact",
// data-netlify="true") at deploy time and captures submissions automatically once this
// site is live on Netlify; it emails a notification for each one. Locally / off-Netlify
// the fetch below will fail, which is caught and surfaced as an error message.
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const submitBtn = form.querySelector('.form-submit');

// Note: the <form> has name="contact", so `form.name` returns that string, not the
// "name" input — field lookups below use getElementById to avoid that collision.
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const businessField = document.getElementById('business');
  const messageField = document.getElementById('message');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const name = nameField.value.trim();
  const email = emailField.value.trim();
  const business = businessField.value.trim();
  const message = messageField.value.trim();

  if (!name || !email || !business || !message) {
    status.dataset.state = 'error';
    status.textContent = 'Please fill in every field before sending.';
    return;
  }

  if (!emailPattern.test(email)) {
    status.dataset.state = 'error';
    status.textContent = 'That email address doesn’t look quite right.';
    return;
  }

  submitBtn.disabled = true;
  status.dataset.state = '';
  status.textContent = 'Sending…';

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(new FormData(form)).toString(),
  })
    .then(() => {
      status.dataset.state = 'success';
      status.textContent = `Thanks, ${name.split(' ')[0]}! Your message is on its way — I'll be in touch within a day or two.`;
      form.reset();
    })
    .catch(() => {
      status.dataset.state = 'error';
      status.textContent = 'Something went wrong sending that — please email colton1bc@icloud.com directly.';
    })
    .finally(() => {
      submitBtn.disabled = false;
    });
});
