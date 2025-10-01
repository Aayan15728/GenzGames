document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const consoleOutput = document.getElementById('console-output');
    const hackerConsole = document.getElementById('hacker-console');
    const hintMessage = document.getElementById('hint-message');
    const cursor = document.getElementById('cursor');

    const hackerCode = `
//===== INITIALIZING QUANTUM ENCRYPTION SYSTEM =====

class QuantumEncryption {
    constructor() {
        this.qubits = new Array(256);
        this.entangledPairs = new Map();
        this.initializeQuantumState();
    }

    initializeQuantumState() {
        console.log("[*] Initializing quantum state...");
        for (let i = 0; i < this.qubits.length; i++) {
            this.qubits[i] = this.createSuperposition();
        }
        console.log("[+] Quantum state initialized successfully");
    }

    createSuperposition() {
        // Create quantum superposition using Hadamard gate
        const amplitude = Math.sqrt(1/2);
        return {
            state0: { amplitude, phase: 0 },
            state1: { amplitude, phase: Math.PI }
        };
    }

    encryptMessage(message) {
        console.log("[*] Beginning quantum encryption process...");
        const quantumStates = this.messageToQuantumStates(message);
        this.applyQuantumGates(quantumStates);
        return this.performEntanglement(quantumStates);
    }
}

//===== SYSTEM INITIALIZATION =====
console.log("[*] Initializing quantum encryption system...");
const encryptor = new QuantumEncryption();

console.log("[*] Preparing secure quantum channel...");
const secureChannel = encryptor.initializeQuantumState();

console.log("[*] Starting encryption process...");
const message = "INITIATING_SECURE_QUANTUM_TRANSMISSION";
const encryptedData = encryptor.encryptMessage(message);

console.log("[+] Quantum encryption system fully operational");
console.log("[+] Secure quantum channel established");
console.log("[+] Ready for quantum-safe communication");
`;

    // Initialize variables
    let currentPosition = 0;
    const charactersPerKeypress = 3;
    let firstKeyPress = true;

    // Handle any key press
    document.addEventListener('keydown', () => {
        // Hide the hint message on first keypress
        if (firstKeyPress) {
            hintMessage.classList.add('hidden');
            firstKeyPress = false;
        }

        if (currentPosition < hackerCode.length) {
            // Find the next newline character
            let nextNewline = hackerCode.indexOf('\\n', currentPosition);
            let charsToAdd;
            
            if (nextNewline !== -1 && nextNewline - currentPosition < charactersPerKeypress) {
                // If we're close to a newline, add the whole line
                charsToAdd = nextNewline - currentPosition + 1;
            } else {
                charsToAdd = charactersPerKeypress;
            }

            const textToAdd = hackerCode.substring(
                currentPosition,
                currentPosition + charsToAdd
            );
            
            consoleOutput.textContent += textToAdd;
            currentPosition += charsToAdd;
            
            // Auto-scroll to bottom
            hackerConsole.scrollTop = hackerConsole.scrollHeight;
        } else {
            // Reset to beginning when reaching the end
            currentPosition = 0;
            consoleOutput.textContent = '';
        }
    });
});
