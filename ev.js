// ev.js

// Function to get the current date in YYYY-MM-DD format
function getCurrentDate() {
    const date = new Date();
    return date.toISOString().slice(0, 10); // Format: YYYY-MM-DD
}

// Benefit data
const benefits = [
    {
        "BenefitClass": "Amalgam",
        "PlanPays": "80%",
        "Deductible": "Yes",
        "WaitingPeriod": "N/A",
        "ServicesAndUsage": {
            "Frequency": "1 per tooth every 2 Years",
            "AgeLimit": "None"
        }
    },
    {
        "BenefitClass": "Bitewing X-Rays",
        "PlanPays": "100%",
        "Deductible": "Yes",
        "WaitingPeriod": "N/A",
        "ServicesAndUsage": {
            "Frequency": "1 per Service Year",
            "AgeLimit": "None"
        }
    },
    {
        "BenefitClass": "Comprehensive and Periodic Exams",
        "PlanPays": "100%",
        "Deductible": "Yes",
        "WaitingPeriod": "N/A",
        "ServicesAndUsage": {
            "Frequency": "1 per Service Year",
            "AgeLimit": "None"
        }
    },
    {
        "BenefitClass": "Dental Crowns",
        "PlanPays": "50%",
        "Deductible": "Yes",
        "WaitingPeriod": "N/A",
        "ServicesAndUsage": {
            "Frequency": "2 per Service Year",
            "AgeLimit": "2 remaining this period"
        }
    },
    {
        "BenefitClass": "Dentures and Partials",
        "PlanPays": "50%",
        "Deductible": "Yes",
        "WaitingPeriod": "N/A",
        "ServicesAndUsage": {
            "Frequency": "1 per Service Year",
            "AgeLimit": "None"
        }
    },
    {
        "BenefitClass": "Endodontics",
        "PlanPays": "80%",
        "Deductible": "Yes",
        "WaitingPeriod": "N/A",
        "ServicesAndUsage": {
            "Frequency": "1 per Service Year",
            "AgeLimit": "2 remaining this period"
        }
    },
    {
        "BenefitClass": "Fixed Partial Dentures",
        "PlanPays": "50%",
        "Deductible": "Yes",
        "WaitingPeriod": "N/A",
        "ServicesAndUsage": {
            "Frequency": "1 per Lifetime",
            "AgeLimit": "None"
        }
    },
    {
        "BenefitClass": "Fluoride",
        "PlanPays": "N/A",
        "Deductible": "No",
        "WaitingPeriod": "N/A",
        "ServicesAndUsage": {
            "Frequency": "Not a Covered Benefit",
            "AgeLimit": "None"
        }
    },
    {
        "BenefitClass": "Full Mouth Debridement",
        "PlanPays": "100%",
        "Deductible": "Yes",
        "WaitingPeriod": "1 per Lifetime",
        "ServicesAndUsage": {
            "Frequency": "1 per Lifetime",
            "AgeLimit": "Subject to Contract Limitations If Applicable"
        }
    },
    {
        "BenefitClass": "Full Mouth X-Ray",
        "PlanPays": "100%",
        "Deductible": "Yes",
        "WaitingPeriod": "1 per 3 Years",
        "ServicesAndUsage": {
            "Frequency": "1 per 3 Years",
            "AgeLimit": "Last Service Date: 01/25/2024"
        }
    },
    {
        "BenefitClass": "Gen Anesthesia",
        "PlanPays": "80%",
        "Deductible": "Yes",
        "WaitingPeriod": "3 per 1 Days",
        "ServicesAndUsage": {
            "Frequency": "3 per 1 Days",
            "AgeLimit": "Payable when performed by a licensed dentist in conjunction with covered procedures"
        }
    }
];

// Demo patient data
const demoPatients = [
    {
        "patient_name": "John Doe",
        "sub_id": "v8866370536",
        "dob": "2005-03-15",
        "requestDate": getCurrentDate(),
        "memberName": "John Doe",
        "memberID": "123456",
        "age": 18,
        "coverage": "Full",
        "effectiveDate": "2023-01-01",
        "eligibleThrough": "2024-01-01",
        "coverageLevel": "Gold",
        "paymentLevel": "Standard",
        "serviceYear": "2023",
        "planMax": "$1,000,000",
        "individualDeductible": "$500",
        "familyDeductible": "$1000",
        "dependentEligibility": "Yes",
        "studentEligibility": "Yes"
    },
    {
        "patient_name": "Jane Smith",
        "sub_id": "SUB654321",
        "dob": "1990-10-20",
        "requestDate": getCurrentDate(),
        "memberName": "Jane Smith",
        "memberID": "654321",
        "age": 33,
        "coverage": "Partial",
        "effectiveDate": "2022-05-01",
        "eligibleThrough": "2023-12-31",
        "coverageLevel": "Silver",
        "paymentLevel": "Standard",
        "serviceYear": "2023",
        "planMax": "$500,000",
        "individualDeductible": "$750",
        "familyDeductible": "$1500",
        "dependentEligibility": "No",
        "studentEligibility": "No"
    },
    {
        "patient_name": "Alice Johnson",
        "sub_id": "SUB111222",
        "dob": "1975-03-30",
        "requestDate": getCurrentDate(),
        "memberName": "Alice Johnson",
        "memberID": "111222",
        "age": 48,
        "coverage": "Full",
        "effectiveDate": "2021-01-01",
        "eligibleThrough": "2024-01-01",
        "coverageLevel": "Platinum",
        "paymentLevel": "Premium",
        "serviceYear": "2023",
        "planMax": "$2,000,000",
        "individualDeductible": "$300",
        "familyDeductible": "$600",
        "dependentEligibility": "Yes",
        "studentEligibility": "Yes"
    },
    {
        "patient_name": "Bob Brown",
        "sub_id": "SUB333444",
        "dob": "1980-12-12",
        "requestDate": getCurrentDate(),
        "memberName": "Bob Brown",
        "memberID": "333444",
        "age": 42,
        "coverage": "Limited",
        "effectiveDate": "2022-11-01",
        "eligibleThrough": "2023-11-01",
        "coverageLevel": "Bronze",
        "paymentLevel": "Basic",
        "serviceYear": "2023",
        "planMax": "$250,000",
        "individualDeductible": "$1000",
        "familyDeductible": "$2000",
        "dependentEligibility": "Yes",
        "studentEligibility": "No"
    }
];

// Demo dental codes data
const dentalCodes = [
    { code: "D0120", description: "Periodic oral evaluation - established patient" },
    { code: "D0150", description: "Comprehensive oral evaluation - new or established patient" },
    { code: "D0210", description: "Intraoral - complete series of radiographic images" },
    { code: "D0220", description: "Intraoral - periapical first radiographic image" },
    { code: "D0274", description: "Bitewings - four radiographic images" },
    { code: "D0330", description: "Panoramic radiographic image" },
    { code: "D1110", description: "Prophylaxis - adult" },
    { code: "D1120", description: "Prophylaxis - child" },
    { code: "D1351", description: "Sealant - per tooth" },
    { code: "D2140", description: "Amalgam - one surface, primary or permanent" },
    { code: "D2150", description: "Amalgam - two surfaces, primary or permanent" },
    { code: "D2330", description: "Resin-based composite - one surface, anterior" },
    { code: "D2750", description: "Crown - porcelain fused to high noble metal" },
    { code: "D2950", description: "Core buildup, including any pins when required" },
    { code: "D3310", description: "Endodontic therapy, anterior tooth (excluding final restoration)" },
    { code: "D4341", description: "Periodontal scaling and root planing - four or more teeth per quadrant" },
    { code: "D5110", description: "Complete denture - maxillary" },
    { code: "D5213", description: "Partial denture - maxillary, resin base" },
    { code: "D7140", description: "Extraction, erupted tooth or exposed root" },
    { code: "D8080", description: "Comprehensive orthodontic treatment of the adolescent dentition" }
];

// Function to display benefits in console
function displayBenefits() {
    benefits.forEach(benefit => {
        console.log(`Benefit Class: ${benefit.BenefitClass}`);
        console.log(`% Plan Pays: ${benefit.PlanPays}`);
        console.log(`Deductible: ${benefit.Deductible}`);
        console.log(`Waiting Period: ${benefit.WaitingPeriod}`);
        console.log(`Services & Usage: Frequency - ${benefit.ServicesAndUsage.Frequency}, Age Limit - ${benefit.ServicesAndUsage.AgeLimit}`);
        console.log('------------------------------------');
    });
}

// Function to populate patient dropdown
function populatePatientDropdown() {
    const patientSelect = document.createElement('select');
    patientSelect.id = 'patientSelect';
    patientSelect.innerHTML = '<option value="">Select Patient</option>';
    
    demoPatients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.patient_name;
        option.text = patient.patient_name;
        patientSelect.appendChild(option);
    });
    
    const searchBox = document.querySelector('.search-box');
    searchBox.insertBefore(patientSelect, document.getElementById('lookupButton'));
}

// Function to fetch and display patient data
function fetchPatientData(patientName) {
    const patient = demoPatients.find(p => p.patient_name === patientName);
    if (patient) {
        document.getElementById('patientName').innerText = patient.patient_name;
        document.getElementById('requestDate').innerText = patient.requestDate;
        document.getElementById('memberName').innerText = patient.memberName;
        document.getElementById('memberID').innerText = patient.memberID;
        document.getElementById('dob').innerText = patient.dob;
        document.getElementById('age').innerText = patient.age;
        document.getElementById('coverage').innerText = patient.coverage;
        document.getElementById('effectiveDate').innerText = patient.effectiveDate;
        document.getElementById('eligibleThrough').innerText = patient.eligibleThrough;
        document.getElementById('coverageLevel').innerText = patient.coverageLevel;
        document.getElementById('paymentLevel').innerText = patient.paymentLevel;
        document.getElementById('serviceYear').innerText = patient.serviceYear;
        document.getElementById('planMax').innerText = patient.planMax;
        document.getElementById('individualDeductible').innerText = patient.individualDeductible;
        document.getElementById('familyDeductible').innerText = patient.familyDeductible;
        document.getElementById('dependentEligibility').innerText = patient.dependentEligibility;
        document.getElementById('studentEligibility').innerText = patient.studentEligibility;
        return patient;
    } else {
        document.querySelector('.patient-info').innerHTML = `<p>No patient details available.</p>`;
        return null;
    }
}

// Function to display dental codes in the table
function displayDentalCodes(codes, tableBody) {
    tableBody.innerHTML = "";
    if (codes.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='7'>No results found</td></tr>";
        return;
    }

    codes.forEach(benefit => {
        const row = `<tr>
            <td>${benefit.code || 'N/A'}</td>
            <td>${benefit.description || 'N/A'}</td>
            <td>${benefit.plan_pays || 'N/A'}</td>
            <td>${benefit.deductible || 'N/A'}</td>
            <td>${benefit.waiting_period || 'N/A'}</td>
            <td>${benefit.frequency || 'N/A'}</td>
            <td>${benefit.age_limit || 'N/A'}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Map dental codes to benefit classes
const codeToBenefitMap = {
    "D0120": "Comprehensive and Periodic Exams",
    "D0150": "Comprehensive and Periodic Exams",
    "D0210": "Full Mouth X-Ray",
    "D0220": "Full Mouth X-Ray",
    "D0274": "Bitewing X-Rays",
    "D0330": "Full Mouth X-Ray",
    "D1110": "Full Mouth Debridement",
    "D1120": "Full Mouth Debridement",
    "D1351": "Fluoride",
    "D2140": "Amalgam",
    "D2150": "Amalgam",
    "D2330": "Amalgam",
    "D2750": "Dental Crowns",
    "D2950": "Dental Crowns",
    "D3310": "Endodontics",
    "D4341": "Full Mouth Debridement",
    "D5110": "Dentures and Partials",
    "D5213": "Fixed Partial Dentures",
    "D7140": "Endodontics",
    "D8080": "Fluoride"
};

// Main event listener
document.addEventListener("DOMContentLoaded", () => {
    populatePatientDropdown();
    displayBenefits(); // Show benefits in console on load

    const lookupButton = document.getElementById("lookupButton");
    const searchInput = document.getElementById("codeSearch");
    const searchButton = document.getElementById("searchBtn");
    // Target the second benefitsTable (the one after the search bar)
    const benefitsTable = document.querySelectorAll('.benefits-table tbody')[1] || document.getElementById('benefitsTable');
    let selectedPatient = null;

    // Patient lookup
    lookupButton.addEventListener("click", () => {
        const patientName = document.getElementById("patientSelect").value;
        if (patientName) {
            selectedPatient = fetchPatientData(patientName);
            if (selectedPatient) {
                benefitsTable.innerHTML = ""; // Clear previous code search results
                document.querySelector('.patient-info').style.display = 'block';
            }
        } else {
            alert("Please select a patient!");
        }
    });

    // Code search
    function handleSearch() {
        const searchQuery = searchInput.value.trim().toUpperCase();
        
        if (!selectedPatient) {
            alert("Please select a patient first!");
            return;
        }

        console.log("Searching for:", searchQuery); // Debug log

        // Filter dental codes based on search query
        let filteredCodes = searchQuery 
            ? dentalCodes.filter(item => 
                item.code === searchQuery || 
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : dentalCodes;

        console.log("Filtered Codes:", filteredCodes); // Debug log

        if (filteredCodes.length === 0) {
            benefitsTable.innerHTML = `<tr><td colspan="7">No coverage found for code: ${searchQuery}. This is not a covered benefit.</td></tr>`;
        } else {
            // Map the filtered codes to benefits and adjust based on patient's coverage level
            const adjustedCodes = filteredCodes.map(code => {
                const benefitClass = codeToBenefitMap[code.code];
                const benefit = benefits.find(b => b.BenefitClass === benefitClass);
                
                if (!benefit) {
                    return {
                        code: code.code,
                        description: code.description,
                        plan_pays: "N/A",
                        deductible: "N/A",
                        waiting_period: "N/A",
                        frequency: "Not a Covered Benefit",
                        age_limit: "N/A"
                    };
                }

                let planPays = parseInt(benefit.PlanPays) || 0;
                if (isNaN(planPays)) {
                    planPays = 0; // Handle cases where PlanPays is "N/A"
                }
                switch(selectedPatient.coverageLevel) {
                    case "Bronze":
                        planPays = Math.round(planPays * 0.8) + "%";
                        break;
                    case "Silver":
                        planPays = planPays + "%";
                        break;
                    case "Gold":
                        planPays = Math.round(planPays * 1.1) + "%";
                        break;
                    case "Platinum":
                        planPays = "100%";
                        break;
                    default:
                        planPays = benefit.PlanPays;
                }

                return {
                    code: code.code,
                    description: code.description,
                    plan_pays: planPays,
                    deductible: benefit.Deductible,
                    waiting_period: benefit.WaitingPeriod,
                    frequency: benefit.ServicesAndUsage.Frequency,
                    age_limit: benefit.ServicesAndUsage.AgeLimit
                };
            });

            console.log("Adjusted Codes:", adjustedCodes); // Debug log
            displayDentalCodes(adjustedCodes, benefitsTable);
        }
    }

    // Search triggers
    searchButton.addEventListener("click", handleSearch);
    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearch();
        }
    });
});

// Handle URL parameters on page load
window.onload = function() {
    const params = getUrlParams();
    if (params.name) {
        fetchPatientData(params.name);
    }
};

// Helper function for URL parameters
function getUrlParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const regex = /([^&=]+)=([^&]*)/g;
    let m;
    while (m = regex.exec(queryString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params;
}