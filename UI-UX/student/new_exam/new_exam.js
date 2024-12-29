function openCreateRoomPopup() {
    document.getElementById('createRoomPopup').style.display = 'flex'; 
}

function closeCreateRoomPopup() {
    document.getElementById('createRoomPopup').style.display = 'none'; 
}

// copy to clipboard
document.getElementById("copyButton").addEventListener("click", function () {
    // Define the text to copy
    const textToCopy = "ID OF THE ROOM ";

    // Copy text to clipboard
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("Copied to clipboard: " + textToCopy);
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
});
