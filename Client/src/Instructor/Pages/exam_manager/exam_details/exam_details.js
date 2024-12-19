////////////////////////////////////////////////////////// tables moving

window.addEventListener('DOMContentLoaded', (event) => {
    // Set the first tab and its content to be active by default
    const firstTab = document.querySelector('.tab-link');
    const firstTabContent = document.querySelector('.tab-pane');
    
    if (firstTab && firstTabContent) {
        firstTab.classList.add('active'); // Activates the first tab
        firstTabContent.classList.add('active'); // Activates the first tab content
    }
});

function openTab(evt, tabName) {
    // Get all elements with className="tab-pane" and hide them
    var tabcontent = document.getElementsByClassName("tab-pane");
    for (var i = 0; i < tabcontent.length; i++) {
      tabcontent[i].classList.remove("active");
    }
  
    // Get all elements with className="tab-link" and remove the className "active"
    var tablinks = document.getElementsByClassName("tab-link");
    for (var i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove("active");
    }
  
    // Show the current tab, and add an "active" className to the button
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
  }
  
  // Set the default active tab
  document.addEventListener("DOMContentLoaded", function() {
    openTab(event, 'generalInfo'); // Set 'General Information' tab as default
  });

  
  
////////////////////////////////////////////////////////// tables moving
////////////////////////////////////////////////////////// charts



  var ctx = document.getElementById('passFailChart').getContext('2d');
  var passFailChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Pass', 'Fail'],
      datasets: [{
        data: [150, 50], // Example data for passing and failing
        backgroundColor: ['#4caf50', '#f44336']
      }]
    }
  });


////////////////////////////////////////////////////////// charts

