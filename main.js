// UI elements
const mMarkedDist        = document.getElementById("mark");
const mAmountToExtruder  = document.getElementById("extrude-amt");
const mDistFromExtToMark = document.getElementById("extruder-mark-distance");
const mActualAmtExtruded = document.getElementById("extrude-actual");
const mCurrentExtrusion  = document.getElementById("status");
const mCurrentStepsPerMM = document.getElementById("steps-mm-current");
const mCalibratedStepsMM = document.getElementById("steps-mm-new");
const mFlow              = document.getElementById("flow");
const mGcodeStart        = document.getElementById("gcode-start");

// Make each input call the update fn on input change
const inputs = document.querySelectorAll("input");
inputs.forEach(input => {
    input.addEventListener("input", update);
});

function update() {
    // Get input values
    const markDist = mMarkedDist.value;
    const extAmt = mAmountToExtruder.value;
    const markToExtDist = mDistFromExtToMark.value;
    const stepsCurr = mCurrentStepsPerMM.value;
    const markExtDiff = markDist - extAmt;

    // Actual amount extruded
    let extAct = markDist - markToExtDist;
    let extPct = ((extAct / extAmt) * 100).toFixed(1);
    mActualAmtExtruded.textContent = extAct;

    // Extrusion status
    let extStatus = "-"; // Under, over, good
    let statusColor = "#eee";
    if (markToExtDist > markExtDiff) {
        extStatus = "Under";
        statusColor = "gold";
    } else if (markToExtDist < markExtDiff) {
        extStatus = "Over";
        statusColor = "red";
    }
    mCurrentExtrusion.textContent = extStatus + " (" + extPct + "%)";
    mCurrentExtrusion.style.color = statusColor;

    // Steps/mm
    let stepsCal = stepsCurr * extAmt / extAct;
    mCalibratedStepsMM.textContent = stepsCal.toFixed(2);
    if (stepsCal !== 0) {
        mCalibratedStepsMM.style.color = "limegreen";
    } else {
        mCalibratedStepsMM.style.color = "#eee";
    }

    // Gcode start
    const flow = mFlow.value;
    mGcodeStart.value = `M28 \t\t\t;relative mode\nG0 E${extAmt} F${flow} \t;extrude`;
    // Auto resize textarea rows
    mGcodeStart.style.height = "5px";
    mGcodeStart.style.height = (mGcodeStart.scrollHeight) + "px";
}

update();