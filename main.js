// UI elements
const mDistFromExtToMark = document.getElementById("extruder-mark-distance");
const mActualAmtExtruded = document.getElementById("extrude-actual");
const mCurrentExtrusion  = document.getElementById("status");
const mCurrentStepsPerMM = document.getElementById("steps-mm-current");
const mCalibratedStepsMM = document.getElementById("steps-mm-new");
const mAmountToExtrude   = document.getElementById("extrude-amt");
const mMarkedDist        = document.getElementById("mark");

const TOLERANCE = 0.5;
let extrusionStatusColor = "#eee";
let extrusionStatusMsg = "-";


// Make each input call the update fn on input change
const inputs = document.querySelectorAll("input");
inputs.forEach(input => {
    input.addEventListener("input", update);
});

/**
 * Updates results based on input values.
 */
function update() {
    // Input values
    const markedDist           = mMarkedDist.value;
    const amountToExtrude      = mAmountToExtrude.value;
    const markDistAfterExtrude = mDistFromExtToMark.value;
    const stepsMMCurrent       = mCurrentStepsPerMM.value;
    const markToExtruderDiff   = markedDist - amountToExtrude;

    // Actual amount extruded
    let actualExtrudedAmount = markedDist - markDistAfterExtrude;
    let actualExtrudedPercent = ((actualExtrudedAmount / amountToExtrude) * 100).toFixed(1);
    mActualAmtExtruded.textContent = actualExtrudedAmount;

    // Extrusion status
    if (Math.abs(markDistAfterExtrude - markToExtruderDiff) <= TOLERANCE) {
        extrusionStatusMsg = "Good";
        extrusionStatusColor = "limegreen";
    }
    else if (markDistAfterExtrude > markToExtruderDiff) {
        extrusionStatusMsg = "Under";
        extrusionStatusColor = "gold";
    }
    else if (markDistAfterExtrude < markToExtruderDiff) {
        extrusionStatusMsg = "Over";
        extrusionStatusColor = "red";
    }
    mCurrentExtrusion.textContent = extrusionStatusMsg + " (" + Math.abs(100 - actualExtrudedPercent).toFixed(1) + "%)";
    mCurrentExtrusion.style.color = extrusionStatusColor;

    // Steps/mm
    let stepsCal = stepsMMCurrent * amountToExtrude / actualExtrudedAmount;
    mCalibratedStepsMM.textContent = stepsCal.toFixed(2);
    mCalibratedStepsMM.style.color = stepsCal !== 0 ? "limegreen" : "#eee";
}
update();
