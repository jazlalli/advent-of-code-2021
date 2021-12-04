const fs = require("fs");
const path = require("path");

process.chdir(__dirname);

const input = fs.readFileSync("input.txt").toString();
const lines = input.split("\n").filter((line) => line !== "\n");

// const testInput = [
// 	"forward 5",
// 	"down 5",
// 	"forward 8",
// 	"up 3",
// 	"down 8",
// 	"forward 2",
// ];

// PART 1
(function () {
	console.group("part 1");
	let depth = 0,
		horizontal = 0;

	const commands = lines.map((line) => line.split(" "));
	commands.forEach((cmd) => {
		const direction = cmd[0];
		const scalar = Number(cmd[1]);
		if (direction === "forward") horizontal += scalar;
		if (direction === "down") depth += scalar;
		if (direction === "up") depth -= scalar;
	});

	console.log(`horizontal: ${horizontal}, depth: ${depth}`);
	console.log(`horizontal × depth = ${horizontal * depth}`);

	console.groupEnd();
})();

// PART 2
(function () {
	console.group("part 2");

	let depth = 0,
		horizontal = 0,
		aim = 0;

	const commands = lines.map((line) => line.split(" "));
	commands.forEach((cmd) => {
		const direction = cmd[0];
		const scalar = Number(cmd[1]);
		if (direction === "forward") {
			horizontal += scalar;
			depth += aim * scalar;
		}
		if (direction === "down") aim += scalar;
		if (direction === "up") aim -= scalar;
	});

	console.log(`horizontal: ${horizontal}, depth: ${depth}, aim: ${aim}`);
	console.log(`horizontal × depth = ${horizontal * depth}`);

	console.groupEnd();
})();
