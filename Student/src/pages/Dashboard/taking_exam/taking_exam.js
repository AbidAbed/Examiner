
// Popup management
const openPopup = document.getElementById('openPopup');
const closePopup = document.getElementById('closePopup');
const popupOverlay = document.getElementById('popupOverlay');
const cancelButton = document.getElementById('cancelButton');
const finish_all = document.getElementById('confirm_exam');

// Show popup
openPopup.addEventListener('click', () => {
    popupOverlay.classList.add('active');
});

// Close popup
closePopup.addEventListener('click', () => {
    popupOverlay.classList.remove('active');
});

// Close popup when Cancel is clicked
cancelButton.addEventListener('click', () => {
    popupOverlay.classList.remove('active');
});

// Close popup when clicking outside
popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
        popupOverlay.classList.remove('active');
    }
});

// Finish the exam (optional submission)
finish_all.addEventListener('click', () => {
    popupOverlay.classList.remove('active');
   
});

// Second set of popups (if needed)
const openPopup2 = document.getElementById('confirm_exam');
const popupOverlay2 = document.getElementById('popupOverlay1');
const cancelButton2 = document.getElementById('cancelButton1');

// Show second popup
openPopup2.addEventListener('click', () => {
    popupOverlay2.classList.add('active');
});



// Close second popup when Cancel is clicked
cancelButton2.addEventListener('click', () => {
    popupOverlay2.classList.remove('active');
});

// // Close second popup when clicking outside
// popupOverlay2.addEventListener('click', (e) => {
//     if (e.target === popupOverlay2) {
//         popupOverlay2.classList.remove('active');
//     }
// });




// Show the second popup when clicking the "Leave A Comment" button


const openPopup3 = document.getElementById('leaveComment');
const popupOverlay3 = document.getElementById('popupOverlay2');

openPopup3.addEventListener('click', () => {
    popupOverlay2.classList.remove('active');
});

openPopup3.addEventListener('click', () => {
    popupOverlay3.classList.add('active');
});

// user info

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