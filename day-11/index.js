const fs = require("fs");
const path = require("path");
const assert = require("assert");

process.chdir(__dirname);

const input = fs.readFileSync("input.txt").toString();
const lines = input.split("\n").filter((line) => line !== "\n");

function printGrid(grid) {
	console.log(grid.join("\n"), "\n");
}

function getAdjacent(x, y) {
	const xMax = 9;
	const yMax = 9;

	const topLeft = x > 0 && y > 0 ? [x - 1, y - 1] : null;
	const topRight = x < xMax && y > 0 ? [x + 1, y - 1] : null;
	const bottomLeft = x > 0 && y < yMax ? [x - 1, y + 1] : null;
	const bottomRight = x < xMax && y < yMax ? [x + 1, y + 1] : null;

	const above = y > 0 ? y - 1 : null;
	const below = y < yMax ? y + 1 : null;
	const left = x > 0 ? x - 1 : null;
	const right = x < xMax ? x + 1 : null;

	const adjacent = [
		above !== null && [x, above].map(Number),
		below !== null && [x, below].map(Number),
		left !== null && [left, y].map(Number),
		right !== null && [right, y].map(Number),
		topLeft !== null && topLeft.map(Number),
		topRight !== null && topRight.map(Number),
		bottomLeft !== null && bottomLeft.map(Number),
		bottomRight !== null && bottomRight.map(Number),
	].filter(Boolean);

	return adjacent;
}

function cellKey(x, y) {
	return [x, y].join(",");
}

let FLASH_COUNT = 0;
function flash(grid, toFlash, haveFlashed) {
	let nines = [];

	toFlash.forEach(([x, y]) =>
		getAdjacent(x, y)
			.filter(([x, y]) => haveFlashed.has(cellKey(x, y)) === false)
			.forEach(([x, y]) => {
				const value = Number(grid[y][x]) + 1;

				if (value > 9) {
					grid[y][x] = 0;
					nines.push([x, y]);
					haveFlashed.add(cellKey(x, y));
					FLASH_COUNT++;
				} else {
					grid[y][x] = value;
				}
			})
	);

	return nines;
}

function modelEnergyLevels(grid) {
	let nines = [];
	let newGrid = [...grid];

	const haveFlashed = new Set();
	function hasFlashed(x, y) {
		return haveFlashed.has(cellKey(x, y));
	}

	for (let x = 0; x < 10; x++) {
		for (let y = 0; y < 10; y++) {
			const value = Number(grid[y][x]) + 1;

			if (value > 9 && hasFlashed(x, y) === false) {
				newGrid[y][x] = 0;
				nines.push([x, y]);
				haveFlashed.add(cellKey(x, y));
				FLASH_COUNT++;
			} else {
				newGrid[y][x] = value;
			}
		}
	}

	while (nines.length > 0) {
		nines = flash(newGrid, nines, haveFlashed);
	}

	return newGrid;
}

function areFlashesSynchronised(grid) {
	const cells = grid
		.map((line) => line.join(""))
		.join("")
		.split("")
		.map(Number);

	const uniqueCellValues = Array.from(new Set(cells));
	return uniqueCellValues.length === 1;
}

// PART 1
(function () {
	console.group("part 1");

	let grid = lines.map((line) => line.split("").map(Number));

	for (let i = 0; i < 100; i++) {
		grid = modelEnergyLevels(grid);
	}

	console.log(`answer -> ${FLASH_COUNT}`);

	// testInput
	// assert.equal(lines[0][0], "5");
	// assert.equal(lines[4][4], "3");
	// assert.equal(getAdjacent(4, 4).length, 8);
	// assert.equal(getAdjacent(0, 0).length, 3);
	// assert.equal(getAdjacent(0, 3).length, 5);

	console.groupEnd();
})();

// PART 2
(function () {
	console.group("part 2");

	let grid = lines.map((line) => line.split("").map(Number));
	let cycle = 0;
	let allSynchronised = false;

	while (allSynchronised === false) {
		cycle++;
		grid = modelEnergyLevels(grid);
		allSynchronised = areFlashesSynchronised(grid);

		if (allSynchronised) {
			break;
		}
	}

	console.log(`answer -> ${cycle}`);

	console.groupEnd();
})();
