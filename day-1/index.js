const fs = require("fs");
const path = require("path");

process.chdir(__dirname);

const file = fs.readFileSync("input.txt").toString();
const lines = file.split("\n").filter((line) => line !== "\n");
const input = lines.map((val) => Number(val));

// const testInput = [
// 	"199",
// 	"200",
// 	"208",
// 	"210",
// 	"200",
// 	"207",
// 	"240",
// 	"269",
// 	"260",
// 	"263",
// ];

// PART 1
(function () {
	console.group("part 1");

	const diffs = input.map((num, idx, arr) => num - arr[idx + 1]);
	const increases = diffs.filter((d) => d < 0);

	console.log("no. of increases", increases.length);

	console.groupEnd();
})();

// PART 2
(function () {
	console.group("part 2");

	const slidingWindowSums = input.map((num, idx, arr) => {
		let residents = [num];

		if (idx === 0) {
			residents.push(arr[idx + 1]);
			residents.push(arr[idx + 2]);
		} else if (idx === arr.length - 1) {
			residents.push(arr[idx - 1]);
			residents.push(arr[idx - 2]);
		} else {
			residents.push(arr[idx - 1]);
			residents.push(arr[idx + 1]);
		}

		return residents[0] + residents[1] + residents[2];
	});

	const diffs = slidingWindowSums.map((num, idx, arr) => num - arr[idx + 1]);
	const increases = diffs.filter((d) => d < 0);

	console.log("no. of increases", increases.length);

	console.groupEnd();
})();
