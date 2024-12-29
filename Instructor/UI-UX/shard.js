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

