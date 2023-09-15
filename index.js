// Get references to the input fields and elements
var metricRadio = document.querySelector("input[name='measure'][value='metric']");
var imperialRadio = document.querySelector("input[name='measure'][value='imperial']");
var metricDiv = document.querySelector(".metric");
var imperialDiv = document.querySelector(".imperial");
var metricHeight = document.getElementById('metricHeight');
var metricWeight = document.getElementById('metricWeight');
var heightFeet = document.getElementById('heightFeet');
var heightInches = document.getElementById("heightInches");
var weightStone = document.getElementById("weightStone");
var weightPounds = document.getElementById("weightPounds");
var welcomeDiv = document.querySelector(".welcome");
var showResults = document.querySelector(".showResults");
var calculatedBmi = document.querySelector('.BMI');
var inputForm = document.getElementById("inputForm");
var details = document.querySelector(".details");
var bmi = 0;
var heightInMeters = 0;
// Function to show metric or imperial div based on the selected radio button
var updateMeasurementSystem = function () {
    if (imperialRadio.checked) {
        metricDiv.style.display = "none";
        imperialDiv.style.display = "block";
        localStorage.setItem("selectedMeasurement", "imperial");
        metricHeight.value = '';
        metricWeight.value = '';
    }
    else {
        metricDiv.style.display = "block";
        imperialDiv.style.display = "none";
        localStorage.setItem("selectedMeasurement", "metric");
        heightFeet.value = '';
        heightInches.value = '';
        weightStone.value = '';
        weightPounds.value = '';
    }
};
// Event listeners to switch between radio buttons
metricRadio.addEventListener("change", updateMeasurementSystem);
imperialRadio.addEventListener("change", updateMeasurementSystem);
//Event Listener on the form when enter is pressed
inputForm.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        calculateBMI();
    }
});
// Function to calculate BMI based on the selected measurement system
var calculateBMI = function () {
    var selectedMeasurement = localStorage.getItem("selectedMeasurement");
    if (metricRadio.checked) {
        var height = parseFloat(metricHeight.value);
        var weight = parseFloat(metricWeight.value);
        if (isNaN(height) || isNaN(weight)) {
            alert("Please enter valid height and weight.");
            return;
        }
        heightInMeters = height * 0.01;
        bmi = weight / (heightInMeters * heightInMeters);
    }
    else {
        var feet = parseFloat(heightFeet.value);
        var inches = parseFloat(heightInches.value);
        var stone = parseFloat(weightStone.value);
        var pounds = parseFloat(weightPounds.value);
        var heightInCm = (feet * 30.48) + (inches * 2.54);
        var weightInKg = (stone * 6.35029) + (pounds * 0.453592);
        heightInMeters = heightInCm * 0.01;
        bmi = weightInKg / (heightInMeters * heightInMeters);
    }
    // Now, calculate ideal weight using the calculated heightInMeters
    var idealWeight = calculateNormalWeight(heightInMeters);
    var idealNumbers = '';
    if (selectedMeasurement === 'metric') {
        idealNumbers = "<strong>".concat(idealWeight.kgRange, "</strong>");
    }
    else {
        idealNumbers = "<strong>".concat(idealWeight.stRange, "</strong>");
    }
    // Determine the BMI category
    var bmiCategory = "";
    if (bmi < 18.5) {
        bmiCategory = "Underweight";
    }
    else if (bmi >= 18.5 && bmi < 25) {
        bmiCategory = "healthy Weight";
    }
    else if (bmi >= 25 && bmi < 30) {
        bmiCategory = "Overweight";
    }
    else {
        bmiCategory = "Obese";
    }
    // Display the BMI result and clear input fields
    welcomeDiv.style.display = 'none';
    showResults.style.display = 'flex';
    calculatedBmi.textContent = "".concat(bmi.toFixed(1));
    details.innerHTML = "Your BMI suggests you\u2019re a ".concat(bmiCategory, ". Your ideal weight is between ").concat(idealNumbers);
};
// Check local storage for the selected measurement system and set the default state
var selectedMeasurement = "metric";
if (selectedMeasurement === "metric") {
    metricRadio.checked = true;
}
updateMeasurementSystem();
// Function to calculate the normal weight range based on BMI and height
function calculateNormalWeight(height) {
    // Defining the lower and upper bounds of the normal BMI range
    var lowerBound = 18.5;
    var upperBound = 24.9;
    // Calculate the lower and upper bounds of the normal weight range in kilograms
    var lowerWeightKg = lowerBound * (height * height);
    var upperWeightKg = upperBound * (height * height);
    var kgRange = "".concat(lowerWeightKg.toFixed(1), "kg- ").concat(upperWeightKg.toFixed(1), "kg");
    //Convert Kg to pounds
    var lowerWeightPounds = lowerWeightKg * 2.20462;
    var upperWeightPounds = upperWeightKg * 2.20462;
    //to convert to stone
    // Convert decimal portion of pounds to stones
    var lowerWeightSt = Math.floor(lowerWeightPounds / 14); // Get the whole number of stones
    var lowerWeightPoundsRemaining = Math.round(lowerWeightPounds % 14); // Get the remaining pounds
    var upperWeightSt = Math.floor(upperWeightPounds / 14); // Get the whole number of stones
    var upperWeightPoundsRemaining = Math.round(upperWeightPounds % 14);
    var stRange = "".concat(lowerWeightSt, "st ").concat(lowerWeightPoundsRemaining, "lbs - ").concat(upperWeightSt, "st ").concat(upperWeightPoundsRemaining, "lbs");
    return {
        kgRange: kgRange,
        stRange: stRange
    };
}
