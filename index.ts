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
function updateMeasurementSystem() {
    if (metricRadio.checked) {
        metricDiv.style.display = "block";
        imperialDiv.style.display = "none";
        localStorage.setItem("selectedMeasurement", "metric");
    } else {
        metricDiv.style.display = "none";
        imperialDiv.style.display = "block";
        localStorage.setItem("selectedMeasurement", "imperial");
    }
}

// Function to calculate BMI based on the selected measurement system
const calculateBMI=()=> {
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
     calculateNormalWeight(heightInMeters);


    } else {
        const feet = parseFloat(heightFeet.value) || 0;
        const inches = parseFloat(heightInches.value) || 0;
        const stone = parseFloat(weightStone.value) || 0;
        const pounds = parseFloat(weightPounds.value) || 0;

            //30.48cm = 1feet ,  1nch = 2.54cm
            //6.35kg = 1stone. 0.4536lbs = 1kg
        const heightInCm = (feet * 30.48) + (inches * 2.54);
        const weightInKg = (stone * 6.35) + (pounds * 0.4536);
        const heightInMeters = heightInCm / 100;

        bmi= weightInKg / (heightInMeters * heightInMeters);
        calculateNormalWeight(heightInMeters);
        console.log(calculateNormalWeight(heightInMeters));

    }
    const idealWeight =calculateNormalWeight(heightInMeters);
    
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

    // Display the BMI result
    welcomeDiv.style.display = 'none';
    showResults.style.display = 'flex';
    metricHeight.value = '';
    metricWeight.value = '';
    heightFeet.value = '';
    heightInches.value = '';
    weightStone.value = '';
    weightPounds.value = '';
    calculatedBmi.textContent = `${bmi.toFixed(1)}`;
  

    if (selectedMeasurement === 'metric') {
        details.textContent = `Your BMI suggests you’re a ${bmiCategory}. Your ideal weight is between ${idealWeight.kgRange}`;
    } else {
        details.textContent = `Your BMI suggests you’re a ${bmiCategory}. Your ideal weight is between ${idealWeight.stRange}`;
    }
    
}

// Check local storage for the selected measurement system and set the default state
const selectedMeasurement = localStorage.getItem("selectedMeasurement");

if (selectedMeasurement === "imperial") {
    imperialRadio.checked = true;
}

updateMeasurementSystem();

// Add event listeners
metricRadio.addEventListener("change", updateMeasurementSystem);
imperialRadio.addEventListener("change", updateMeasurementSystem);
inputForm.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        calculateBMI();
    }
});

// Function to calculate the normal weight range based on BMI and height
function calculateNormalWeight( height: number) {
    // Define the lower and upper bounds of the normal BMI range
    const lowerBound = 18.5;
    const upperBound = 24.9;

   // Calculate the lower and upper bounds of the normal weight range in kilograms
   let lowerWeightKg = lowerBound * (height * height);
   let upperWeightKg = upperBound * (height * height);

   const kgRange = `${lowerWeightKg.toFixed(1)} kg- ${upperWeightKg.toFixed(1)} kg`

   //Convert Kg to pounds
   const lowerWeightPounds = lowerWeightKg * 2.20462 
   const upperWeightPounds = upperWeightKg * 2.20462 
   //to convert to stone
// Convert decimal portion of pounds to stones
const lowerWeightSt = Math.floor(lowerWeightPounds / 14); // Get the whole number of stones
const lowerWeightPoundsRemaining =( lowerWeightPounds % 14); // Get the remaining pounds

const upperWeightSt = Math.floor(upperWeightPounds / 14); // Get the whole number of stones
const upperWeightPoundsRemaining = (upperWeightPounds % 14);

//    const stRange =`${lowerWeightSt.toFixed(2)} st - ${upperWeightSt.toFixed(2)} st`
const stRange = `${lowerWeightSt.toFixed(0)} st ${lowerWeightPoundsRemaining.toFixed(2)} lb - ${upperWeightSt.toFixed(0)} st ${upperWeightPoundsRemaining.toFixed(2)} lb`;

 
   return {
    kgRange:kgRange,
    stRange:stRange
   }

}


