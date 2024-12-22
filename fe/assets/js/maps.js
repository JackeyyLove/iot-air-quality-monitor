import { updateChartsForStation } from './chart.js';

export let currentStation = "Hà Nội";  // Trạm đo hiện tại

// Tạo bản đồ với tọa độ mặc định
var map = L.map('maps-map').setView([21.0285, 105.8542], 13);  

// Tải bản đồ từ OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    detectRetina: true
}).addTo(map);

// Dữ liệu các vị trí và tên tương ứng (các quận ở Hà Nội)
var locations = [
    { name: "Hà Nội", lat: 21.0285, lon: 105.8542, registered: false, temperature: "25°C", humidity: "65%" },
    { name: "Quận Hai Bà Trưng", lat: 21.0031, lon: 105.8614, registered: false, temperature: "25°C", humidity: "65%" },
    { name: "Quận Đống Đa", lat: 21.0219, lon: 105.8321, registered: false, temperature: "25°C", humidity: "65%" },
    { name: "Quận Hoàng Mai", lat: 20.9932, lon: 105.8618, registered: false, temperature: "25°C", humidity: "65%" },
    { name: "Quận Cầu Giấy", lat: 21.0354, lon: 105.7984, registered: false, temperature: "25°C", humidity: "65%" },
    { name: "Quận Hà Đông", lat: 20.9774, lon: 105.7324, registered: false, temperature: "25°C", humidity: "65%" },
    { name: "Quận Thanh Xuân", lat: 20.9931, lon: 105.8243, registered: false, temperature: "25°C", humidity: "65%" },
    { name: "Quận Long Biên", lat: 21.0333, lon: 105.9365, registered: false, temperature: "25°C", humidity: "65%" }
];

// Tạo marker và gắn vào map
var markers = [];
locations.forEach(function(location) {
    var marker = L.marker([location.lat, location.lon]).addTo(map)
        .bindPopup(location.name)
        .on('click', function() {
            document.getElementById('maps-search').value = location.name;  // Cập nhật thanh tìm kiếm khi click vào marker
            map.setView([location.lat, location.lon]);  // Di chuyển đến vị trí của marker
            displayStationInfo(location);  // Hiển thị thông tin trạm
            updateChartsForStation(location.name); // Cập nhật thông số và biểu đồ cho trạm đo
            currentStation = location.name;
        })
        .on('mouseover', function() {  
            marker.openPopup();
        })
        .on('mouseout', function() {  
            marker.closePopup();
        });
    markers.push(marker);
});

// Hiển thị thông tin trạm
function displayStationInfo(location) {
    document.getElementById('stationName').textContent = location.name;
    document.getElementById('temperature').textContent = location.temperature;
    document.getElementById('humidity').textContent = location.humidity;

    const registerButton = document.getElementById('registerStation');
    registerButton.textContent = location.registered ? "Hủy đăng ký" : "Đăng ký";
    registerButton.classList.toggle('registered', location.registered);

    // Thêm sự kiện cho nút đăng ký
    registerButton.onclick = function () {
        console.log("Button clicked!"); // Xác nhận sự kiện được gọi
        toggleRegistration(location);
    };
}

export let registeredStations = []; // Danh sách các trạm đã được đăng ký

// Đăng ký/hủy đăng ký trạm
function toggleRegistration(location) {
    // Thay đổi trạng thái đăng ký
    location.registered = !location.registered;
    console.log(`Registered status for ${location.name}: ${location.registered}`);

    if (location.registered) {
        registeredStations.push(location.name); // Thêm trạm vào danh sách
    } else {
        registeredStations = registeredStations.filter(station => station !== location.name); // Xóa trạm khỏi danh sách
    }

    const registerButton = document.getElementById('registerStation');
    registerButton.textContent = location.registered ? "Hủy đăng ký" : "Đăng ký";
    registerButton.classList.toggle('registered', location.registered);

    // Cập nhật màu marker
    const marker = markers.find(marker => 
        marker.getLatLng().lat === location.lat && marker.getLatLng().lng === location.lon
    );
    if (marker) {
        marker.setIcon(L.icon({
            iconUrl: location.registered
                ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png'
                : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
            shadowSize: [41, 41]
        }));
    }

    // Cập nhật màu trong dropdown
    const searchSelect = document.getElementById('maps-search');
    const option = Array.from(searchSelect.options).find(opt => opt.value === location.name);
    if (option) {
        option.style.backgroundColor = location.registered ? "green" : "white";
        option.style.color = location.registered ? "white" : "black";
        console.log(`Updated color for ${location.name} in dropdown`);
    }
}


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
            displayStationInfo(selectedLocation);
            updateChartsForStation(selectedLocation.name); // Cập nhật thông số và biểu đồ cho trạm đo
            currentStation = selectedLocation.name;
        }
    }
});

// Khi load giao diện, tự động chọn trạm Hà Nội
window.onload = function() {
    // const defaultLocation = locations[0];
    // Di chuyển bản đồ đến Hà Nội và cập nhật thanh tìm kiếm
    // displayStationInfo(defaultLocation);
    document.getElementById('maps-search').value = "Hà Nội"; // Đặt giá trị của thanh tìm kiếm
    map.setView([21.0285, 105.8542]);  // Di chuyển bản đồ đến Hà Nội
};