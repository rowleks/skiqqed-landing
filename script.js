// Countdown — 25 days from first visit (persisted so it doesn't reset on refresh)
const KEY = 'skiqqed_launch_target_v2';
let target = parseInt(localStorage.getItem(KEY) || '0', 10);
if (!target || isNaN(target)) {
  target = Date.now() + 25 * 24 * 60 * 60 * 1000;
  localStorage.setItem(KEY, String(target));
}
const pad = (n) => String(Math.max(0, n)).padStart(2, '0');
const els = { d: document.getElementById('cd-d'), h: document.getElementById('cd-h'), m: document.getElementById('cd-m'), s: document.getElementById('cd-s') };
function tick() {
  const diff = Math.max(0, target - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff % 86400000 / 3600000);
  const m = Math.floor(diff % 3600000 / 60000);
  const s = Math.floor(diff % 60000 / 1000);
  els.d.textContent = pad(d); els.h.textContent = pad(h); els.m.textContent = pad(m); els.s.textContent = pad(s);
}
tick();
setInterval(tick, 1000);

// Signup
const form = document.getElementById('form');
const signup = document.getElementById('signup');
const email = document.getElementById('email');
const countNote = document.getElementById('count-note');

// persist a friendly waitlist count
let base = parseInt(localStorage.getItem('skiqqed_waitlist_v2') || '1022', 10);
countNote.textContent = base.toLocaleString() + '+';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const v = (email.value || '').trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
    email.focus();
    email.style.outline = '2px solid #F2622B';
    return;
  }
  
  // TODO: SendGrid Integration
  // When ready to integrate SendGrid:
  // 1. Set up a backend endpoint (Node.js, Python, etc.) to handle email submissions
  // 2. Use SendGrid API to store emails in your contact list
  // 3. Replace the localStorage logic below with an API call
  // 
  // Example backend endpoint structure:
  // POST /api/waitlist
  // Body: { email: string }
  // Response: { success: boolean, message: string }
  //
  // SendGrid API example (Node.js):
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // await sgMail.send({
  //   to: email,
  //   from: 'noreply@skiqqed.com',
  //   subject: 'Welcome to SKIQQED Waitlist',
  //   text: 'Thanks for joining!'
  // });
  
  const list = JSON.parse(localStorage.getItem('skiqqed_emails') || '[]');
  if (!list.includes(v)) {
    list.push(v);
    localStorage.setItem('skiqqed_emails', JSON.stringify(list));
    localStorage.setItem('skiqqed_waitlist_v2', String(base + 1));
  }
  signup.classList.add('done');
});
