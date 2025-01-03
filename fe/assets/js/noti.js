import { userDropdown } from "./auth.js";
// import { getNotifications } from "./data.js";
import { getNotifications } from "./data_2.js";
import { registeredStations } from "./maps.js";

// Elements
const notificationBtn = document.getElementById('notificationBtn');
export const notificationList = document.getElementById('notificationList');
const notificationItems = document.getElementById('notificationItems');
const bellIcon = document.querySelector('.bell'); // Icon quả chuông
const notiBell = document.querySelector('.noti_bell');

let hasNewNotifications = false; // Trạng thái có thông báo mới

// Example data for notifications
const stationData = [
    { station: "Station 1", gas: "CO2", ppm: 3.814, status: "Danger", time: "15:35:00 PM" },
    { station: "Station 2", gas: "CO", ppm: 2.66, status: "Warning", time: "15:35:10 PM" },
    { station: "Station 3", gas: "NH4", ppm: 3.636, status: "Normal", time: "15:35:20 PM" },
    { station: "Station 4", gas: "Acetona", ppm: 2.155, status: "Warning", time: "15:36:00 PM" },
    { station: "Station 1", gas: "CO2", ppm: 4.2, status: "Danger", time: "15:36:10 PM" },
    { station: "Station 1", gas: "CO2", ppm: 4.2, status: "Danger", time: "15:36:10 PM" },
    { station: "Station 1", gas: "CO2", ppm: 4.2, status: "Danger", time: "15:36:10 PM" },
    { station: "Station 1", gas: "CO2", ppm: 4.2, status: "Danger", time: "15:36:10 PM" }
];

// Function to render notifications
function renderNotifications() {
    // Clear existing notifications
    notificationItems.innerHTML = '';

    // Filter data: Only include 'Warning' or 'Danger' status
    // const alerts = stationData.filter(item => item.status === 'Warning' || item.status === 'Danger');
    // const alerts = getNotifications();
    const alerts = getNotifications().filter(alert => 
        registeredStations.includes(alert.station) && 
        (alert.status === 'Warning' || alert.status === 'Danger')
    );

    if (alerts.length === 0) {
        notificationItems.innerHTML = '<li>No notifications</li>';
        return;
    }

    // Đảo ngược danh sách để thông báo mới nhất xuất hiện trước
    const reversedAlerts = alerts.slice().reverse();

    // Populate notification list
    reversedAlerts.forEach(alert => {
        const listItem = document.createElement('li');
        listItem.className = alert.status.toLowerCase();
        listItem.innerHTML = `
            <strong>${alert.station}</strong> - ${alert.gas}  
            <span>(${alert.ppm} ppm)</span>  
            <div>Time: ${alert.time}</div>
        `;
        notificationItems.appendChild(listItem);
    });

    // Đặt trạng thái có thông báo mới nếu có thông báo chưa xem
    if (alerts.length > 0) {
        hasNewNotifications = true;
        updateBellIcon();
    }
}

// Toggle notification list visibility
notificationBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event bubbling
    renderNotifications();
    notificationList.classList.toggle('hidden');
    userDropdown.classList.add('hidden');

    // Xóa chấm than đỏ khi thông báo đã được xem
    if (!notificationList.classList.contains('hidden')) {
        hasNewNotifications = false;
        updateBellIcon();
    }
});

// Hide notification list when clicking outside
window.addEventListener('click', (e) => {
    if (!notificationBtn.contains(e.target) && !notificationList.contains(e.target)) {
        notificationList.classList.add('hidden');
    }
});

// Function to check for new notifications
function checkNewNotifications() {
    const alerts = getNotifications().filter(alert =>
        registeredStations.includes(alert.station) &&
        (alert.status === 'Warning' || alert.status === 'Danger')
    );

    // Nếu có thông báo mới so với lần trước
    if (alerts.length > 0 && !notificationList.classList.contains('hidden')) {
        hasNewNotifications = true;
        updateBellIcon();
    }
}

// Function to update bell icon
function updateBellIcon() {
    if (hasNewNotifications) {
        bellIcon.classList.add('new-notification'); // Thêm class hiển thị chấm đỏ
        notiBell.classList.remove('hidden');
    } else {
        bellIcon.classList.remove('new-notification'); // Xóa class chấm đỏ
        notiBell.classList.add('hidden');
    }
}

// Tự động cập nhật thông báo mỗi 30 giây
setInterval(() => {
    renderNotifications(),
    checkNewNotifications();
}, 30000);

checkNewNotifications();