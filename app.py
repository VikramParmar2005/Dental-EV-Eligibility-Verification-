import os
import json
import logging
from flask import Flask, render_template, jsonify, request

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dental-benefit-verification-secret")

# Load dental codes data
with open('static/js/dental_codes.js', 'r') as f:
    dental_codes_js = f.read()
    # Extract the JSON part from the JS file
    dental_codes_start = dental_codes_js.find('[')
    dental_codes_end = dental_codes_js.rfind(']') + 1
    DENTAL_CODES = json.loads(dental_codes_js[dental_codes_start:dental_codes_end])

# Load benefit data
BENEFITS = [
    {
        "benefit_class": "Amalgam",
        "plan_pays": "80%",
        "deductible": "Yes",
        "waiting_period": "N/A",
        "services_usage": "Frequency: 1 per tooth every 2 Years, Age Limit: None"
    },
    {
        "benefit_class": "Bitewing X-Rays",
        "plan_pays": "100%",
        "deductible": "Yes",
        "waiting_period": "N/A",
        "services_usage": "Frequency: 1 per Service Year, Age Limit: None"
    },
    {
        "benefit_class": "Comprehensive and Periodic Exams",
        "plan_pays": "100%",
        "deductible": "Yes",
        "waiting_period": "N/A",
        "services_usage": "Frequency: 1 per Service Year, Age Limit: None"
    },
    {
        "benefit_class": "Dental Crowns",
        "plan_pays": "50%",
        "deductible": "Yes",
        "waiting_period": "N/A",
        "services_usage": "Frequency: 2 per Service Year, Age Limit: 2 remaining this period"
    },
    {
        "benefit_class": "Dentures and Partials",
        "plan_pays": "50%",
        "deductible": "Yes",
        "waiting_period": "N/A",
        "services_usage": "Frequency: 1 per Service Year, Age Limit: None"
    },
    {
        "benefit_class": "Endodontics",
        "plan_pays": "80%",
        "deductible": "Yes",
        "waiting_period": "N/A",
        "services_usage": "Frequency: 1 per Service Year, Age Limit: 2 remaining this period"
    },
    {
        "benefit_class": "Fixed Partial Dentures",
        "plan_pays": "50%",
        "deductible": "Yes",
        "waiting_period": "N/A",
        "services_usage": "Frequency: 1 per Lifetime, Age Limit: None"
    },
    {
        "benefit_class": "Fluoride",
        "plan_pays": "N/A",
        "deductible": "No",
        "waiting_period": "N/A",
        "services_usage": "Frequency: Not a Covered Benefit, Age Limit: None"
    },
    {
        "benefit_class": "Full Mouth Debridement",
        "plan_pays": "100%",
        "deductible": "Yes",
        "waiting_period": "N/A",
        "services_usage": "Frequency: 1 per Lifetime, Age Limit: Subject to Contract Limitations If Applicable"
    },
    {
        "benefit_class": "Full Mouth X-Ray",
        "plan_pays": "100%",
        "deductible": "Yes",
        "waiting_period": "N/A",
        "services_usage": "Frequency: 1 per 3 Years, Age Limit: Last Service Date: 01/25/2024"
    },
    {
        "benefit_class": "Gen Anesthesia",
        "plan_pays": "80%",
        "deductible": "Yes",
        "waiting_period": "N/A",
        "services_usage": "Frequency: 3 per 1 Days, Age Limit: None"
    }
]

# Demo patients data
DEMO_PATIENTS = [
    {
        "patient_name": "John Doe",
        "sub_id": "v8866370536",
        "dob": "2005-03-15",
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
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/dental-codes', methods=['GET'])
def get_dental_codes():
    search_query = request.args.get('query', '').lower()
    if not search_query:
        return jsonify([])
    
    # Search for matching codes
    results = []
    for code in DENTAL_CODES:
        if search_query in code['code'].lower() or search_query in code['description'].lower():
            results.append(code)
    
    return jsonify(results)

@app.route('/api/patient-benefits', methods=['GET'])
def get_patient_benefits():
    return jsonify(BENEFITS)

@app.route('/api/patients', methods=['GET'])
def get_patients():
    name = request.args.get('name', '')
    if name:
        for patient in DEMO_PATIENTS:
            if patient['patient_name'].lower() == name.lower():
                return jsonify(patient)
        return jsonify({"error": "Patient not found"}), 404
    return jsonify(DEMO_PATIENTS)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
