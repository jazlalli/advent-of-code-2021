const fs = require("fs");
const path = require("path");

process.chdir(__dirname);

const input = fs.readFileSync("input.txt").toString();
const lines = input
	.split("\n")
	.filter((line) => line !== "\n")
	.filter(Boolean);

// [,
// 	[ [startX, startY], [endX, endY] ],
// 	[ [startX, startY], [endX, endY] ],
// ]
const allCoordTuples = lines
	.map((ends) => ends.split(" -> "))
	.map((startEnd) => startEnd.map((coord) => coord.split(",").map(Number)));

function constructVentMap() {
	const allCoords = lines.flatMap((line) => line.split(" -> "));

	const maxX = allCoords
		.flatMap((coord) => coord.split(",")[0])
		.sort((a, b) => b - a)[0];

	const maxY = allCoords
		.flatMap((coord) => coord.split(",")[1])
		.sort((a, b) => b - a)[0];

	const origin = [0, 0];
	const max = [Number(maxX), Number(maxY)];

	const map = [];
	for (let x = origin[0]; x <= max[0]; x++) {
		const row = [];
		for (let y = origin[1]; y <= max[1]; y++) {
			row.push(".");
		}
		map.push(row);
	}

	return map;
}

function isHorizontalOrVerticalLine(start, end) {
	return start[0] === end[0] || start[1] === end[1];
}

function is45DegreeDiagonal(start, end) {
	return (
		(start[0] === start[1] && end[0] === end[1]) ||
		(start[0] === end[1] && start[1] === end[0]) ||
		Math.abs(start[0] - end[0]) === Math.abs(start[1] - end[1])
	);
}

function markHorizontalOrVerticalLine(map, start, end) {
	// sort coords by smallest first
	if (start[0] > end[0]) {
		const temp = end[0];
		end[0] = start[0];
		start[0] = temp;
	} else if (start[1] > end[1]) {
		const temp = end[1];
		end[1] = start[1];
		start[1] = temp;
	}

	for (let x = start[0]; x <= end[0]; x++) {
		for (let y = start[1]; y <= end[1]; y++) {
			if (map[y][x] === ".") {
				map[y][x] = "1";
			} else {
				map[y][x] = "X";
			}
		}
	}

	return map;
}

function markDiagonalLine(map, start, end) {
	const sortCoords = (start, end) =>
		start[0] > end[0] ? [end, start] : [start, end];

	// coords where x = y e.g. [3,3] -> [6,6]
	if (start[0] === start[1] && end[0] === end[1]) {
		// sort coords by smallest first
		[start, end] = sortCoords(start, end);

		for (let x = start[0]; x <= end[0]; x++) {
			if (map[x][x] === ".") {
				map[x][x] = "1";
			} else {
				map[x][x] = "X";
			}
		}

		return map;
	}

	// coords where x1 - x2 === y1 - y2
	if (Math.abs(start[0] - end[0]) === Math.abs(start[1] - end[1])) {
		// sort coords by smallest first
		[start, end] = sortCoords(start, end);

		if (start[0] < end[0] && start[1] < end[1]) {
			for (let x = start[0], y = start[1]; x <= end[0], y <= end[1]; x++, y++) {
				if (map[y][x] === ".") {
					map[y][x] = "1";
				} else {
					map[y][x] = "X";
				}
			}
		}

		if (start[0] < end[0] && start[1] > end[1]) {
			for (let x = start[0], y = start[1]; x <= end[0], y >= end[1]; x++, y--) {
				if (map[y][x] === ".") {
					map[y][x] = "1";
				} else {
					map[y][x] = "X";
				}
			}
		}

		return map;
	}

	return map;
}

function markVentLine(map, start, end, includeDiagonals = false) {
	if (isHorizontalOrVerticalLine(start, end)) {
		return markHorizontalOrVerticalLine(map, start, end);
	}

	if (includeDiagonals && is45DegreeDiagonal(start, end)) {
		return markDiagonalLine(map, start, end);
	}

	return map;
}

function printMap(map) {
	console.log();
	map.forEach((line) => console.log(line.join(" ")));
	console.log();
}

// PART 1
(function () {
	console.group("part 1");

	let ventMap = constructVentMap();

	allCoordTuples.forEach(
		([lineStart, lineEnd]) =>
			(ventMap = markVentLine(ventMap, lineStart, lineEnd))
	);

	const overlaps = ventMap.flatMap((row) =>
		row.filter((point) => point === "X")
	);

	// printMap(ventMap);

	console.log(`answer -> ${overlaps.length}`);

	console.groupEnd();
})();

// PART 2
(function () {
	console.group("part 2");

	const includeDiagonals = true;
	let ventMap = constructVentMap();

	allCoordTuples.forEach(
		([lineStart, lineEnd], idx) =>
			(ventMap = markVentLine(ventMap, lineStart, lineEnd, includeDiagonals))
	);

	const overlaps = ventMap.flatMap((row) =>
		row.filter((point) => point === "X")
	);

	// printMap(ventMap);

	console.log(`answer -> ${overlaps.length}`);

	console.groupEnd();
})();
