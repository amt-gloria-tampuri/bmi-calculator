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
function updateMeasurementSystem() {
    if (metricRadio.checked) {
        metricDiv.style.display = "block";
        imperialDiv.style.display = "none";
        localStorage.setItem("selectedMeasurement", "metric");
    }
    else {
        metricDiv.style.display = "none";
        imperialDiv.style.display = "block";
        localStorage.setItem("selectedMeasurement", "imperial");
    }
}
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
        calculateNormalWeight(heightInMeters);
    }
    else {
        var feet = parseFloat(heightFeet.value) || 0;
        var inches = parseFloat(heightInches.value) || 0;
        var stone = parseFloat(weightStone.value) || 0;
        var pounds = parseFloat(weightPounds.value) || 0;
        //30.48cm = 1feet ,  1nch = 2.54cm
        //6.35kg = 1stone. 0.4536lbs = 1kg
        var heightInCm = (feet * 30.48) + (inches * 2.54);
        var weightInKg = (stone * 6.35) + (pounds * 0.4536);
        var heightInMeters_1 = heightInCm / 100;
        bmi = weightInKg / (heightInMeters_1 * heightInMeters_1);
        calculateNormalWeight(heightInMeters_1);
        console.log(calculateNormalWeight(heightInMeters_1));
    }
    var idealWeight = calculateNormalWeight(heightInMeters);
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
    // Display the BMI result
    welcomeDiv.style.display = 'none';
    showResults.style.display = 'flex';
    metricHeight.value = '';
    metricWeight.value = '';
    heightFeet.value = '';
    heightInches.value = '';
    weightStone.value = '';
    weightPounds.value = '';
    calculatedBmi.textContent = "".concat(bmi.toFixed(1));
    if (selectedMeasurement === 'metric') {
        details.textContent = "Your BMI suggests you\u2019re a ".concat(bmiCategory, ". Your ideal weight is between ").concat(idealWeight.kgRange);
    }
    else {
        details.textContent = "Your BMI suggests you\u2019re a ".concat(bmiCategory, ". Your ideal weight is between ").concat(idealWeight.stRange);
    }
};
// Check local storage for the selected measurement system and set the default state
var selectedMeasurement = localStorage.getItem("selectedMeasurement");
if (selectedMeasurement === "imperial") {
    imperialRadio.checked = true;
}
updateMeasurementSystem();
// Add event listeners
metricRadio.addEventListener("change", updateMeasurementSystem);
imperialRadio.addEventListener("change", updateMeasurementSystem);
inputForm.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        calculateBMI();
    }
});
// Function to calculate the normal weight range based on BMI and height
function calculateNormalWeight(height) {
    // Define the lower and upper bounds of the normal BMI range
    var lowerBound = 18.5;
    var upperBound = 24.9;
    // Calculate the lower and upper bounds of the normal weight range in kilograms
    var lowerWeightKg = lowerBound * (height * height);
    var upperWeightKg = upperBound * (height * height);
    var kgRange = "".concat(lowerWeightKg.toFixed(1), " kg- ").concat(upperWeightKg.toFixed(1), " kg");
    //Convert Kg to pounds
    var lowerWeightPounds = lowerWeightKg * 2.20462;
    var upperWeightPounds = upperWeightKg * 2.20462;
    //to convert to stone
    // Convert decimal portion of pounds to stones
    var lowerWeightSt = Math.floor(lowerWeightPounds / 14); // Get the whole number of stones
    var lowerWeightPoundsRemaining = (lowerWeightPounds % 14); // Get the remaining pounds
    var upperWeightSt = Math.floor(upperWeightPounds / 14); // Get the whole number of stones
    var upperWeightPoundsRemaining = (upperWeightPounds % 14);
    //    const stRange =`${lowerWeightSt.toFixed(2)} st - ${upperWeightSt.toFixed(2)} st`
    var stRange = "".concat(lowerWeightSt.toFixed(0), " st ").concat(lowerWeightPoundsRemaining.toFixed(2), " lb - ").concat(upperWeightSt.toFixed(0), " st ").concat(upperWeightPoundsRemaining.toFixed(2), " lb");
    return {
        kgRange: kgRange,
        stRange: stRange
    };
}
