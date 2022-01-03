const fs = require("fs");
const path = require("path");
const assert = require("assert");

process.chdir(__dirname);

const input = fs.readFileSync("input.txt").toString();
const lines = input.split("\n").filter((line) => line !== "\n");

const polymerTemplate = lines[0];
const insertionRules = lines
	.slice(2)
	.reduce(
		(rules, rule) =>
			rules.set(rule.split(" -> ")[0], rule.split(" -> ")[1]),
		new Map()
	);

function performInsertion(pairs, counter, rules) {
	const newPairs = {};

	Object.keys(pairs).forEach((key) => {
		const newChar = rules.get(key);
		const newLeftPair = key[0] + newChar;
		const newRightPair = newChar + key[1];

		newPairs[newLeftPair] = (newPairs[newLeftPair] ?? 0) + pairs[key];
		newPairs[newRightPair] = (newPairs[newRightPair] ?? 0) + pairs[key];
		counter[newChar] = (counter[newChar] ?? 0) + pairs[key];
	});

	return newPairs;
}

function getPairs(polymer) {
	return polymer.split("").reduce((counts, char, idx, thisArr) => {
		if (idx < thisArr.length - 1) {
			counts = Object.assign(counts, {
				[char + thisArr[idx + 1]]:
					(counts[char + thisArr[idx + 1]] ?? 0) + 1,
			});
		}

		return counts;
	}, {});
}

function getCounter(polymer) {
	return polymer.split("").reduce((counts, char, idx, thisArr) => {
		return Object.assign(counts, {
			[char]: (counts[char] ?? 0) + 1,
		});
	}, {});
}

// PART 1
(function () {
	console.group("part 1");

	let input = polymerTemplate.slice(0);
	let pairs = getPairs(input);
	let counter = getCounter(input);
	const STEPS = 10;

	for (let i = 1; i <= STEPS; i++) {
		pairs = performInsertion(pairs, counter, insertionRules);
	}

	const max = Math.max(...Object.values(counter));
	const min = Math.min(...Object.values(counter));

	console.log(`after ${STEPS} steps`);
	console.log(`max(${max}) - min(${min}) = ${max - min}`);

	console.groupEnd();
})();

// PART 2
(function () {
	console.group("part 2");

	let input = polymerTemplate.slice(0);
	let pairs = getPairs(input);
	let counter = getCounter(input);
	const STEPS = 40;

	for (let i = 1; i <= STEPS; i++) {
		pairs = performInsertion(pairs, counter, insertionRules);
	}

	const max = Math.max(...Object.values(counter));
	const min = Math.min(...Object.values(counter));

	console.log(`after ${STEPS} steps`);
	console.log(`max(${max}) - min(${min}) = ${max - min}`);

	console.groupEnd();
})();
