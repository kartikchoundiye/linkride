// linkride/js/script.js

/* =========================================
   1. GLOBAL SCRIPTS & UTILITIES
   ========================================= */

// Clear URL hash on page load to keep it professional
window.addEventListener('load', () => {
  if (window.location.hash) {
    setTimeout(() => {
      history.replaceState(null, null, window.location.pathname + window.location.search);
    }, 10);
  }
});

// Simple Email Validation regex
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Show Custom Toast Notification
function showToast(messageHtml) {
  let toast = document.getElementById('custom-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'custom-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = messageHtml; // Use innerHTML to parse the SVG
  toast.className = 'custom-toast show';

  // Hide after 3 seconds
  setTimeout(() => {
    toast.className = toast.className.replace('show', '');
  }, 3000);
}

// Close dropdown menu if clicked outside (Global listener)
document.addEventListener('click', function (e) {
  if (!e.target.closest('.reviewer-menu')) {
    document.querySelectorAll('.menu-dropdown.show').forEach(menu => {
      menu.classList.remove('show');
    });
  }
});

/* =========================================
   2. AUTHENTICATION & MODAL (Navbar -> Join)
   ========================================= */

// Show auth modal and clear old inputs
function openAuthModal(event) {
  if (event) event.preventDefault();
  document.getElementById('joinModal').style.display = 'flex';
  toggleAuthMode('signup');
  document.getElementById('signup-form').reset();
  document.getElementById('login-form').reset();
}

document.querySelector('.join-btn').addEventListener('click', openAuthModal);

// Close modal
function closeModal() {
  document.getElementById('joinModal').style.display = 'none';
}

// Toggle between Sign Up and Log In modes
function toggleAuthMode(mode) {
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  const title = document.getElementById('auth-title');

  if (mode === 'login') {
    signupForm.style.display = 'none';
    loginForm.style.display = 'flex';
    title.textContent = 'Log In to LinkRide';
  } else {
    signupForm.style.display = 'flex';
    loginForm.style.display = 'none';
    title.textContent = 'Create an Account';
  }
}

// Handle Sign Up
function handleSignup(event) {
  event.preventDefault(); // Prevent page reload
  const name = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;

  if (!isValidEmail(email)) {
    showToast(`
      <div class="toast-content">
        <svg class="toast-tick" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        <span>Please enter a valid email address.</span>
      </div>
    `);
    return;
  }

  if (name) {
    showToast(`
      <div class="toast-content">
        <svg class="toast-tick" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
        <span>${name}, you are registered! Thank you for joining.</span>
      </div>
    `);
    document.getElementById('signup-form').reset();
    closeModal();
  }
}

// Handle Login
function handleLogin(event) {
  event.preventDefault(); // Prevent page reload
  const email = document.getElementById('login-email').value;

  if (!isValidEmail(email)) {
    showToast(`
      <div class="toast-content">
        <svg class="toast-tick" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        <span>Please enter a valid email address.</span>
      </div>
    `);
    return;
  }

  showToast(`
    <div class="toast-content">
      <svg class="toast-tick" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
      </svg>
      <span>Welcome back! You are now logged in.</span>
    </div>
  `);
  document.getElementById('login-form').reset();
  closeModal();
}

/* =========================================
   3. MY RIDES SECTION
   ========================================= */

// Initialize Swiper and dynamically inject reviewer menus to avoid repeating code
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize Swiper if on mobile, or just let Swiper handle breakpoints
  const swiper = new Swiper('.myRidesSwiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      769: {
        // Desktop: destroy Swiper or show all
        enabled: false,
        slidesPerView: 3,
        spaceBetween: 30,
      }
    }
  });

  // Init stars for Reviews section
  initStarRating();

  // Inject three-dot menu into each reviewer header to avoid HTML duplication
  const menuHtml = `⋮
    <div class="menu-dropdown">
      <div class="menu-item" onclick="handleMenuAction(event, 'Review is flagged', this)">Flag as inappropriate</div>
    </div>
  `;
  document.querySelectorAll('.reviewer-header').forEach(header => {
    const menuDiv = document.createElement('div');
    menuDiv.className = 'reviewer-menu';
    menuDiv.setAttribute('onclick', 'toggleMenu(event, this)');
    menuDiv.innerHTML = menuHtml;
    header.appendChild(menuDiv);
  });
});

/* =========================================
   4. REVIEWS SECTION
   ========================================= */

// Toggle Reviews in Reviews Section (See All)
function toggleReviews() {
  const container = document.getElementById('reviewsContainer');
  const btn = document.getElementById('seeAllReviewsBtn');
  if (container.classList.contains('expanded')) {
    container.classList.remove('expanded');
    btn.textContent = 'See all reviews';
    // Reset scroll internally and scroll the section back into view
    container.scrollTop = 0;
    document.getElementById('reviews').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    container.classList.add('expanded');
    btn.textContent = 'Show less';
  }
}

// Toggle three-dot menu dropdown in reviews
function toggleMenu(event, el) {
  event.stopPropagation();
  // Close any other open menus
  document.querySelectorAll('.menu-dropdown.show').forEach(menu => {
    if (menu !== el.querySelector('.menu-dropdown')) {
      menu.classList.remove('show');
    }
  });

  const dropdown = el.querySelector('.menu-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

// Handle action from three-dot menu
function handleMenuAction(event, message, element) {
  event.stopPropagation();

  // Adding the animated check icon to the message
  const toastMessageHtml = `
    <div class="toast-content">
      <svg class="toast-tick" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
      </svg>
      <span>${message}</span>
    </div>
  `;

  showToast(toastMessageHtml);

  // Close the menu automatically
  const dropdown = element.closest('.menu-dropdown');
  if (dropdown) {
    dropdown.classList.remove('show');
  }
}

// Handle Review Submit
function handleReviewSubmit(event, form) {
  event.preventDefault(); // Prevent page reload
  const name = document.getElementById('review-name').value;
  const email = document.getElementById('review-email').value;
  const ratingInput = document.getElementById('review-rating');
  const rating = parseInt(ratingInput.value, 10);

  if (!isValidEmail(email)) {
    showToast(`
      <div class="toast-content">
        <svg class="toast-tick" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        <span>Please enter a valid email address.</span>
      </div>
    `);
    return;
  }

  if (rating === 0) {
    showToast(`
      <div class="toast-content">
        <svg class="toast-tick" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        <span>Please select a star rating.</span>
      </div>
    `);
    return;
  }

  showToast(`
    <div class="toast-content">
      <svg class="toast-tick" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
      </svg>
      <span>Thank you, ${name}! Your review has been submitted.</span>
    </div>
  `);
  form.reset();
  resetStarRating();
}

// Star Rating Interaction Logic
function initStarRating() {
  const stars = document.querySelectorAll('#review-stars .star');
  const ratingInput = document.getElementById('review-rating');

  if (!stars.length || !ratingInput) return;

  stars.forEach(star => {
    // Hover effect
    star.addEventListener('mouseover', function () {
      const val = parseInt(this.getAttribute('data-value'), 10);
      stars.forEach(s => {
        if (parseInt(s.getAttribute('data-value'), 10) <= val) {
          s.classList.add('hover');
        } else {
          s.classList.remove('hover');
        }
      });
    });

    // Remove hover effect when mouse leaves
    star.addEventListener('mouseout', function () {
      stars.forEach(s => s.classList.remove('hover'));
    });

    // Click to select
    star.addEventListener('click', function () {
      const val = parseInt(this.getAttribute('data-value'), 10);
      ratingInput.value = val;

      stars.forEach(s => {
        if (parseInt(s.getAttribute('data-value'), 10) <= val) {
          s.classList.add('selected');
        } else {
          s.classList.remove('selected');
        }
      });
    });
  });
}

// Reset Star Rating Value & Visuals
function resetStarRating() {
  const stars = document.querySelectorAll('#review-stars .star');
  const ratingInput = document.getElementById('review-rating');
  if (ratingInput) ratingInput.value = 0;
  stars.forEach(s => s.classList.remove('selected', 'hover'));
}
