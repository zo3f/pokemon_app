const romList = [];
let activeRom = null; // To store the selected ROM
let emulator = null; // To hold the emulator instance

// Handle ROM file upload
function uploadRom() {
    const romInput = document.getElementById('romInput');
    const romFile = romInput.files[0];

    if (!romFile) {
        alert("Please select a ROM file to upload.");
        return;
    }

    if (!romFile.name.endsWith('.gba')) {
        alert("Please upload a valid Game Boy Advance (.gba) ROM file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const romData = new Uint8Array(event.target.result); // Convert ArrayBuffer to Uint8Array
        localStorage.setItem(romFile.name, romData); // Store in local storage
        romList.push(romFile.name);
        displayRoms();
        activeRom = romFile.name; // Set it as the active ROM
    };
    reader.readAsArrayBuffer(romFile); // Use readAsArrayBuffer for ROM data
}

// Display the list of uploaded ROMs
function displayRoms() {
    const romListDiv = document.getElementById('romList');
    romListDiv.innerHTML = '<h3>Available ROMs:</h3>';

    romList.forEach((romName) => {
        romListDiv.innerHTML += `
            <p>
                ${romName} 
                <button onclick="deleteRom('${romName}')">Delete</button>
                <button onclick="setActiveRom('${romName}')">Select</button>
            </p>`;
    });
}

// Set the selected ROM
function setActiveRom(romName) {
    activeRom = romName;
    alert(`Selected ROM: ${romName}`);
}

// Delete a ROM
function deleteRom(romName) {
    localStorage.removeItem(romName);
    const index = romList.indexOf(romName);
    if (index > -1) {
        romList.splice(index, 1);
    }
    displayRoms();
    alert(`${romName} has been deleted.`);
}

// Load and run the selected game
function loadGame() {
    if (!activeRom) {
        alert("Please select a ROM to play.");
        return;
    }

    const romData = localStorage.getItem(activeRom);
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = ''; // Clear previous game

    if (romData) {
        if (!emulator) {
            // Initialize the emulator
            emulator = new EmulatorJS.GameBoyAdvance(gameArea, {
                // EmulatorJS configuration options
                onLoad: () => console.log("Game loaded!"),
                onError: (error) => console.error("Error: ", error),
            });
        }
        emulator.loadROM(new Uint8Array(romData)); // Load the ROM as Uint8Array
        emulator.start(); // Start the emulator
    } else {
        alert("ROM data not found.");
    }
}

// Call to load existing ROMs on page load
window.onload = () => {
    // Load saved ROMs from local storage
    for (let i = 0; i < localStorage.length; i++) {
        const romName = localStorage.key(i);
        if (romName.endsWith('.gba')) {
            romList.push(romName);
        }
    }
    displayRoms();
};
