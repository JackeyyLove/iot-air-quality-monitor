import {notificationList} from "./noti.js";
import { clearRegisteredStations } from "./maps.js";

let isLoggedIn = false;

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

// API endpoint
const SIGNIN_API = "http://localhost:5000/signin";
const SIGNUP_API = "http://localhost:5000/signup";
const LOGOUT_API = "http://localhost:5000/logout";

// Simulate successful Sign In (this can be replaced with actual authentication logic)
function signInSuccess() {
    isLoggedIn = true;

    // Hide Sign In/Sign Up buttons
    authButtons.classList.add('hidden');
    // Show Notification and Logout buttons
    userActions.classList.remove('hidden');
    // Close modal
    authModal.style.display = 'none';

    // Hiển thị button đăng ký trên real-time
    const registerButton = document.getElementById('registerStation');
    if (registerButton) {
        registerButton.classList.remove('hidden'); // Hiển thị nút đăng ký
    }
}

// Hàm gửi yêu cầu đăng nhập
async function login(username, password) {
    try {
        const response = await fetch(SIGNIN_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to sign in");
        }

        const data = await response.json();
        console.log("Login successful:", data);
        signInSuccess(); // Gọi hàm xử lý khi đăng nhập thành công
    } catch (error) {
        console.error("Login error:", error);
        alert("Đăng nhập thất bại: " + error.message); // Hiển thị thông báo lỗi
    }
}

// Hàm gửi yêu cầu đăng ký
async function signup(username, password, type = "user") {
    try {
        const response = await fetch(SIGNUP_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, type })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to sign up");
        }

        const data = await response.json();
        console.log("Signup successful:", data);
        alert("Đăng ký thành công! Vui lòng đăng nhập."); // Hiển thị thông báo
        toSignIn.click(); // Chuyển sang form đăng nhập
    } catch (error) {
        console.error("Signup error:", error);
        alert("Đăng ký thất bại: " + error.message); // Hiển thị thông báo lỗi
    }
}

// Hàm gửi yêu cầu Logout
async function performLogout() {
    try {
        const response = await fetch(LOGOUT_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to log out");
        }

        const data = await response.json();
        console.log("Logout successful:", data);

        // Xử lý sau khi Logout thành công
        handleLogoutSuccess();
    } catch (error) {
        console.error("Logout error:", error);
        alert("Đăng xuất thất bại: " + error.message); // Hiển thị thông báo lỗi nếu logout thất bại
    }
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
// signInForm.addEventListener('submit', (e) => {
//     e.preventDefault(); // Prevent page reload
//     signInSuccess();
// });

signInForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload
    const username = signInForm.querySelector('input[type="email"]').value;
    const password = signInForm.querySelector('input[type="password"]').value;
    login(username, password); // Gọi hàm gửi yêu cầu đăng nhập
});

// Simulate form submission for Sign Up
// signUpForm.addEventListener('submit', (e) => {
//     e.preventDefault(); // Prevent page reload
//     signInSuccess();
// });

signUpForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload
    const username = signUpForm.querySelector('input[type="email"]').value;
    const password = signUpForm.querySelector('input[type="password"]').value;
    signup(username, password); // Gọi hàm gửi yêu cầu đăng ký
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
// logout.addEventListener('click', () => {
//     isLoggedIn = false;

//     // Show Sign In/Sign Up buttons
//     authButtons.classList.remove('hidden');
//     // Hide User Actions
//     userActions.classList.add('hidden');
//     // Hide dropdown menu
//     userDropdown.classList.add('hidden');

//     // Ẩn nút đăng ký trên real-time
//     const registerButton = document.getElementById('registerStation');
//     if (registerButton) {
//         registerButton.classList.add('hidden'); // Ẩn nút đăng ký
//     }
// });

// Hàm xử lý khi logout thành công
function handleLogoutSuccess() {
    isLoggedIn = false;

    // Gọi hàm clearRegisteredStations để reset danh sách trạm
    clearRegisteredStations();

    // Show Sign In/Sign Up buttons
    authButtons.classList.remove('hidden');
    // Hide User Actions
    userActions.classList.add('hidden');
    // Hide dropdown menu
    userDropdown.classList.add('hidden');

    // Ẩn nút đăng ký trên real-time
    const registerButton = document.getElementById('registerStation');
    if (registerButton) {
        registerButton.classList.add('hidden'); // Ẩn nút đăng ký
    }

    alert("Đăng xuất thành công!"); // Hiển thị thông báo
}

// Gắn sự kiện Logout vào nút
logout.addEventListener('click', (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của nút

    if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
        performLogout(); // Gọi hàm gửi yêu cầu Logout
    }
});