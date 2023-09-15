// Get references to the input fields and elements
const metricRadio = document.querySelector("input[name='measure'][value='metric']") as HTMLInputElement;
const imperialRadio = document.querySelector("input[name='measure'][value='imperial']") as HTMLInputElement;
const metricDiv = document.querySelector(".metric") as HTMLElement;
const imperialDiv = document.querySelector(".imperial") as HTMLElement;
const metricHeight = document.getElementById('metricHeight') as HTMLInputElement;
const metricWeight = document.getElementById('metricWeight') as HTMLInputElement;
const heightFeet = document.getElementById('heightFeet') as HTMLInputElement;
const heightInches = document.getElementById("heightInches") as HTMLInputElement;
const weightStone = document.getElementById("weightStone") as HTMLInputElement;
const weightPounds = document.getElementById("weightPounds") as HTMLInputElement;
const welcomeDiv = document.querySelector(".welcome") as HTMLElement;
const showResults = document.querySelector(".showResults") as HTMLElement;
const calculatedBmi = document.querySelector('.BMI') as HTMLElement;
const inputForm = document.getElementById("inputForm") as HTMLElement;
const details = document.querySelector(".details") as HTMLElement



let bmi: number = 0;
let heightInMeters:number=0



// Function to show metric or imperial div based on the selected radio button
const updateMeasurementSystem=()=> {
    if (imperialRadio.checked) {
        metricDiv.style.display = "none";
        imperialDiv.style.display = "block";
        localStorage.setItem("selectedMeasurement", "imperial");

    } else {
        metricDiv.style.display = "block";
        imperialDiv.style.display = "none";
        localStorage.setItem("selectedMeasurement", "metric");
    }
}


// Event listeners to switch between radio buttons
metricRadio.addEventListener("change", updateMeasurementSystem);
imperialRadio.addEventListener("change", updateMeasurementSystem);


//Event Listener on the form when enter is pressed
inputForm.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        calculateBMI();
    }
});

// Function to calculate BMI based on the selected measurement system
const calculateBMI = () => {
    const selectedMeasurement = localStorage.getItem("selectedMeasurement");

    if (metricRadio.checked) {
        const height = parseFloat(metricHeight.value);
        const weight = parseFloat(metricWeight.value);

        if (isNaN(height) || isNaN(weight)) {
            alert("Please enter valid height and weight.");
            return;
        }

        heightInMeters = height * 0.01;
        bmi = weight / (heightInMeters * heightInMeters);
    } else {
        const feet = parseFloat(heightFeet.value);
        const inches = parseFloat(heightInches.value);
        const stone = parseFloat(weightStone.value);
        const pounds = parseFloat(weightPounds.value);

        const heightInCm = (feet * 30.48) + (inches * 2.54);
        const weightInKg = (stone * 6.35) + (pounds * 0.4536);
        heightInMeters = heightInCm * 0.01;
        bmi = weightInKg / (heightInMeters * heightInMeters);
    }

    // Now, calculate ideal weight using the calculated heightInMeters
    const idealWeight = calculateNormalWeight(heightInMeters);

    let idealNumbers = '';
    if (selectedMeasurement === 'metric') {
        idealNumbers = idealWeight.kgRange;
    } else {
        idealNumbers = idealWeight.stRange;
    }

    // Determine the BMI category
    let bmiCategory = "";
    if (bmi < 18.5) {
        bmiCategory = "Underweight";
    } else if (bmi >= 18.5 && bmi < 25) {
        bmiCategory = "healthy Weight";
    } else if (bmi >= 25 && bmi < 30) {
        bmiCategory = "Overweight";
    } else {
        bmiCategory = "Obese";
    }

    // Display the BMI result and clear input fields
    welcomeDiv.style.display = 'none';
    showResults.style.display = 'flex';
    calculatedBmi.textContent = `${bmi.toFixed(1)}`;
    details.textContent = `Your BMI suggests you’re a ${bmiCategory}. Your ideal weight is between ${idealNumbers}`;
}


// Check local storage for the selected measurement system and set the default state
let selectedMeasurement="metric";

if (selectedMeasurement === "metric") {
    metricRadio.checked = true;
}

updateMeasurementSystem();



// Function to calculate the normal weight range based on BMI and height
function calculateNormalWeight( height: number) {
    // Define the lower and upper bounds of the normal BMI range
    const lowerBound = 18.5;
    const upperBound = 24.9;

   // Calculate the lower and upper bounds of the normal weight range in kilograms
   let lowerWeightKg = lowerBound * (height * height);
   let upperWeightKg = upperBound * (height * height);

   const kgRange = `${lowerWeightKg.toFixed(1)}kg- ${upperWeightKg.toFixed(1)}kg`

   //Convert Kg to pounds
   const lowerWeightPounds = lowerWeightKg * 2.20462 
   const upperWeightPounds = upperWeightKg * 2.20462 
   //to convert to stone
// Convert decimal portion of pounds to stones
const lowerWeightSt = Math.floor(lowerWeightPounds / 14); // Get the whole number of stones
const lowerWeightPoundsRemaining =Math.round(lowerWeightPounds % 14); // Get the remaining pounds

const upperWeightSt = Math.floor(upperWeightPounds / 14); // Get the whole number of stones
const upperWeightPoundsRemaining = Math.round(upperWeightPounds % 14);

//    const stRange =`${lowerWeightSt.toFixed(2)} st - ${upperWeightSt.toFixed(2)} st`
const stRange = `${lowerWeightSt}st ${lowerWeightPoundsRemaining}lbs - ${upperWeightSt}st ${upperWeightPoundsRemaining}lbs`;

 
   return {
    kgRange:kgRange,
    stRange:stRange
   }

}


