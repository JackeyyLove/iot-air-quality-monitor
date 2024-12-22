const deviceNameMapping = {
    "21": "Hà Nội",
    "22": "Quận Hai Bà Trưng",
    "23": "Quận Đống Đa",
    "24": "Quận Hoàng Mai",
    "25": "Quận Cầu Giấy",
    "26": "Quận Hà Đông",
    "27": "Quận Thanh Xuân",
    "28": "Quận Long Biên"
};

const thresholds = {
    CO2: { warning: 360, danger: 430 },
    CO: { warning: 3.5, danger: 6.4 },
    NH4: { warning: 2.5, danger: 3.6 },
    PM25: { warning: 25, danger: 36 } // PM2.5 có ngưỡng khác
};

let stationData = {};
let listeners = []; // Danh sách các hàm lắng nghe
const notifications = [];

// Hàm để thêm listener
function addUpdateListener(listener) {
    listeners.push(listener);
}

// Hàm gọi tất cả listener khi dữ liệu được cập nhật
function notifyListeners() {
    listeners.forEach(listener => listener(stationData));
}

// Hàm lấy dữ liệu từ API và cập nhật stationData
async function fetchStationData() {
    for (const [deviceId, stationName] of Object.entries(deviceNameMapping)) {
        try {
            const response = await fetch(`http://localhost:5000/device/${deviceId}/logs`);
            const logs = await response.json();

            // const sortedLogs = logs
            //     .sort((a, b) => new Date(b.senttime) - new Date(a.senttime))
            //     .slice(0, 20);

            const sortedLogs = logs
                .sort((a, b) => new Date(a.senttime) - new Date(b.senttime))
                .slice(-20);
                // .reverse();

            // stationData[stationName] = {
            //     CO2: sortedLogs.map(entry => entry.co2.toFixed(2)),
            //     CO: sortedLogs.map(entry => entry.co.toFixed(2)),
            //     NH4: sortedLogs.map(entry => entry.nh3.toFixed(2)),
            //     PM25: sortedLogs.map(entry => entry.pm25.toFixed(2)),
            //     times: sortedLogs.map(entry => new Date(entry.senttime).toLocaleTimeString())
            // };

            const station = {
                CO2: sortedLogs.map(entry => parseFloat(entry.co2.toFixed(2))),
                CO: sortedLogs.map(entry => parseFloat(entry.co.toFixed(2))),
                NH4: sortedLogs.map(entry => parseFloat(entry.nh3.toFixed(2))),
                PM25: sortedLogs.map(entry => parseFloat(entry.pm25.toFixed(2))),
                temperature: sortedLogs.map(entry => parseFloat(entry.temperature.toFixed(2))),
                humidity: sortedLogs.map(entry => parseFloat(entry.humidity.toFixed(2))),
                times: sortedLogs.map(entry => new Date(entry.senttime).toLocaleTimeString())
            };

            stationData[stationName] = station;

            // Kiểm tra và thêm thông báo nếu vượt ngưỡng
            ["CO2", "CO", "NH4", "PM25"].forEach((gas) => {
                const latestValue = station[gas][station[gas].length - 1]; // Giá trị mới nhất
                const status =
                    latestValue >= thresholds[gas].danger
                        ? "Danger"
                        : latestValue >= thresholds[gas].warning
                        ? "Warning"
                        : "Normal";

                // Nếu vượt ngưỡng, thêm vào `notifications`
                if (status === "Warning" || status === "Danger") {
                    notifications.push({
                        station: stationName,
                        gas: gas,
                        ppm: latestValue,
                        status: status,
                        time: station.times[station.times.length - 1]
                    });
                }
            });
        } catch (error) {
            console.error(`Failed to fetch data for device ${deviceId}:`, error);
        }
    }

    notifyListeners(); // Gọi tất cả listener khi dữ liệu được cập nhật
}

// Hàm trả về dữ liệu của một trạm đo
// function getStationData(stationName) {
//     return stationData[stationName];
// }

function getStationData(stationName) {
    if (!stationData[stationName]) {
        console.warn(`No data available for station: ${stationName}`);
        return {
            CO2: [],
            CO: [],
            NH4: [],
            PM25: [],
            temperature: [],
            humidity: [],
            times: []
        }; // Trả về dữ liệu rỗng mặc định
    }
    return stationData[stationName];
}

function getNotifications() {
    return notifications;
}

// Cập nhật dữ liệu mỗi 30 giây
setInterval(fetchStationData, 30000);

// Xuất các hàm và dữ liệu cần thiết
export { fetchStationData, getStationData, addUpdateListener, getNotifications };
