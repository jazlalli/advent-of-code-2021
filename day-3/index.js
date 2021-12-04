const fs = require("fs");
const path = require("path");

process.chdir(__dirname);

const input = fs.readFileSync("input.txt").toString();
const lines = input.split("\n").filter((line) => line !== "\n");

// const testInput = [
// 	"00100",
// 	"11110",
// 	"10110",
// 	"10111",
// 	"10101",
// 	"01111",
// 	"00111",
// 	"11100",
// 	"10000",
// 	"11001",
// 	"00010",
// 	"01010",
// ];

function transpose(arrayOfBinaryNums) {
	const bitsByPosition = new Map();

	for (let i = 0; i < arrayOfBinaryNums.length; i++) {
		const bits = arrayOfBinaryNums[i].split("");
		bits.forEach((bit, idx) => {
			if (i === 0) {
				bitsByPosition.set(idx, [bit]);
			} else {
				bitsByPosition.get(idx).push(bit);
			}
		});
	}

	return bitsByPosition;
}

function countBits(arrayOfBits) {
	const bitCount = arrayOfBits.reduce(
		(count, bit) =>
			bit === "0" ? [count[0] + 1, count[1]] : [count[0], count[1] + 1],
		[0, 0]
	);

	// returns tuple of [countOfZeros, countOfOnes]
	return bitCount;
}

function reduceByPositionsDominantBit(arrayOfBinaryNums, comparator) {
	let result = [...arrayOfBinaryNums];

	for (let i = 0; i < result[0].length; i++) {
		const bits = transpose(result).get(i);
		const [zeros, ones] = countBits(bits);

		if (comparator(zeros, ones)) {
			// zero most common
			result = result.filter((value) => value[i] === "0");
		} else {
			// equal or one most common
			result = result.filter((value) => value[i] === "1");
		}

		if (result.length === 1) return result[0];
	}
}

// PART 1
(function () {
	console.group("part 1");

	let gamma = "",
		epsilon = "";

	for (let bits of transpose(lines).values()) {
		const [zeros, ones] = countBits(bits);

		if (zeros > ones) {
			gamma += "0";
			epsilon += "1";
		} else {
			gamma += "1";
			epsilon += "0";
		}
	}

	const decimalGamma = parseInt(gamma, 2);
	const decimalEpsilon = parseInt(epsilon, 2);

	console.log(`gamma: ${gamma} -> ${decimalGamma}`);
	console.log(`epsilon: ${epsilon} -> ${decimalEpsilon}`);
	console.log(`power = ${decimalGamma * decimalEpsilon}`);

	console.groupEnd();
})();

// PART 2
(function () {
	console.group("part 2");

	const oxygen = reduceByPositionsDominantBit(
		lines,
		(zeros, ones) => zeros > ones
	);

	const co2 = reduceByPositionsDominantBit(
		lines,
		(zeros, ones) => ones >= zeros
	);

	const decimalOxygen = parseInt(oxygen, 2);
	const decimalCO2 = parseInt(co2, 2);

	console.log(`oxygen: ${oxygen} -> ${decimalOxygen}`);
	console.log(`co2: ${co2} -> ${decimalCO2}`);
	console.log(`life support rating = ${decimalOxygen * decimalCO2}`);

	console.groupEnd();
})();
