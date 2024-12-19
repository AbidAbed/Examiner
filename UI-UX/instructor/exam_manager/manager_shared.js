////////////////////////////////////////////////////////// page navigation

// Function to handle page navigation in the Custom Review Tab
let customReviewCurrentPage = 1;

function navigateCustomReviewPage(direction) {
  const totalCustomReviewPages = 4;

  // Determine the next page based on direction
  if (direction === 'next') {
    if (customReviewCurrentPage < totalCustomReviewPages) {
      customReviewCurrentPage++;
    }
  } else if (direction === 'previous') {
    if (customReviewCurrentPage > 1) {
      customReviewCurrentPage--;
    }
  }

  // Update active page
  updateCustomReviewPage();
}

// Function to update the active page and content
function updateCustomReviewPage() {
  // Hide all page content
  const allCustomReviewPages = document.querySelectorAll('.custom-review-page-content');
  allCustomReviewPages.forEach(page => page.classList.remove('active'));

  // Show the active page
  const activeCustomReviewPage = document.getElementById('custom-review-page' + customReviewCurrentPage);
  activeCustomReviewPage.classList.add('active');

  // Update tab navigation to reflect active tab
  const allCustomReviewTabs = document.querySelectorAll('.custom-review-tab-link');
  allCustomReviewTabs.forEach(tab => tab.classList.remove('active'));
  const activeCustomReviewTab = document.querySelector('.custom-review-tab-link[data-tab="custom-review-page' + customReviewCurrentPage + '"]');
  activeCustomReviewTab.classList.add('active');
}

// Initialize custom review page navigation
document.addEventListener("DOMContentLoaded", function() {
  updateCustomReviewPage(); // Set initial custom review page
});

// Add event listeners for custom review tab navigation
document.querySelectorAll('.custom-review-tab-link').forEach(tab => {
  tab.addEventListener('click', function() {
    const tabName = tab.getAttribute('data-tab');
    customReviewCurrentPage = parseInt(tabName.replace('custom-review-page', ''));
    updateCustomReviewPage();
  });
});

////////////////////////////////////////////////////////// page navigation
