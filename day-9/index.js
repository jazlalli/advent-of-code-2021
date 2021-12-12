const fs = require("fs");
const path = require("path");
const assert = require("assert");

process.chdir(__dirname);

const input = fs.readFileSync("input.txt").toString();
const lines = input.split("\n").filter((line) => line !== "\n");

function getAdjacentCoordinates(x, y, maxX, maxY) {
	const above = y > 0 ? y - 1 : null;
	const below = y < maxY ? y + 1 : null;
	const left = x > 0 ? x - 1 : null;
	const right = x < maxX ? x + 1 : null;

	const adjacent = [
		above !== null && [x, above].map(Number),
		below !== null && [x, below].map(Number),
		left !== null && [left, y].map(Number),
		right !== null && [right, y].map(Number),
	].filter(Boolean);

	return adjacent;
}

function findMinPoints(grid, returnCoordinates = false) {
	const minPoints = [];

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			const adjacent = getAdjacentCoordinates(
				x,
				y,
				grid[0].length - 1,
				grid.length - 1
			);

			const value = Number(grid[y][x]);
			if (adjacent.every((point) => grid[point[1]][point[0]] > value)) {
				if (returnCoordinates === true) {
					minPoints.push([x, y]);
				} else {
					minPoints.push(value);
				}
			}
		}
	}

	return minPoints;
}

function findBasinMembers(grid, currentPoint) {
	const maxX = grid[0].length - 1;
	const maxY = grid.length - 1;

	const basinMembers = [];

	const x = currentPoint[0];
	const y = currentPoint[1];
	const currentPointValue = grid[y][x];

	const adjacentCoordinates = getAdjacentCoordinates(x, y, maxX, maxY);
	adjacentCoordinates.forEach((point) => {
		if (
			grid[point[1]][point[0]] > currentPointValue &&
			grid[point[1]][point[0]] < 9
		) {
			basinMembers.push(point);
		}
	});

	return basinMembers;
}

// PART 1
(function () {
	console.group("part 1");
	const grid = lines.map((line) => line.split(""));

	const minPointValues = findMinPoints(grid);
	const risk = minPointValues.map((val) => val + 1).reduce((a, b) => a + b);

	console.log(`answer -> ${risk}`);
	assert.equal(risk, 545);

	console.groupEnd();
})();

// PART 2
(function () {
	console.group("part 2");
	const grid = lines.map((line) => line.split(""));

	const basinGroups = {};
	const minPointCoordinates = findMinPoints(grid, true);

	minPointCoordinates.forEach((point) => {
		// group all basin members by coordinate of the minimum point
		const basinKey = point.join(",");
		basinGroups[basinKey] = [point];

		// find valid adjacent basin members
		let newBasinMembers = findBasinMembers(grid, point);

		while (newBasinMembers.length > 0) {
			// gather the new members in the group
			basinGroups[basinKey] = basinGroups[basinKey].concat(newBasinMembers);

			// for each of the new members, repeat the adjacent search
			newBasinMembers = newBasinMembers.flatMap((member) =>
				findBasinMembers(grid, member)
			);

			// if we can't find anymore, stop
			if (newBasinMembers.length === 0) {
				break;
			}
		}
	});

	// deduplicate basin members and sort by descending size
	const basinSizes = Object.keys(basinGroups)
		.map((key) => new Set(basinGroups[key].map((point) => point.join(""))).size)
		.sort((a, b) => b - a);

	const sumOfThreeLargestBasinSizes =
		basinSizes[0] * basinSizes[1] * basinSizes[2];

	console.log(`answer -> ${sumOfThreeLargestBasinSizes}`);
	assert.equal(sumOfThreeLargestBasinSizes, 950600);

	console.groupEnd();
})();
