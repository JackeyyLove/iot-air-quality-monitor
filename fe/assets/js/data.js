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

// Hàm để cập nhật dữ liệu mỗi 30 giây
function updateData() {
    // Duyệt qua tất cả các trạm và cập nhật mỗi 30s
    Object.keys(stationData).forEach(function(stationName) {
        const station = stationData[stationName];

        // Thêm giá trị mới vào mỗi mảng con (tạo giá trị ngẫu nhiên từ 0 đến 4)
        station.CO2.push((Math.random() * 4).toFixed(2));
        station.CO.push((Math.random() * 4).toFixed(2));
        station.NH4.push((Math.random() * 4).toFixed(2));
        station.Acetona.push((Math.random() * 4).toFixed(2));

        // Lưu thời gian lúc dữ liệu được thêm vào
        const timeNow = new Date().toLocaleTimeString();
        station.times.push(timeNow);

        // Giới hạn dữ liệu không vượt quá 20 giá trị
        if (station.CO2.length > 20) station.CO2.shift();
        if (station.CO.length > 20) station.CO.shift();
        if (station.NH4.length > 20) station.NH4.shift();
        if (station.Acetona.length > 20) station.Acetona.shift();
        if (station.times.length > 20) station.times.shift();
    });
}

// Hàm để lấy dữ liệu của một trạm đo
function getStationData(stationName) {
    return stationData[stationName];
}

// Cập nhật dữ liệu mỗi 30 giây
setInterval(updateData, 30000); // 30000 ms = 30s

export { getStationData, updateData };