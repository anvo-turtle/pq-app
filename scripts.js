const TOTAL_REPS = 100;
let currentReps = 0; // This remains a static count of the reps you've done
let pqCharge = 0; // This value will decay over time and increment by a set amount
let totalRepsCount = 0;

// Function to update the clock
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    const strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    document.getElementById("clock").textContent = strTime;
}

function incrementProgress() {
    if (currentReps < TOTAL_REPS) {
        currentReps++;
        totalRepsCount++;
    } else {
        totalRepsCount++;
    }

    // Increment pqCharge by a set amount (e.g., 1)
    pqCharge = Math.min(pqCharge + 1, TOTAL_REPS); // Ensure pqCharge doesn't exceed TOTAL_REPS

    localStorage.setItem('lastUpdated', Date.now());
    localStorage.setItem('currentReps', currentReps);
    localStorage.setItem('pqCharge', pqCharge);
    localStorage.setItem('totalRepsCount', totalRepsCount);

    updateUI();
}

function resetCurrentReps() {
    currentReps = 0;
    localStorage.setItem('currentReps', currentReps);
    updateUI();
}


function computeDecay() {
    const lastUpdated = parseInt(localStorage.getItem('lastUpdated') || Date.now());
    const elapsedTime = Date.now() - lastUpdated;

    const elapsedHours = elapsedTime / (1000 * 60 * 60);
    const decayAmount = elapsedHours * (100 / 4.5); // Decay rate of 22.22% per hour
    pqCharge = Math.max(pqCharge - decayAmount, 0); // Directly update the pqCharge variable
    
    localStorage.setItem('pqCharge', pqCharge); // store the decayed charge value
    localStorage.setItem('lastUpdated', Date.now()); // update the last updated time after decaying
}

function updateUI() {
    computeDecay(); // First, decay the charge
    const percentage = (pqCharge / TOTAL_REPS) * 100;

    document.getElementById("progressBar").style.width = percentage + "%";
    document.getElementById("currentReps").textContent = currentReps;
    document.getElementById("pqCharge").textContent = Math.round(percentage) + "%";
    document.getElementById("totalReps").textContent = totalRepsCount;
}

function dailyReset() {
    const lastVisitedDate = new Date(parseInt(localStorage.getItem('lastVisitedDate') || Date.now()));
    const currentDate = new Date();

    if (lastVisitedDate.toDateString() !== currentDate.toDateString()) {
        currentReps = 0;
        pqCharge = 0;
        localStorage.setItem('currentReps', 0);
        localStorage.setItem('pqCharge', 0);
        localStorage.setItem('lastVisitedDate', currentDate.getTime());
    }
}

function loadData() {
    const savedCurrentReps = parseInt(localStorage.getItem('currentReps'), 10);
    const savedPQCharge = parseInt(localStorage.getItem('pqCharge'), 10);
    const savedTotalRepsCount = parseInt(localStorage.getItem('totalRepsCount'), 10);

    if (!isNaN(savedCurrentReps)) {
        currentReps = savedCurrentReps;
    }
    if (!isNaN(savedPQCharge)) {
        pqCharge = savedPQCharge;
    }
    if (!isNaN(savedTotalRepsCount)) {
        totalRepsCount = savedTotalRepsCount;
    }

    const savedLastVisitedDate = new Date(parseInt(localStorage.getItem('lastVisitedDate') || Date.now()));
    if (savedLastVisitedDate.toDateString() !== new Date().toDateString()) {
        localStorage.setItem('lastVisitedDate', Date.now());
    }

    updateUI();
}

loadData();

setInterval(() => {
    updateUI();
    dailyReset();
}, 60 * 1000);

// Call updateClock once on load to immediately display the time
updateClock();

// Update the time every second
setInterval(updateClock, 1000);

// Your existing code for updating UI...
loadData();
setInterval(() => {
    updateUI();
    dailyReset();
}, 60 * 1000);


