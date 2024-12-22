import updateConcentrations from './real_time.js';
// import { getStationData  } from './data.js';
import { addUpdateListener, getStationData } from './data_2.js';
import { currentStation } from './maps.js';

let dataCO2 = [];
let dataCO = [];
let dataNH4 = [];
let dataPM25 = [];
let labels = [];

function updateChartsForStation(stationName) {
    const station = getStationData(stationName);

    // Cập nhật dữ liệu cho các khí
    dataCO2 = station.CO2;
    dataCO = station.CO;
    dataNH4 = station.NH4;
    dataPM25 = station.PM25;
    labels = station.times;

    // Giới hạn labels và dữ liệu ở 20 phần tử (giữ không vượt quá 20 giá trị)
    if (labels.length > 20) labels.shift();
    if (dataCO2.length > 20) dataCO2.shift();
    if (dataCO.length > 20) dataCO.shift();
    if (dataNH4.length > 20) dataNH4.shift();
    if (dataPM25.length > 20) dataPM25.shift();

    // Cập nhật thông số và biểu đồ
    chartCO2.data.datasets[0].data = dataCO2;
    chartCO.data.datasets[0].data = dataCO;
    chartNH4.data.datasets[0].data = dataNH4;
    chartPM25.data.datasets[0].data = dataPM25;

    // Cập nhật labels cho biểu đồ
    chartCO2.data.labels = labels;
    chartCO.data.labels = labels;
    chartNH4.data.labels = labels;
    chartPM25.data.labels = labels;

    document.querySelector('.concentration_CO2').textContent = `${dataCO2[dataCO2.length - 1]} ppm`;
    document.querySelector('.concentration_CO').textContent = `${dataCO[dataCO.length - 1]} ppm`;
    document.querySelector('.concentration_NH4').textContent = `${dataNH4[dataNH4.length - 1]} ppm`;
    document.querySelector('.concentration_PM25').textContent = `${dataPM25[dataPM25.length - 1]} ppm`;

    // Cập nhật các biểu đồ
    chartCO2.update();
    chartCO.update();
    chartNH4.update();
    chartPM25.update();

    // Update concentrations and statuses (box real-time data)
    updateConcentrations(dataCO2[dataCO2.length - 1], 'CO2');
    updateConcentrations(dataCO[dataCO.length - 1], 'CO');
    updateConcentrations(dataNH4[dataNH4.length - 1], 'NH4');
    updateConcentrations(dataPM25[dataPM25.length - 1], 'PM25');
}

// Lắng nghe sự kiện cập nhật dữ liệu từ `data.js`
addUpdateListener(() => {
    updateChartsForStation(currentStation); // Cập nhật biểu đồ khi dữ liệu thay đổi
});

// Chart options to set y-axis range and tooltips
const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        tooltip: {
            enabled: true,
            mode: 'nearest',
            intersect: false,

            custom: function(tooltipModel) {
                // Lấy đối tượng tooltip
                var tooltipEl = document.getElementById('chartjs-tooltip');
                
                // Nếu tooltip không tồn tại, tạo mới
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'chartjs-tooltip';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.pointerEvents = 'none';
                    tooltipEl.style.zIndex = '10';
                    document.body.appendChild(tooltipEl);
                }
    
                // Nếu tooltip không có dữ liệu, ẩn nó đi
                if (!tooltipModel.opacity) {
                    tooltipEl.style.opacity = 0;
                    return;
                }
    
                // Xác định vị trí của tooltip
                tooltipEl.style.opacity = 1;
                tooltipEl.style.left = tooltipModel.caretX + 'px';
                tooltipEl.style.top = tooltipModel.caretY + 'px';
    
                // Tạo HTML cho tooltip
                var innerHtml = `
                    <div class="tooltip-ppm">ppm: ${tooltipModel.dataPoints[0].raw}</div>
                    <div class="tooltip-time">Time: ${tooltipModel.dataPoints[0].label}</div>
                `;
    
                // Đưa HTML vào trong tooltip
                tooltipEl.innerHTML = innerHtml;
            }
        }
    },
    scales: {
        y: {
            min: 0,
            max: 4,
            ticks: {
                stepSize: 1,
            }
        },
        x: {
            ticks: {
                autoSkip: true,
                maxTicksLimit: 20,
                font: {
                    size: 10
                }
            }
        }
    }
};

const options_CO2 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        tooltip: {
            enabled: true,
            mode: 'nearest',
            intersect: false,

            custom: function(tooltipModel) {
                // Lấy đối tượng tooltip
                var tooltipEl = document.getElementById('chartjs-tooltip');
                
                // Nếu tooltip không tồn tại, tạo mới
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'chartjs-tooltip';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.pointerEvents = 'none';
                    tooltipEl.style.zIndex = '10';
                    document.body.appendChild(tooltipEl);
                }
    
                // Nếu tooltip không có dữ liệu, ẩn nó đi
                if (!tooltipModel.opacity) {
                    tooltipEl.style.opacity = 0;
                    return;
                }
    
                // Xác định vị trí của tooltip
                tooltipEl.style.opacity = 1;
                tooltipEl.style.left = tooltipModel.caretX + 'px';
                tooltipEl.style.top = tooltipModel.caretY + 'px';
    
                // Tạo HTML cho tooltip
                var innerHtml = `
                    <div class="tooltip-ppm">ppm: ${tooltipModel.dataPoints[0].raw}</div>
                    <div class="tooltip-time">Time: ${tooltipModel.dataPoints[0].label}</div>
                `;
    
                // Đưa HTML vào trong tooltip
                tooltipEl.innerHTML = innerHtml;
            }
        }
    },
    scales: {
        y: {
            min: 300,
            max: 800,
            ticks: {
                stepSize: 20,
            }
        },
        x: {
            ticks: {
                autoSkip: true,
                maxTicksLimit: 20,
                font: {
                    size: 10
                }
            }
        }
    }
};

const options_CO = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        tooltip: {
            enabled: true,
            mode: 'nearest',
            intersect: false,

            custom: function(tooltipModel) {
                // Lấy đối tượng tooltip
                var tooltipEl = document.getElementById('chartjs-tooltip');
                
                // Nếu tooltip không tồn tại, tạo mới
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'chartjs-tooltip';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.pointerEvents = 'none';
                    tooltipEl.style.zIndex = '10';
                    document.body.appendChild(tooltipEl);
                }
    
                // Nếu tooltip không có dữ liệu, ẩn nó đi
                if (!tooltipModel.opacity) {
                    tooltipEl.style.opacity = 0;
                    return;
                }
    
                // Xác định vị trí của tooltip
                tooltipEl.style.opacity = 1;
                tooltipEl.style.left = tooltipModel.caretX + 'px';
                tooltipEl.style.top = tooltipModel.caretY + 'px';
    
                // Tạo HTML cho tooltip
                var innerHtml = `
                    <div class="tooltip-ppm">ppm: ${tooltipModel.dataPoints[0].raw}</div>
                    <div class="tooltip-time">Time: ${tooltipModel.dataPoints[0].label}</div>
                `;
    
                // Đưa HTML vào trong tooltip
                tooltipEl.innerHTML = innerHtml;
            }
        }
    },
    scales: {
        y: {
            min: 0,
            max: 15,
            ticks: {
                stepSize: 1,
            }
        },
        x: {
            ticks: {
                autoSkip: true,
                maxTicksLimit: 20,
                font: {
                    size: 10
                }
            }
        }
    }
};

const options_NH4 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        tooltip: {
            enabled: true,
            mode: 'nearest',
            intersect: false,

            custom: function(tooltipModel) {
                // Lấy đối tượng tooltip
                var tooltipEl = document.getElementById('chartjs-tooltip');
                
                // Nếu tooltip không tồn tại, tạo mới
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'chartjs-tooltip';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.pointerEvents = 'none';
                    tooltipEl.style.zIndex = '10';
                    document.body.appendChild(tooltipEl);
                }
    
                // Nếu tooltip không có dữ liệu, ẩn nó đi
                if (!tooltipModel.opacity) {
                    tooltipEl.style.opacity = 0;
                    return;
                }
    
                // Xác định vị trí của tooltip
                tooltipEl.style.opacity = 1;
                tooltipEl.style.left = tooltipModel.caretX + 'px';
                tooltipEl.style.top = tooltipModel.caretY + 'px';
    
                // Tạo HTML cho tooltip
                var innerHtml = `
                    <div class="tooltip-ppm">ppm: ${tooltipModel.dataPoints[0].raw}</div>
                    <div class="tooltip-time">Time: ${tooltipModel.dataPoints[0].label}</div>
                `;
    
                // Đưa HTML vào trong tooltip
                tooltipEl.innerHTML = innerHtml;
            }
        }
    },
    scales: {
        y: {
            min: 0,
            max: 0.5,
            ticks: {
                stepSize: 0.01,
            }
        },
        x: {
            ticks: {
                autoSkip: true,
                maxTicksLimit: 20,
                font: {
                    size: 10
                }
            }
        }
    }
};

const options_PM25 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        tooltip: {
            enabled: true,
            mode: 'nearest',
            intersect: false,

            custom: function(tooltipModel) {
                // Lấy đối tượng tooltip
                var tooltipEl = document.getElementById('chartjs-tooltip');
                
                // Nếu tooltip không tồn tại, tạo mới
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'chartjs-tooltip';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.pointerEvents = 'none';
                    tooltipEl.style.zIndex = '10';
                    document.body.appendChild(tooltipEl);
                }
    
                // Nếu tooltip không có dữ liệu, ẩn nó đi
                if (!tooltipModel.opacity) {
                    tooltipEl.style.opacity = 0;
                    return;
                }
    
                // Xác định vị trí của tooltip
                tooltipEl.style.opacity = 1;
                tooltipEl.style.left = tooltipModel.caretX + 'px';
                tooltipEl.style.top = tooltipModel.caretY + 'px';
    
                // Tạo HTML cho tooltip
                var innerHtml = `
                    <div class="tooltip-ppm">ppm: ${tooltipModel.dataPoints[0].raw}</div>
                    <div class="tooltip-time">Time: ${tooltipModel.dataPoints[0].label}</div>
                `;
    
                // Đưa HTML vào trong tooltip
                tooltipEl.innerHTML = innerHtml;
            }
        }
    },
    scales: {
        y: {
            min: 0,
            max: 150,
            ticks: {
                stepSize: 10,
            }
        },
        x: {
            ticks: {
                autoSkip: true,
                maxTicksLimit: 20,
                font: {
                    size: 10
                }
            }
        }
    }
};

// Create the charts
const ctxCO2 = document.getElementById('chartCO2').getContext('2d');
const ctxCO = document.getElementById('chartCO').getContext('2d');
const ctxNH4 = document.getElementById('chartNH4').getContext('2d');
const ctxPM25 = document.getElementById('chartPM25').getContext('2d');

export const chartCO2 = new Chart(ctxCO2, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'CO2 (ppm)',
            data: dataCO2,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
        }]
    },
    options: options_CO2
});

export const chartCO = new Chart(ctxCO, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'CO (ppm)',
            data: dataCO,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
        }]
    },
    options: options_CO
});

export const chartNH4 = new Chart(ctxNH4, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'NH4 (ppm)',
            data: dataNH4,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
        }]
    },
    options: options_NH4
});

export const chartPM25 = new Chart(ctxPM25, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'PM25 (ppm)',
            data: dataPM25,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            fill: true,
        }]
    },
    options: options_PM25
});

// Cập nhật biểu đồ cho trạm mỗi 60s
// let currentStation = "Hà Nội";
// console.log(currentStation);

updateChartsForStation(currentStation);

setInterval(() => {
    updateChartsForStation(currentStation);
}, 30000);
export { updateChartsForStation };
