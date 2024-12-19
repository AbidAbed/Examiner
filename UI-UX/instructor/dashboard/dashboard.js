document.querySelectorAll('.show-details').forEach(button => {
    button.addEventListener('click', function() {
        const exam = this.dataset.exam; // Get exam type (e.g., python, algorithms)
        openDrawer(exam);
    });
});


document.getElementById('closePopup').onclick = function() {
    closeDrawer();
    };
    function closeDrawer() {
        const drawer = document.getElementById('drawer');
        drawer.classList.remove('open');
    }
    
    
    

function openDrawer(exam) {
    const drawer = document.getElementById('drawer');
    drawer.classList.add('open');
    
    // Disable form fields
    const form = document.getElementById('examForm');
    const formElements = form.querySelectorAll('input, textarea, select');
    formElements.forEach(element => element.disabled = true);

    // Optionally, fill the form with exam details based on `exam` if you want to pre-fill it
    // Example: if (exam === 'python') { document.getElementById('examName').value = 'Python Programming'; }
}

