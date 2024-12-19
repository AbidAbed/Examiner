

// delete pop up window
// Get modal and button elements
const deleteBtn = document.getElementById('deleteBtn');
const confirmationModal = document.getElementById('confirmationModal');
const closeModal = document.getElementById('closeModal');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');

// When the "Delete exam" button is clicked, show the confirmation modal
deleteBtn.addEventListener('click', function() {
    confirmationModal.style.display = 'flex'; // Show the modal
});

// Close the modal when the close button (X) is clicked
closeModal.addEventListener('click', function() {
    confirmationModal.style.display = 'none'; // Hide the modal
});

// Close the modal when "Cancel" is clicked
cancelDelete.addEventListener('click', function() {
    confirmationModal.style.display = 'none'; // Hide the modal
});


