// Countdown — 25 days from first visit (persisted so it doesn't reset on refresh)
const KEY = "skiqqed_launch_target_v2";
let target = parseInt(localStorage.getItem(KEY) || "0", 10);
if (!target || isNaN(target)) {
  target = Date.now() + 25 * 24 * 60 * 60 * 1000;
  localStorage.setItem(KEY, String(target));
}
const pad = (n) => String(Math.max(0, n)).padStart(2, "0");
const els = {
  d: document.getElementById("cd-d"),
  h: document.getElementById("cd-h"),
  m: document.getElementById("cd-m"),
  s: document.getElementById("cd-s"),
};
function tick() {
  const diff = Math.max(0, target - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  els.d.textContent = pad(d);
  els.h.textContent = pad(h);
  els.m.textContent = pad(m);
  els.s.textContent = pad(s);
}
tick();
setInterval(tick, 1000);

// Signup
const form = document.getElementById("form");
const signup = document.getElementById("signup");
const email = document.getElementById("email");
const countNote = document.getElementById("count-note");
const modal = document.getElementById("modal");
const modalIcon = document.getElementById("modal-icon");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const modalClose = document.getElementById("modal-close");

// persist a friendly waitlist count
let base = parseInt(localStorage.getItem("skiqqed_waitlist_v2") || "1022", 10);
countNote.textContent = base.toLocaleString() + "+";

// Modal functions
function showModal(type, title, message) {
  modalIcon.className = "modal-icon " + type;
  modalIcon.textContent = type === "success" ? "✓" : "✕";
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modal.showModal();
}

modalClose.addEventListener("click", () => {
  modal.close();
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.close();
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const v = (email.value || "").trim();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
    email.focus();
    email.style.outline = "2px solid #F2622B";
    return;
  }

  // Reset outline
  email.style.outline = "none";

  // Disable button during submission
  const button = form.querySelector("button");
  const originalText = button.innerHTML;
  button.disabled = true;
  button.innerHTML = "Submitting...";

  try {
    // Call Netlify serverless function
    const response = await fetch("/.netlify/functions/submit-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: v }),
    });

    const data = await response.json();

    if (data.success) {
      // Update local waitlist count for display
      localStorage.setItem("skiqqed_waitlist_v2", String(base + 1));
      countNote.textContent = (base + 1).toLocaleString() + "+";
      signup.classList.add("done");
      showModal(
        "success",
        "You're on the list! 🎉",
        "We'll email you the moment SKIQQED goes live. Get ready to find your first opportunity.",
      );
    } else {
      showModal(
        "error",
        "Submission Failed",
        data.message || "Failed to add email. Please try again.",
      );
      button.disabled = false;
      button.innerHTML = originalText;
    }
  } catch (error) {
    console.error("Submission error:", error);
    showModal(
      "error",
      "Something went wrong",
      "Please check your connection and try again.",
    );
    button.disabled = false;
    button.innerHTML = originalText;
  }
});
