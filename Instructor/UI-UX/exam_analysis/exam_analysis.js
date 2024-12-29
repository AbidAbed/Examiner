  ///////////////////////////////////////charts
  // Data for Exam Score Chart
  var examScoreData = {
    labels: ['Math Exam', 'History Exam', 'Science Exam'], // Exam names
    datasets: [{
        label: 'Average Score',
        data: [80, 75, 85], // Average scores for each exam
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
    }]
};

// Data for Score Distribution Chart
var scoreDistributionData = {
    labels: ['90-100%', '80-89%', '70-79%', '60-69%', 'Below 60%'],
    datasets: [{
        label: 'Score Distribution',
        data: [30, 25, 20, 15, 10], // Percentage of students in each score range
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1
    }]
};

// Exam Score Chart (Bar Chart)
var ctx1 = document.getElementById('examScoreChart').getContext('2d');
new Chart(ctx1, {
    type: 'bar',
    data: examScoreData,
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});

// Score Distribution Chart (Pie Chart)
var ctx2 = document.getElementById('scoreDistributionChart').getContext('2d');
new Chart(ctx2, {
    type: 'pie',
    data: scoreDistributionData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.label + ': ' + tooltipItem.raw + '%';
                    }
                }
            }
        }
    }
});
/////////////////////////////////////////////charts
/////////////////////////////////////////////active item
document.addEventListener('DOMContentLoaded', function() {
    const listItems = document.querySelectorAll('ul a li');
    
    // Function to handle adding/removing active class
    function setActiveClass(event) {
        // Remove the active class from all list items
        listItems.forEach(item => item.classList.remove('active'));
        
        // Add the active class to the clicked item
        event.target.classList.add('active');
    }
    
    // Attach the click event listener to each list item
    listItems.forEach(item => {
        item.addEventListener('click', setActiveClass);
    });

    // Check the URL hash and add the active class to the correct list item
    window.addEventListener('hashchange', function() {
        const currentSection = window.location.hash;
        listItems.forEach(item => {
            if (item.querySelector('a').getAttribute('href') === currentSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });

    // Set active class on the currently active section when the page loads
    const initialSection = window.location.hash || '#globalOverview';
    document.querySelector(`ul a[href="${initialSection}"] li`).classList.add('active');
});



/////////////////////////////////////////////active item