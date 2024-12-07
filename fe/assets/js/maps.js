import { updateChartsForStation } from './chart.js';

// Tạo bản đồ với tọa độ mặc định
var map = L.map('maps-map').setView([21.0285, 105.8542], 13);  

// Tải bản đồ từ OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    detectRetina: true
}).addTo(map);

// Dữ liệu các vị trí và tên tương ứng (các quận ở Hà Nội)
var locations = [
    { name: "Hà Nội", lat: 21.0285, lon: 105.8542 },
    { name: "Quận Hai Bà Trưng", lat: 21.0031, lon: 105.8614 },
    { name: "Quận Đống Đa", lat: 21.0219, lon: 105.8321 },
    { name: "Quận Hoàng Mai", lat: 20.9932, lon: 105.8618 },
    { name: "Quận Cầu Giấy", lat: 21.0354, lon: 105.7984 },
    { name: "Quận Hà Đông", lat: 20.9774, lon: 105.7324 },
    { name: "Quận Thanh Xuân", lat: 20.9931, lon: 105.8243 },
    { name: "Quận Long Biên", lat: 21.0333, lon: 105.9365 }
];

// Tạo marker và gắn vào map
var markers = [];
locations.forEach(function(location) {
    var marker = L.marker([location.lat, location.lon]).addTo(map)
        .bindPopup(location.name)
        .on('click', function() {
            document.getElementById('maps-search').value = location.name;  // Cập nhật thanh tìm kiếm khi click vào marker
            map.setView([location.lat, location.lon]);  // Di chuyển đến vị trí của marker
            updateChartsForStation(location.name); // Cập nhật thông số và biểu đồ cho trạm đo
        })
        .on('mouseover', function() {  
            marker.openPopup();
        })
        .on('mouseout', function() {  
            marker.closePopup();
        });
    markers.push(marker);
});

// Cập nhật danh sách các vị trí vào trong thanh tìm kiếm
var searchSelect = document.getElementById('maps-search');
locations.forEach(function(location) {
    var option = document.createElement('option');
    option.value = location.name;
    option.setAttribute('data-lat', location.lat);
    option.setAttribute('data-lon', location.lon);
    option.textContent = location.name;
    searchSelect.appendChild(option);
});

// Khi chọn một vị trí từ dropdown
searchSelect.addEventListener('change', function() {
    var selectedLocation = locations.find(function(location) {
        return location.name === searchSelect.value;
    });
    if (selectedLocation) {
        // Tìm và mở popup của marker tương ứng
        var selectedMarker = markers.find(function(marker) {
            return marker.getLatLng().lat === selectedLocation.lat && marker.getLatLng().lng === selectedLocation.lon;
        });
        if (selectedMarker) {
            selectedMarker.openPopup();
            map.setView([selectedLocation.lat, selectedLocation.lon]);
            updateChartsForStation(selectedLocation.name); // Cập nhật thông số và biểu đồ cho trạm đo
        }
    }
});

// Khi load giao diện, tự động chọn trạm Hà Nội
window.onload = function() {
    // Di chuyển bản đồ đến Hà Nội và cập nhật thanh tìm kiếm
    document.getElementById('maps-search').value = "Hà Nội"; // Đặt giá trị của thanh tìm kiếm
    map.setView([21.0285, 105.8542]);  // Di chuyển bản đồ đến Hà Nội
};