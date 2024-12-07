// Function to update the status based on ppm value
function updateStatus(concentration, elementId) {
    let statusElement = document.querySelector(`.status-value_${elementId}`);

    // Add appropriate class based on concentration value
    if (concentration < 2.5) {
        statusElement.classList.add('status-value_normal');
        statusElement.classList.remove('status-value_warning', 'status-value_danger'); // Loại bỏ các class khác
        statusElement.textContent = 'Normal';
    } else if (concentration >= 2.5 && concentration < 3.2) {
        statusElement.classList.add('status-value_warning');
        statusElement.classList.remove('status-value_normal', 'status-value_danger'); // Loại bỏ các class khác
        statusElement.textContent = 'Warning';
    } else {
        statusElement.classList.add('status-value_danger');
        statusElement.classList.remove('status-value_normal', 'status-value_warning'); // Loại bỏ các class khác
        statusElement.textContent = 'Danger';
    }
}

// Update concentration values and statuses for each gas
export default function updateConcentrations(concentration, elementId) {
    // Update concentration and status
    document.querySelector(`.concentration_${elementId}`).textContent = `${concentration} ppm`;
    updateStatus(concentration, elementId);
}