class TWAPCalculator {
    constructor(windowSize = 10) {
        this.closes = [];  // Array to store the closing prices
        this.windowSize = windowSize;  // Size of the window (10 in this case)
    }


    // Method to add a new close and calculate the TWAP
    addClose(newClose) {
        // Add new close to the array
        this.closes.push(newClose);

        // If we have more than the windowSize, remove the oldest close
        if (this.closes.length > this.windowSize) {
            this.closes.shift();  // Remove the first (oldest) element
        }

        // Calculate TWAP by averaging the closes
        const twap = this.calculateTWAP();
        return twap;
    }

    // Method to calculate TWAP
    calculateTWAP() {
        if (this.closes.length === 0) return 0;

        // Sum all the closes and divide by the number of closes
        const sum = this.closes.reduce((acc, close) => acc + close, 0);
        return sum / this.closes.length;
    }

    get tLength() {
        return this.closes.length;
    }

    toString() {
        return `TWAPCalculator with closes: ${JSON.stringify(this.closes)}`;
    }
}

export default TWAPCalculator;