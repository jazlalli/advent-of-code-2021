const fs = require("fs");
const path = require("path");

process.chdir(__dirname);

const input = fs.readFileSync("input.txt").toString();
const lines = input
	.split("\n")
	.filter((line) => line !== "\n" && Boolean(line));

const coordinates = lines.filter((l) => l.indexOf("fold") === -1);
const folds = lines.filter((l) => l.indexOf("fold") > -1);

function createGrid(coords) {
	const xMax =
		coords
			.flatMap((c) => c.split(",")[0])
			.map(Number)
			.sort((a, b) => b - a)[0] + 1;
	const yMax =
		coords
			.flatMap((c) => c.split(",")[1])
			.map(Number)
			.sort((a, b) => b - a)[1] + 1;

	const grid = Array(yMax).fill(".".repeat(xMax));
	const dotPositions = new Set(coords);

	for (let x = 0; x < xMax; x++) {
		for (let y = 0; y < yMax; y++) {
			if (dotPositions.has(`${x},${y}`)) {
				const positions = grid[y].split("");
				positions[x] = "#";
				grid[y] = positions.join("");
			}
		}
	}

	return grid;
}

function getFoldInstructions(instructions) {
	const folds = new Map();
	instructions.forEach((line, idx) => {
		folds.set(idx, line.replace(/^(fold\salong\s)/, ""));
	});

	return folds;
}

function yFold(grid, yIndex) {
	const upper = grid.filter((line, idx) => idx < yIndex);
	const lower = grid.filter((line, idx) => idx > yIndex);
	lower.reverse();

	grid = upper.map((line, lineIdx) => {
		const upperChars = line.split("");
		const lowerChars = lower[lineIdx].split("");
		const newLine = upperChars.map((char, charIdx) =>
			char === "#" ? "#" : lowerChars[charIdx] === "#" ? "#" : "."
		);

		return newLine.join("");
	});

	return grid;
}

function xFold(grid, xIndex) {
	grid = grid.map((line) => {
		const [left, right] = [
			line.substring(0, xIndex).split(""),
			line.substring(xIndex + 1).split(""),
		];

		left.reverse();

		const newLine = left.map((char, charIdx) =>
			char === "#" ? "#" : right[charIdx] === "#" ? "#" : "."
		);

		return newLine.join("");
	});

	return grid;
}

function fold(grid, foldInstructions, numberOfFolds) {
	for (let [idx, instruction] of foldInstructions) {
		if (numberOfFolds !== undefined && idx > numberOfFolds - 1) continue;

		if (instruction.indexOf("y=") === 0) {
			const yIdx = Number(instruction.replace("y=", ""));
			grid = yFold(grid, yIdx);
		}

		if (instruction.indexOf("x=") === 0) {
			const xIdx = Number(instruction.replace("x=", ""));
			grid = xFold(grid, xIdx);
		}
	}

	return grid;
}

// PART 1
(function () {
	console.group("part 1");

	let grid = createGrid(coordinates);
	const foldInstructions = getFoldInstructions(folds);
	const NUMBER_OF_FOLDS = 1;

	grid = fold(grid, foldInstructions, NUMBER_OF_FOLDS);

	const visibleDots = grid
		.join("")
		.split("")
		.filter((char) => char === "#").length;

	console.log(`dot count after ${NUMBER_OF_FOLDS} fold -> ${visibleDots}`);
	console.groupEnd();
})();

// PART 2
(function () {
	console.group("part 2");

	let grid = createGrid(coordinates);
	const foldInstructions = getFoldInstructions(folds);

	grid = fold(grid, foldInstructions);
	grid = grid.map((line) => line.split("").reverse().join(""));

	console.log(grid);
	console.groupEnd();
})();
