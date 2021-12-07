const fs = require("fs");
const path = require("path");
const assert = require("assert");

process.chdir(__dirname);

const input = fs.readFileSync("input.txt").toString().split(",").map(Number);

// PART 1
(function () {
	console.group("part 1");

	let ages = [...input];

	const DAYS = 80;
	for (let d = 0; d < DAYS; d++) {
		const newFish = [];

		for (let i = 0; i < ages.length; i++) {
			if (ages[i] === 0) {
				ages[i] = 6;
				newFish.push(8);
			} else if (ages[i] > 0) {
				ages[i] = ages[i] - 1;
			}
		}

		ages = [...ages, ...newFish];
	}

	// assert.equal(ages.length, 389726);
	console.log(
		`answer -> after ${DAYS} days there are ${ages.length} lanternfish`
	);

	console.groupEnd();
})();

// PART 2
(function () {
	console.group("part 2");

	const ages = input.reduce((ageDistribution, age) => {
		ageDistribution[age] += 1;
		return ageDistribution;
	}, Array(9).fill(0));

	const DAYS = 256;
	for (let d = 0; d < DAYS; d++) {
		const newFishCount = ages.shift();
		ages[6] += newFishCount;
		ages.push(newFishCount);
	}

	const populationCount = ages.reduce((a, b) => a + b, 0);

	// assert.equal(populationCount, 1743335992042);
	console.log(
		`answer -> after ${DAYS} days there are ${populationCount} lanternfish`
	);

	console.groupEnd();
})();
