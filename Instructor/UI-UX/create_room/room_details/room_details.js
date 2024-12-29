// Function to show the selected region and hide others
function showRegion(regionId) {
    // Hide all content regions
    const regions = document.querySelectorAll('.content-region');
    regions.forEach(region => {
        region.style.display = 'none';
    });

    // Show the selected region
    const selectedRegion = document.getElementById(regionId);
    selectedRegion.style.display = 'block';
}

///////////////////////////////////// Room tabs


// Function to switch between tabs
function openTab(event, tabName) {
    // Hide all tab contents
    let tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(function(content) {
        content.classList.remove('active');
    });

    // Remove 'active' class from all tab links
    let tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(function(link) {
        link.classList.remove('active');
    });

    // Show the clicked tab content
    document.getElementById(tabName).classList.add('active');

    // Add 'active' class to the clicked tab link
    event.currentTarget.classList.add('active');
}


/////////////////////////////////////create room
function openCreateRoomPopup() {
    document.getElementById('createRoomPopup').style.display = 'flex'; // Show popup
}

function closeCreateRoomPopup() {
    document.getElementById('createRoomPopup').style.display = 'none'; // Hide popup

}



/////////////////////////////////////// COPY ROOM ID 

function copyRoomId() {
    const roomId = document.getElementById("roomId").textContent; // Get the Room ID text
    navigator.clipboard.writeText(roomId).then(() => {
        const copyMessage = document.getElementById("copyMessage");
        copyMessage.style.display = "inline"; // Show the message
        setTimeout(() => {
            copyMessage.style.display = "none"; // Hide the message after 1 second
        }, 1000);
    }).catch(err => {
        alert("Failed to copy Room ID: " + err);
    });
}
/////////////////////////////////////// COPY ROOM ID 


////////////////////////////////////Add new exam to the room
// Sample data for existing exams
const existingExams = [
    { name: "Biology Exam", date: "2024-11-15" },
    { name: "Physics Exam", date: "2024-12-05" },
    { name: "Chemistry Exam", date: "2024-12-20" },
    { name: "Math Exam", date: "2024-12-01" },
    { name: "History Exam", date: "2024-12-10" }
];

// Open the popup
function openPopup() {
    document.getElementById("searchPopup").style.display = "block";
    populateExams(existingExams); // Show all exams initially
}

// Close the popup
function closePopup() {
    document.getElementById("searchPopup").style.display = "none";
}

// Populate the exam list
function populateExams(exams) {
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = "";

    exams.forEach(exam => {
        const listItem = document.createElement("li");
        listItem.textContent = `${exam.name} (${exam.date})`;
        listItem.classList.add("exam-item");
        listItem.onclick = () => selectExam(exam.name);
        resultsContainer.appendChild(listItem);
    });
}

// Search for exams
function searchExams() {
    const input = document.getElementById("searchExamInput").value.toLowerCase();
    const filteredExams = existingExams.filter(exam =>
        exam.name.toLowerCase().includes(input)
    );
    populateExams(filteredExams);
}

// Handle exam selection
function selectExam(name) {
    alert(`Selected Exam: ${name}`);
}



////////////////////////////////////Add new exam to the room

/////////////////////////////////////create room

///////////////////////////////////// Room tabs