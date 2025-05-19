// Add event listener for the login form submission
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get input values
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // Check credentials
    if (username === "vp466881@gmail.com" && password === "vicky") {
        // Redirect to the patient search page
        window.location.href = "pt_search.html"; // Replace with the actual path to your patient search HTML file
    } else {
        alert("Invalid login credentials. Please try again.");
    }
});

// Fetch demo patient data for testing
async function fetchDemoPatients() {
    // Sample demo patient data
    const demoPatients = [
        {
            "patient_name": "John Doe",
            "sub_id": "v8866370536",
            "dob": "2005-03-15" // Use the format YYYY-MM-DD for consistency
        },
        {
            "patient_name": "Jane Smith",
            "sub_id": "SUB654321",
            "dob": "1990-10-20"
        },
        {
            "patient_name": "Alice Johnson",
            "sub_id": "SUB111222",
            "dob": "1975-03-30"
        },
        {
            "patient_name": "Bob Brown",
            "sub_id": "SUB333444",
            "dob": "1980-12-12"
        }
    ];

    // Display the demo patients
    displayResults(demoPatients);
}

// Call the function to fetch demo data when the page loads
window.onload = fetchDemoPatients;

// Add event listener for the patient search form submission
document.getElementById("patientSearchForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get input values
    const subId = document.getElementById("subId").value.trim();
    const dob = document.getElementById("dob").value;

    // Validate inputs
    if (!subId || !dob) {
        alert("Please fill in all required fields.");
        return;
    }

    // Prepare query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("sub_id", subId);
    queryParams.append("dob", dob);

    // Show loading indicator
    document.getElementById("loading").classList.remove("hidden");

    try {
        // Fetch patient data from the server
        const response = await fetch(`/get_patient?${queryParams.toString()}`);
        const data = await response.json();

        // Hide loading indicator
        document.getElementById("loading").classList.add("hidden");

        // Check if the response is OK
        if (response.ok) {
            // Redirect to ev.html with patient details
            const patient = data[0]; // Assuming you want to show the first patient found
            const patientDetailsUrl = `ev.html?name=${encodeURIComponent(patient.patient_name)}&sub_id=${encodeURIComponent(patient.sub_id)}&dob=${encodeURIComponent(patient.dob)}`;
            window.location.href = patientDetailsUrl; // Redirect to the new page
        } else {
            document.getElementById("searchResults").innerHTML = `<p>No patient found.</p>`;
            document.querySelector('.results-section').style.display = 'none'; // Hide results section
        }
    } catch (error) {
        console.error("Error fetching patient:", error);
        document.getElementById("loading").classList.add("hidden");
        document.getElementById("searchResults").innerHTML = `<p>Error fetching patient data. Please try again later.</p>`;
        document.querySelector('.results-section').style.display = 'none'; // Hide results section
    }
});

// Function to display patient results
function displayResults(patients) {
    const resultsDiv = document.getElementById("searchResults");
    resultsDiv.innerHTML = `<h3>Patient Results</h3>`;

    // Check if there are any patients returned
    if (patients.length === 0) {
        resultsDiv.innerHTML += `<p>No results found.</p>`;
        return;
    }

    // Loop through each patient and display their information
    patients.forEach(patient => {
        resultsDiv.innerHTML += `
            <div class="patient-card">
                <p><strong>Name:</strong> ${patient.patient_name || "N/A"}</p>
                <p><strong>Subscriber ID:</strong> ${patient.sub_id || "N/A"}</p>
                <p><strong>Date of Birth:</strong> ${patient.dob || "N/A"}</p>
                <hr>
            </div>
        `;
    });
}

// Add event listener for the "Create Account" link
document.querySelector('.login-link a').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    window.location.href = "signup.html"; // Redirect to the sign-up page
});


// Add this code to your existing JavaScript file

// Handle patient card clicks to redirect to patient details page
function setupPatientCards() {
    const viewButtons = document.querySelectorAll('.patient-card .btn-primary');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get patient information from the card
            const card = this.closest('.patient-card');
            const patientName = card.querySelector('h3').textContent;
            const lastVisit = card.querySelector('p:nth-child(3)').textContent.replace('Last Visit: ', '');
            
            // Generate a random patient ID for demo purposes
            const patientId = 'PT' + Math.floor(10000 + Math.random() * 90000);
            
            // Create mock patient data
            const patientData = {
                name: patientName,
                id: patientId,
                lastVisit: lastVisit,
                // Add any other patient data you want to pass
            };
            
            // Store patient data in localStorage
            localStorage.setItem('currentPatient', JSON.stringify(patientData));
            
            // Redirect to patient details page
            window.location.href = `ev.html?name=${encodeURIComponent(patientName)}&id=${patientId}`;
        });
    });
}

// Call this function when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup patient card click handlers if we're on the main page
    if (document.querySelector('.patient-cards')) {
        setupPatientCards();
    }
});