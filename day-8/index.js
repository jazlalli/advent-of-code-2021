const fs = require("fs");
const path = require("path");
const assert = require("assert");

process.chdir(__dirname);

const input = fs.readFileSync("input.txt").toString();
const lines = input.split("\n").filter((line) => line !== "\n");

const digitToSegmentCount = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6];

// PART 1
(function () {
	console.group("part 1");

	const outputValues = lines.flatMap((line) => line.split(" | ")[1]);
	const allOutputValues = outputValues.flatMap((value) => value.split(" "));
	const uniqueSegmentCounts = [1, 4, 7, 8].map(
		(digit) => digitToSegmentCount[digit]
	);

	const countOfUniqueSegmentDigits = allOutputValues.filter(
		(digit) => uniqueSegmentCounts.indexOf(digit.length) > -1
	);

	console.log(`answer -> ${countOfUniqueSegmentDigits.length}`);
	assert.equal(countOfUniqueSegmentDigits.length, 245);

	console.groupEnd();
})();

// PART 2
(function () {
	console.group("part 2");

	const uniqueSegmentCountToDigit = [1, 4, 7, 8].reduce(
		(acc, digit) => Object.assign(acc, { [digitToSegmentCount[digit]]: digit }),
		{}
	);

	function identifySegmentDigits(inputLine) {
		// pre-pad array to hold segment combinations -> digits
		const newDigitToSegments = Array(10).fill("");

		// unique segment combinations
		inputLine.split(" ").forEach((signal) => {
			const unique = uniqueSegmentCountToDigit[signal.length];

			if (unique) {
				newDigitToSegments[unique] = signal;
			}
		});

		let remaining = inputLine
			.split(" ")
			.filter((signal) => newDigitToSegments.indexOf(signal) === -1);

		// identify segments for number 3
		const three = remaining
			.filter((segment) => segment.length === 5)
			.filter((segment) => {
				const chars = newDigitToSegments[1].split("");
				return (
					chars.filter((char) => segment.includes(char)).length === chars.length
				);
			});
		newDigitToSegments[3] = three[0];
		remaining = remaining.filter((r) => r !== three[0]);

		// identify segments for number 5
		const five = remaining
			.filter((segment) => segment.length === 5)
			.filter((segment) => {
				const chars = newDigitToSegments[4].split("");
				return chars.filter((char) => segment.includes(char)).length === 3;
			});
		newDigitToSegments[5] = five[0];
		remaining = remaining.filter((r) => r !== five[0]);

		// identify segments for number 2
		const two = remaining.filter((segment) => segment.length === 5);
		newDigitToSegments[2] = two[0];
		remaining = remaining.filter((r) => r !== two[0]);

		// identify segments for number 0
		const zero = remaining.filter((segment) => {
			const chars = newDigitToSegments[5].split("");
			return chars.filter((char) => segment.includes(char)).length === 4;
		});
		newDigitToSegments[0] = zero[0];
		remaining = remaining.filter((r) => r !== zero[0]);

		// identify segments for number 0
		const nine = remaining.filter((segment) => {
			const chars = newDigitToSegments[4].split("");
			return (
				chars.filter((char) => segment.includes(char)).length === chars.length
			);
		});
		newDigitToSegments[9] = nine[0];
		remaining = remaining.filter((r) => r !== nine[0]);

		const six = remaining[0];
		newDigitToSegments[6] = six;
		remaining = remaining.filter((r) => r !== six);

		// make sure we've got everything
		assert.equal(remaining.length, 0);

		const sortedSegments = newDigitToSegments.map((segment) =>
			segment.split("").sort().join("")
		);

		return sortedSegments;
	}

	const allOutputDigits = [];
	const signalInputs = lines.flatMap((line) => line.split(" | ")[0]);
	const outputValues = lines.flatMap((line) => line.split(" | ")[1]);

	signalInputs.forEach((input, idx) => {
		const segmentDigits = identifySegmentDigits(input);
		const sortedOutputValues = outputValues[idx]
			.split(" ")
			.map((val) => val.split("").sort().join(""));

		const outputDigits = sortedOutputValues.map((value) =>
			segmentDigits.indexOf(value)
		);

		allOutputDigits.push(Number(outputDigits.join("")));
	});

	const answer = allOutputDigits.reduce((a, b) => a + b);
	console.log(`answer -> ${answer}`);
	assert.equal(answer, 983026);

	console.groupEnd();
})();
