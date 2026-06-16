// script.js

// Show modal on Join click
document.querySelector('.join-btn').addEventListener('click', () => {
  document.getElementById('joinModal').style.display = 'flex';

  // Clear previous input values
  document.getElementById('username').value = '';
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
});

// Close modal
function closeModal() {
  document.getElementById('joinModal').style.display = 'none';
}

// Handle Sign Up
function handleSignup() {
  const name = document.getElementById('username').value;
  if (name) {
    alert(`${name}, you are registered! Thank you for joining LinkRide.`);
    closeModal();
  } else {
    alert("Please enter your name to sign up.");
  }
}

// Handle Login
function handleLogin() {
  const name = document.getElementById('username').value;
  if (name) {
    alert(`Welcome back, ${name}! You are now logged in.`);
    closeModal();
  } else {
    alert("Please enter your name to log in.");
  }
}

// Hamburger Menu Toggle
function toggleMenu() {
  const menu = document.querySelector('.nav-menu');
  menu.classList.toggle('active');
}
