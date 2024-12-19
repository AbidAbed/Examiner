/////////////////////////////////////////////navigate tabs
function openTab(evt, tabName) {
    // Get all tab contents
    var tabContents = document.querySelectorAll('.tab-pane');
    
    // Hide all tab contents
    tabContents.forEach(function(content) {
      content.classList.remove('active');
    });
    
    // Remove active className from all tabs
    var tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(function(link) {
      link.classList.remove('active');
    });
    
    // Show the clicked tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active className to the clicked tab link
    evt.currentTarget.classList.add('active');
  }
  /////////////////////////////////////////////navigate tabs
  