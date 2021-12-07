const fs = require("fs");
const path = require("path");
const assert = require("assert");

process.chdir(__dirname);

const input = fs.readFileSync("input.txt").toString().split(",").map(Number);

function calculateMinFuelCost(positions, fuelCostStrategy) {
	positions.sort((a, b) => a - b);
	const fuelCosts = positions.map((pos, idx, thisArr) =>
		fuelCostStrategy(thisArr, pos)
	);

	let minFuel;
	for (let i = 0; i < fuelCosts.length; i++) {
		if (minFuel === undefined) {
			minFuel = fuelCosts[i];
		}

		if (fuelCosts[i] < minFuel) {
			minFuel = fuelCosts[i];
		}
	}

	return minFuel;
}

// PART 1
(function () {
	console.group("part 1");

	function calculateFuel(positions, targetPos) {
		return positions
			.map((pos) => Math.abs(pos - targetPos))
			.reduce((a, b) => a + b);
	}

	const minFuel = calculateMinFuelCost(input, calculateFuel);
	console.log(`answer -> total fuel spent = ${minFuel}`);
	// assert.equal(minFuel, 342534);

	console.groupEnd();
})();

// PART 2
(function () {
	console.group("part 2");

	function increasingFuelCost(distance) {
		let cost = 0;
		for (let i = 1; i <= distance; i++) {
			cost += i;
		}

		return cost;
	}

	function calculateFuelIncreasing(positions, targetPos) {
		return positions
			.map((pos) => increasingFuelCost(Math.abs(pos - targetPos)))
			.reduce((a, b) => a + b);
	}

	const minFuel = calculateMinFuelCost(input, calculateFuelIncreasing);
	console.log(`answer -> total fuel spent = ${minFuel}`);
	// assert.equal(minFuel, 94004208);

	console.groupEnd();
})();
