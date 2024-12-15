import {notificationList} from "./noti.js";

// Elements
const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');
const authModal = document.getElementById('authModal');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');
const toSignUp = document.getElementById('toSignUp');
const toSignIn = document.getElementById('toSignIn');
const authButtons = document.getElementById('authButtons');
const userActions = document.getElementById('userActions');
const userAvatar = document.getElementById('userAvatar');
export const userDropdown = document.getElementById('userDropdown');
const logout = document.getElementById('logout');

// Simulate successful Sign In (this can be replaced with actual authentication logic)
function signInSuccess() {
    // Hide Sign In/Sign Up buttons
    authButtons.classList.add('hidden');
    // Show Notification and Logout buttons
    userActions.classList.remove('hidden');
    // Close modal
    authModal.style.display = 'none';
}

// Show Modal with Sign In Form
signInBtn.addEventListener('click', () => {
    authModal.style.display = 'flex';
    signInForm.classList.remove('hidden');
    signUpForm.classList.add('hidden');
    signInForm.querySelectorAll('input').forEach(input => input.value = '');
});

// Show Modal with Sign Up Form
signUpBtn.addEventListener('click', () => {
    authModal.style.display = 'flex';
    signUpForm.classList.remove('hidden');
    signInForm.classList.add('hidden');
    signUpForm.querySelectorAll('input').forEach(input => input.value = '');
});

// Switch to Sign Up Form
toSignUp.addEventListener('click', () => {
    signInForm.classList.add('hidden');
    signUpForm.classList.remove('hidden');
});

// Switch to Sign In Form
toSignIn.addEventListener('click', () => {
    signUpForm.classList.add('hidden');
    signInForm.classList.remove('hidden');
});

// Close Modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.style.display = 'none';
    }
});

// Simulate form submission for Sign In
signInForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload
    signInSuccess();
});

// Simulate form submission for Sign Up
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload
    signInSuccess();
});

// Toggle Dropdown when clicking on User Avatar
userAvatar.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event bubbling
    userDropdown.classList.toggle('hidden');
    notificationList.classList.add('hidden');
});

// Hide dropdown when clicking outside
window.addEventListener('click', (e) => {
    if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.add('hidden');
    }
});

// Handle Logout
logout.addEventListener('click', () => {
    // Show Sign In/Sign Up buttons
    authButtons.classList.remove('hidden');
    // Hide User Actions
    userActions.classList.add('hidden');
    // Hide dropdown menu
    userDropdown.classList.add('hidden');
});
