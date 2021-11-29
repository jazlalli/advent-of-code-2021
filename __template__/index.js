const fs = require("fs");
const path = require("path");

process.chdir(__dirname);

const input = fs.readFileSync("input.txt").toString();
const lines = input.split("\n").filter((line) => line !== "\n");

// PART 1
(function () {
	console.group("part 1");

	console.log("create your solution here");

	console.groupEnd();
})();

// PART 2
(function () {
	console.group("part 2");

	console.log("create your solution here");

	console.groupEnd();
})();
