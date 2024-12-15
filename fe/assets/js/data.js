// Dữ liệu giả cho các trạm đo, mỗi trạm có 4 mảng con cho 4 loại khí
const stationData = {
    "Hà Nội": {
        CO2: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),   // Mảng CO2 với 20 giá trị ngẫu nhiên từ 0 đến 4
        CO: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),    // Mảng CO với 20 giá trị ngẫu nhiên từ 0 đến 4
        NH4: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),   // Mảng NH4 với 20 giá trị ngẫu nhiên từ 0 đến 4
        Acetona: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)), // Mảng Acetona với 20 giá trị ngẫu nhiên từ 0 đến 4
        times: Array(20).fill().map(() => new Date().toLocaleTimeString()) // Mảng thời gian hiện tại
    },
    "Quận Hai Bà Trưng": {
        CO2: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        CO: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        NH4: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        Acetona: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        times: Array(20).fill().map(() => new Date().toLocaleTimeString())
    },
    "Quận Đống Đa": {
        CO2: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        CO: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        NH4: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        Acetona: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        times: Array(20).fill().map(() => new Date().toLocaleTimeString())
    },
    "Quận Hoàng Mai": {
        CO2: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        CO: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        NH4: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        Acetona: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        times: Array(20).fill().map(() => new Date().toLocaleTimeString())
    },
    "Quận Cầu Giấy": {
        CO2: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        CO: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        NH4: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        Acetona: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        times: Array(20).fill().map(() => new Date().toLocaleTimeString())
    },
    "Quận Hà Đông": {
        CO2: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        CO: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        NH4: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        Acetona: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        times: Array(20).fill().map(() => new Date().toLocaleTimeString())
    },
    "Quận Thanh Xuân": {
        CO2: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        CO: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        NH4: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        Acetona: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        times: Array(20).fill().map(() => new Date().toLocaleTimeString())
    },
    "Quận Long Biên": {
        CO2: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        CO: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        NH4: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        Acetona: Array(20).fill().map(() => (Math.random() * 4).toFixed(2)),
        times: Array(20).fill().map(() => new Date().toLocaleTimeString())
    }
};

const thresholds = {
    CO2: { warning: 2.5, danger: 3.2 },
    CO: { warning: 2.5, danger: 3.2 },
    NH4: { warning: 2.5, danger: 3.2 },
    Acetona: { warning: 2.5, danger: 3.2 }
};

const notifications = [];

// Hàm để cập nhật dữ liệu mỗi 30 giây
function updateData() {
    // Duyệt qua tất cả các trạm và cập nhật mỗi 30s
    Object.keys(stationData).forEach(function(stationName) {
        const station = stationData[stationName];

        // Tạo giá trị mới và thời gian
        const newData = {
            CO2: (Math.random() * 4).toFixed(2),
            CO: (Math.random() * 4).toFixed(2),
            NH4: (Math.random() * 4).toFixed(2),
            Acetona: (Math.random() * 4).toFixed(2),
            time: new Date().toLocaleTimeString()
        };

        // Thêm giá trị mới vào mỗi mảng con (tạo giá trị ngẫu nhiên từ 0 đến 4)
        station.CO2.push(newData.CO2);
        station.CO.push(newData.CO);
        station.NH4.push(newData.NH4);
        station.Acetona.push(newData.Acetona);
        station.times.push(newData.time);

        // Lưu thời gian lúc dữ liệu được thêm vào
        // const timeNow = new Date().toLocaleTimeString();
        // station.times.push(timeNow);

        // Giới hạn dữ liệu không vượt quá 20 giá trị
        if (station.CO2.length > 20) station.CO2.shift();
        if (station.CO.length > 20) station.CO.shift();
        if (station.NH4.length > 20) station.NH4.shift();
        if (station.Acetona.length > 20) station.Acetona.shift();
        if (station.times.length > 20) station.times.shift();

        // Kiểm tra và cập nhật trạng thái thông báo
        ["CO2", "CO", "NH4", "Acetona"].forEach((gas) => {
            const ppm = parseFloat(newData[gas]);
            const status =
                ppm >= thresholds[gas].danger
                    ? "Danger"
                    : ppm >= thresholds[gas].warning
                    ? "Warning"
                    : "Normal";

            // Nếu là Warning hoặc Danger, thêm vào thông báo
            if (status === "Warning" || status === "Danger") {
                notifications.push({
                    station: stationName,
                    gas: gas,
                    ppm: ppm,
                    status: status,
                    time: newData.time
                });
            }
        });
    });
}

// Hàm trả về danh sách thông báo
function getNotifications() {
    return notifications;
}

// Hàm để lấy dữ liệu của một trạm đo
function getStationData(stationName) {
    return stationData[stationName];
}

// Cập nhật dữ liệu mỗi 30 giây
setInterval(updateData, 30000); // 30000 ms = 30s

export { getStationData, updateData, getNotifications };