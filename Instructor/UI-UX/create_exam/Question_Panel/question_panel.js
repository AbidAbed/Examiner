// Show popup when New Question button is clicked
document.getElementById('newQuestionButton').onclick = function() {
    document.getElementById('questionPopup').style.display = 'flex';
};

// Close popup when the close button is clicked
document.getElementById('closePopup').onclick = function() {
    document.getElementById('questionPopup').style.display = 'none';
};

// Close popup and clear fields when Save Question button is clicked
document.getElementById('saveQuestionButton').onclick = function(event) {
    event.preventDefault(); // Prevent form submission for testing
    document.getElementById('questionPopup').style.display = 'none';
};

// Show fields based on question type selection
function showQuestionFields() {
    const selectedType = document.getElementById('questionType').value;
    const fields = document.querySelectorAll('.question-fields');

    // Hide all fields first
    fields.forEach(field => field.style.display = 'none');

    // Show save button
    document.getElementById('saveQuestionButton').style.display = 'block';

    // Display selected question type fields
    if (selectedType) {
        document.getElementById(selectedType + 'Fields').style.display = 'block';
    }
}

// Page designer logic
let currentPage = 1;

function switchPage(pageNumber) {
    const pageList = document.querySelector('.page_list');
    const tabs = pageList.querySelectorAll('.page-tab:not(.new-page):not(.delete-page)');

    // If no pages exist, return early
    if (tabs.length === 0) return;

    // Deselect all tabs
    tabs.forEach(tab => tab.classList.remove('active'));

    // Set the selected tab as active
    const selectedTab = pageList.querySelector(`.page-tab[data-page-number="${pageNumber}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Update current page
    currentPage = pageNumber;
    console.log(`Switched to Page ${pageNumber}`);
}

function addNewPage() {
    const pageList = document.querySelector('.page_list');
    const newPageNumber = pageList.children.length - 1; // Adjust for the delete button

    // Create a new button for the new page
    const newPageTab = document.createElement('button');
    newPageTab.className = 'page-tab';
    newPageTab.textContent = `Page ${newPageNumber}`;
    newPageTab.dataset.pageNumber = newPageNumber; // Add data attribute to keep track of page numbers
    newPageTab.onclick = () => switchPage(newPageNumber);

    // Insert the new tab before the "New Page" and "Delete Page" buttons
    const newPageButton = document.querySelector('.new-page');
    pageList.insertBefore(newPageTab, newPageButton);

    // Switch to the newly created page
    switchPage(newPageNumber);
}

// Move to previous or next page
function movePage(direction) {
    const pageList = document.querySelector('.page_list');
    const tabs = pageList.querySelectorAll('.page-tab:not(.new-page):not(.delete-page)');

    if (tabs.length > 0) {
        let targetPage = direction === 'prev' ? currentPage - 1 : currentPage + 1;

        // Ensure valid page number (1 to total pages)
        if (targetPage >= 1 && targetPage <= tabs.length) {
            switchPage(targetPage);
        }
    }
}

// Initialize the page tabs to be clickable
function initializeTabs() {
    const pageTabs = document.querySelectorAll('.page-tab:not(.new-page):not(.delete-page)');
    pageTabs.forEach((tab, index) => {
        tab.dataset.pageNumber = index + 1;
        tab.onclick = () => switchPage(index + 1);
    });
    switchPage(1); // Set the first tab as the active one
}

// Run the initialization
initializeTabs();

// Manage the confirmation messages for delete pages
document.addEventListener('DOMContentLoaded', function () {
    // Modal for deleting pages
    const deletePageButton = document.querySelector('.delete-page');
    const deletePageModal = document.getElementById('confirmationModal');
    const closePageModal = document.getElementById('closeModal');
    const confirmDeletePage = document.getElementById('confirmDelete');
    const cancelDeletePage = document.getElementById('cancelDelete');

    // Function to close any modal
    function closeModal(modal) {
        modal.style.display = 'none';
    }

    // Function to show any modal
    function showModal(modal) {
        modal.style.display = 'flex';
    }

    // Handle page delete button click to show the modal
    deletePageButton.addEventListener('click', function () {
        showModal(deletePageModal); // Show the page delete modal
    });

    // Close page delete modal (on confirm, cancel, or close)
    confirmDeletePage.addEventListener('click', function () {
        closeModal(deletePageModal); // Close the modal after confirming delete
    });
    cancelDeletePage.addEventListener('click', function () {
        closeModal(deletePageModal); // Close the modal after canceling delete
    });
    closePageModal.addEventListener('click', function () {
        closeModal(deletePageModal); // Close the modal when clicking the close button
    });

    // Close modals if user clicks outside of the modal content
    window.addEventListener('click', function (event) {
        if (event.target === deletePageModal) {
            closeModal(deletePageModal); // Close page modal if clicked outside
        }
    });
});


/////////////////////////////////////////////edit question button
   // Function to show the popup for editing the question
   function showPopup(id) {
    document.getElementById('popup-' + id).style.display = 'flex';  
}

// Function to close the popup
function closePopup(id) {
    document.getElementById('popup-' + id).style.display = 'none';
    
}

// Function to save the edited question (placeholder)
function saveQuestion(id) {
    // Save logic here
    closePopup(id);
}


/////////////////////////////////////////////edit question button