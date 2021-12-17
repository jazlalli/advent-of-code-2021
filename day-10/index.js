const fs = require("fs");
const path = require("path");
const assert = require("assert");

process.chdir(__dirname);

const input = fs.readFileSync("input.txt").toString();
const lines = input.split("\n").filter((line) => line !== "\n");

const openingChars = "([{<";
const chunkChars = {
	"(": ")",
	"[": "]",
	"{": "}",
	"<": ">",
};

function findIllegalChar(line = "{([(<{}[<>[]}>{[]{[(<()>") {
	const chars = line.split("");
	const open = [];

	let illegalChar = null;

	chars.forEach((char, idx) => {
		if (openingChars.includes(char)) {
			open.push(char);
		} else {
			const latest = open.pop();
			if (char !== chunkChars[latest]) {
				illegalChar = char;
			}
		}
	});

	return illegalChar;
}

function completeLine(line = "[({(<(())[]>[[{[]{<()<>>") {
	const chars = line.split("");
	const open = [];

	chars.forEach((char, idx) => {
		if (openingChars.includes(char)) {
			open.push(char);
		} else {
			if (char === chunkChars[open[open.length - 1]]) {
				open.pop();
			}
		}
	});

	const completionChars = open
		.map((char) => chunkChars[char])
		.reverse()
		.join("");

	return completionChars;
}

// PART 1
(function () {
	console.group("part 1");

	const illegalCharPoints = {
		")": 3,
		"]": 57,
		"}": 1197,
		">": 25137,
	};

	const illegalChars = lines
		.map((line) => findIllegalChar(line))
		.filter(Boolean);
	const points = illegalChars
		.map((char) => illegalCharPoints[char])
		.reduce((a, b) => a + b);

	console.log(`answer -> ${points}`);

	// test input
	// assert.equal(illegalChars.length, 5);
	// assert.equal(points, 26397);

	console.groupEnd();
})();

// PART 2
(function () {
	console.group("part 2");

	const closingCharPoints = {
		")": 1,
		"]": 2,
		"}": 3,
		">": 4,
	};

	const incompleteLines = lines.filter(
		(line) => findIllegalChar(line) === null
	);

	const completionStrings = incompleteLines.map((line) => completeLine(line));
	const completionScores = completionStrings
		.map((str) =>
			str
				.split("")
				.map((char) => closingCharPoints[char])
				.reduce((total, score) => total * 5 + score, 0)
		)
		.sort((a, b) => a - b);

	const medianCompletionScore =
		completionScores[(completionScores.length - 1) / 2];

	console.log(`answer -> ${medianCompletionScore}`);

	// test input
	// assert.equal(completionString, "}}]])})]");
	// assert.equal(incompleteLines.length, 5);
	// assert.equal(completionScore, 288957);
	// assert.equal(medianCompletionScore, 288957);

	console.groupEnd();
})();
