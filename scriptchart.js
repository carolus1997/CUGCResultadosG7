document.addEventListener('DOMContentLoaded', function () {
    const initialData = [0, 0, 0, 0];
    const labels = ["Comunicación", "Situación", "Decisión", "Mando y Control"];
    drawRadarChart(initialData, labels);
});

function drawRadarChart(data, labels) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    window.myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: '% de idoneidad',
                data: data,
                fill: true,
                backgroundColor: "rgba(151,187,205,0.2)",
                borderColor: "rgba(151,187,205,1)",
                pointBackgroundColor: "rgba(151,187,205,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(151,187,205,1)"
            }]
        },
        options: {
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    angleLines: { display: false },
                    ticks: { beginAtZero: true, maxTicksLimit: 5 }
                }
            },
            elements: { line: { borderWidth: 3 } }
        }
    });
}


function showChart() {
    document.getElementById('resultsSection');
    const data = [65, 59, 80, 81]; // Datos de ejemplo
    const labels = ['Mando y Control', 'Situación', 'Decisión', 'Comunicación'];
    drawRadarChart(data, labels);
}



function updateChartWithRealData() {
    // Datos reales para el gráfico de radar
    const realData = [
        calculateScore("Comunicacion"),
        calculateScore("Situacion"),
        calculateScore("Decision"),
        calculateScore("Mando")
    ];
    window.myRadarChart.data.datasets[0].data = realData;
    window.myRadarChart.update();
}

function calculateScore(category) {
    const correctAnswers = {
        "Mando": ["Puesto de Mando Interministerial (PIM), dirigido por el subprefecto de Bayona y Centro de Seguimiento Policial del Gobierno Vasco"],
        "Situacion": ["Redes sociales y medios de comunicación", "SAMUR", "Primeras patrullas que intervienen."],
        "Decision": ["Activación Plan Antiterrorista de la Cumbre", "Cierre de Frontera España-Francia", "Activación de controles GAR en España"],
        "Comunicacion": ["Comunicación institucional Fiscal Jefe de Bayona", "Comunicación Plan Antiterrorista activado y solicitud de colaboración ciudadana", "Comunicación institucional dando punto de contacto para familiares de víctimas"]
    };

    const selectedAnswers = selectedAnswersByCategory[category] || [];
    const correctCount = selectedAnswers.filter(answer => correctAnswers[category].includes(answer)).length;
    return (correctCount / correctAnswers[category].length) * 100;
}

function calculateTotalSuitability() {
    const categories = ["Mando", "Situacion", "Decision", "Comunicacion"];
    let totalScore = 0;

    categories.forEach(category => {
        totalScore += calculateScore(category);
    });

    return totalScore / categories.length;
}

let selectedAnswersByCategory = {};

function updateChart(formId, selectedAnswers) {
    const correctAnswers = {
        'examForm1': ["Puesto de Mando Interministerial (PIM), dirigido por el subprefecto de Bayona y Centro de Seguimiento Policial del Gobierno Vasco"],
        'examForm2': ["Redes sociales y medios de comunicación", "SAMUR", "Primeras patrullas que intervienen."],
        'examForm3': ["Activación Plan Antiterrorista de la Cumbre", "Cierre de Frontera España-Francia", "Activación de controles GAR en España"],
        'examForm4': ["Comunicación institucional Fiscal Jefe de Bayona", "Comunicación Plan Antiterrorista activado y solicitud de colaboración ciudadana", "Comunicación institucional dando punto de contacto para familiares de víctimas"]
    };

    const categoryMap = {
        "examForm1": "Mando",
        "examForm2": "Situacion",
        "examForm3": "Decision",
        "examForm4": "Comunicacion"
    };
    const categoryIndex = {
        "examForm1": 3,
        "examForm2": 1,
        "examForm3": 2,
        "examForm4": 0
    };

    const correctCount = selectedAnswers.filter(answer => correctAnswers[formId].includes(answer)).length;
    const score = (correctCount / correctAnswers[formId].length) * 100;

    const index = categoryIndex[formId];
    window.myRadarChart.data.datasets[0].data[index] = score;
    window.myRadarChart.update();

    const category = categoryMap[formId];
    selectedAnswersByCategory[category] = selectedAnswers;

    document.getElementById(`score${category}`).textContent = `${score.toFixed(2)}%`;

    const totalScore = window.myRadarChart.data.datasets[0].data.reduce((a, b) => a + b);
    const percentageSuitability = (totalScore / 4).toFixed(2);  // Ajustado para 4 categorías
    document.getElementById('averagePercentage').textContent = `${percentageSuitability}%`;
}

function handleFormSubmit(event) {
    event.preventDefault();
    const formId = event.target.id;
    const selectedAnswers = Array.from(event.target.querySelectorAll('input:checked')).map(input => input.value);
    
    // Guardar las respuestas seleccionadas
    saveSelectedAnswers(formId, selectedAnswers);
    
    // Mover al siguiente ítem del carrusel
    const carousel = bootstrap.Carousel.getInstance(document.querySelector('#formCarousel'));
    carousel.next();
}


document.getElementById('examForm1').addEventListener('submit', handleFormSubmit);
document.getElementById('examForm2').addEventListener('submit', handleFormSubmit);
document.getElementById('examForm3').addEventListener('submit', handleFormSubmit);
document.getElementById('examForm4').addEventListener('submit', handleFormSubmit);

let selectedAnswersByForm = {};

function saveSelectedAnswers(formId, selectedAnswers) {
    selectedAnswersByForm[formId] = selectedAnswers;
}



