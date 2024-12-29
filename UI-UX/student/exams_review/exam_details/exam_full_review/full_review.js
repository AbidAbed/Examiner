// Current page tracking
let customReviewCurrentPage = 1;

function navigateCustomReviewPage(direction) {
  const totalCustomReviewPages = 4;

  if (direction === 'next' && customReviewCurrentPage < totalCustomReviewPages) {
    customReviewCurrentPage++;
  } else if (direction === 'previous' && customReviewCurrentPage > 1) {
    customReviewCurrentPage--;
  }

  updateCustomReviewPage();
}

function updateCustomReviewPage() {
  // Hide all pages
  const allPages = document.querySelectorAll('.custom-review-page-content');
  allPages.forEach(page => page.classList.remove('active'));

  // Show the current page
  const currentPage = document.getElementById('custom-review-page' + customReviewCurrentPage);
  currentPage.classList.add('active');

  // Update tab navigation
  const allTabs = document.querySelectorAll('.custom-review-tab-link');
  allTabs.forEach(tab => tab.classList.remove('active'));

  const currentTab = document.querySelector(`[data-tab="custom-review-page${customReviewCurrentPage}"]`);
  currentTab.classList.add('active');
}

// Event listeners for tabs
document.querySelectorAll('.custom-review-tab-link').forEach(tab => {
  tab.addEventListener('click', function () {
    const tabName = this.getAttribute('data-tab');
    customReviewCurrentPage = parseInt(tabName.replace('custom-review-page', ''));
    updateCustomReviewPage();
  });
});

// Initialize page on load
document.addEventListener('DOMContentLoaded', () => {
  updateCustomReviewPage();
});
