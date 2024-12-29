// Sign out 

document.getElementById("userLink").addEventListener("click", function(event) {
    event.stopPropagation(); // Prevent the click event from propagating to the document
    const dropdown = document.getElementById("dropdownMenu");
    dropdown.classList.toggle("show"); // Toggle the dropdown visibility
});

// Close dropdown if clicked outside of the user info or dropdown
document.addEventListener("click", function(event) {
    const dropdown = document.getElementById("dropdownMenu");
    const userLink = document.getElementById("userLink");
    
    if (!userLink.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove("show"); // Close dropdown when clicking outside
    }
});

// success massage

// pop ups


 // Get elements
 const openPopup = document.getElementById('openPopup');
 const closePopup = document.getElementById('closePopup');
 const popupOverlay = document.getElementById('popupOverlay');
 const finish_all = document.getElementById('confirm_exam');

 // Show popup
 openPopup.addEventListener('click', () => {
     popupOverlay.classList.add('active');
 });

 // Close popup
 closePopup.addEventListener('click', () => {
     popupOverlay.classList.remove('active');
 });
 
 // Close popup when clicking Cancel button
cancelButton.addEventListener('click', () => {
    popupOverlay.classList.remove('active');
});

 // Close popup when clicking outside the window
 popupOverlay.addEventListener('click', (e) => {
     if (e.target === popupOverlay) {
         popupOverlay.classList.remove('active');
     }
 });

 //finishing the exam 
 finish_all.addEventListener('click', () => {
    popupOverlay.classList.remove('active');
});

