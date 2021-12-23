const fs = require("fs");
const path = require("path");
const assert = require("assert");

process.chdir(__dirname);

const input = fs.readFileSync("input.txt").toString();
const lines = input.split("\n").filter((line) => line !== "\n");

class Graph {
	constructor() {
		this.adjacents = new Map();
	}

	addNode(v) {
		this.adjacents.set(v, []);
	}

	addEdge(src, dest) {
		this.adjacents.get(src).push(dest);
		this.adjacents.get(dest).push(src);
	}

	walk(
		origin,
		destination,
		/**
		 * visits = the number of times small cave nodes are allowed to be visited
		 * numberOfNodes = the number of small cave nodes that are allowed to be visited `visits` times
		 * i.e.
		 * 		{visits: 1, numberOfNodes: "all"} - all nodes can be visited once
		 * 		{visits: 2, numberOfNodes: 1} - one node can be visited twice, all others only once
		 */
		smallCaveStrategy = { visits: 1, numberOfNodes: "all" }
	) {
		let validPaths = [];
		let workingSet = [origin];
		let incompletePaths = workingSet.filter(
			(p) => isPathComplete(p) === false
		);

		// keep going until we've determined all paths are invalid or complete
		while (incompletePaths.length > 0) {
			const nextWorkingSet = [];

			for (let p = 0; p < workingSet.length; p++) {
				// this path is already complete, do nothing
				if (isPathComplete(workingSet[p])) {
					continue;
				}

				// get all nodes adjacent to the last one in the path
				const nodes = workingSet[p].split(",");
				const lastNode = nodes[nodes.length - 1];
				const adjacents = this.adjacents.get(lastNode);

				// add each next adjacent node to the path
				for (let a = 0; a < adjacents.length; a++) {
					nextWorkingSet.push(workingSet[p] + "," + adjacents[a]);
				}
			}

			// exclude all invalid paths, according to our chosen strategy
			workingSet = nextWorkingSet.filter((path) =>
				isValidPath(path, smallCaveStrategy)
			);

			// remaining paths that haven't ended are our new working set
			incompletePaths = workingSet.filter(
				(p) => isPathComplete(p) === false
			);

			// paths which are now complete go into the final result set
			validPaths = workingSet
				.filter((p) => isPathComplete(p))
				.concat(validPaths);
		}

		return validPaths;
	}

	print() {
		// get all the nodes
		const keys = this.adjacents.keys();

		// iterate over the nodes
		for (let i of keys) {
			// great the corresponding adjacency list
			// for the node
			const values = this.adjacents.get(i);
			let concatenated = "";

			// iterate over the adjacency list
			// concatenate the values into a string
			for (let j of values) {
				concatenated += j + " ";
			}

			// print the node and its adjacency list
			console.log(i + " -> " + concatenated);
		}
	}
}

// helpers
function isPathComplete(path) {
	return path.substring(path.length - 3) === "end";
}

function isValidPath(path, smallCaveStrategy) {
	let isValid =
		path.indexOf("start") === path.lastIndexOf("start") &&
		path.indexOf("end") === path.lastIndexOf("end");

	const nodeCounts = path.split(",").reduce(
		(nodeCounts, n) =>
			Object.assign(nodeCounts, {
				[n]: nodeCounts[n.toLowerCase()]
					? (nodeCounts[n.toLowerCase()] += 1)
					: (nodeCounts[n] = 1),
			}),
		{}
	);

	const invalidNodeOccurences = Object.keys(nodeCounts).filter(
		(key) => nodeCounts[key] > smallCaveStrategy.visits
	);

	if (invalidNodeOccurences.length > 0) {
		isValid = false;
	}

	const repeatedNodes =
		typeof smallCaveStrategy.numberOfNodes === "number"
			? Object.keys(nodeCounts).filter(
					(key) => nodeCounts[key] === smallCaveStrategy.visits
			  )
			: null;

	if (
		repeatedNodes !== null &&
		repeatedNodes.length > smallCaveStrategy.numberOfNodes
	) {
		isValid = false;
	}

	return isValid;
}

function createGraph(inputLines) {
	const nodes = inputLines.flatMap((line) => line.split("-"));
	const uniqueNodes = Array.from(new Set(nodes));

	const graph = new Graph();

	uniqueNodes.forEach((n) => graph.addNode(n));
	inputLines.forEach((line) => {
		const [n1, n2] = line.split("-");
		graph.addEdge(n1, n2);
	});

	return graph;
}

// PART 1
(function () {
	console.group("part 1");

	const graph = createGraph(lines);
	// graph.print();

	console.time("walk duration");
	const paths = graph.walk("start", "end");
	console.timeEnd("walk duration");

	console.log(`answer -> ${paths.length}`);
	assert.equal(paths.length, 5920);

	console.groupEnd();
})();

// PART 2
(function () {
	console.group("part 2");

	const graph = createGraph(lines);
	// graph.print();

	console.time("walk duration");
	const paths = graph.walk("start", "end", { visits: 2, numberOfNodes: 1 });
	console.timeEnd("walk duration");

	console.log(`answer -> ${paths.length}`);
	assert.equal(paths.length, 155477);

	console.groupEnd();
})();
