const waterInput = document.getElementById('water-input');
const addButton = document.getElementById('add-button');
const totalWater = document.getElementById('total-water');
const resetButton = document.getElementById('reset-button');
const searchButton = document.getElementById('search-button');

const STORAGE_KEY = 'waterIntakeData';
let waterIntakeData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let myChart = null;

addButton.addEventListener('click', addToWaterIntake);
resetButton.addEventListener('click', resetResults);
searchButton.addEventListener('click', function () {
    const date = prompt('Enter the date (YYYY-MM-DD):');

    if (!date) {
        return;
    }

    const waterIntakeForDate = waterIntakeData.filter(entry => entry.timestamp === date);

    if (waterIntakeForDate.length === 0) {
        alert(`No water intake found for date ${date}`);
    } else {
        const totalWaterIntake = waterIntakeForDate.reduce((total, entry) => {
            total += entry.amount;
            return total;
        }, 0);

        alert(`Total water intake for ${date}: ${totalWaterIntake}ml`);
    }
});


function addToWaterIntake() {
    const waterAmountMilliliters = parseFloat(waterInput.value);
    if (isNaN(waterAmountMilliliters) || waterAmountMilliliters <= 0) {
        return;
    }

    const currentTimestamp = moment().format();

    const waterIntakeEntry = {
        timestamp: currentTimestamp,
        amount: waterAmountMilliliters
    };

    waterIntakeData.push(waterIntakeEntry);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(waterIntakeData));

    updateTotalWater();
    updateChart();

    waterInput.value = '';
}

function resetResults() {
    waterIntakeData = [];
    localStorage.removeItem(STORAGE_KEY);
    updateTotalWater();
    destroyChart();
    updateChart();
}

function updateTotalWater() {
    const totalAmount = waterIntakeData.reduce((total, entry) => {
        total += entry.amount;
        return total;
    }, 0);

    totalWater.textContent = `Total Water Intake: ${totalAmount}ml`;
}

function destroyChart() {
    if (myChart) {
        myChart.destroy();
    }
}

function updateChart() {
    destroyChart();

    const labels = waterIntakeData.map(entry => entry.timestamp);
    const data = waterIntakeData.map(entry => entry.amount);

    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Water Intake',
                data: data,
                backgroundColor: ['red', 'blue', 'green', 'yellow', 'purple'],
                borderColor: 'black',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


updateTotalWater();
updateChart();
