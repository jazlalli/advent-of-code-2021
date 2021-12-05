const fs = require("fs");
const path = require("path");
const assert = require("assert");

process.chdir(__dirname);

const input = fs.readFileSync("input.txt").toString();
const lines = input.split("\n\n");

const draw = lines.splice(0, 1)[0].split(",");
const boardsInput = lines.map((l) => l.split("\n"));

function constructBoards(boards) {
	// turn each board into a collection of its rows
	const boardsByRow = boards.reduce((boardMap, board, boardIdx) => {
		boardMap[boardIdx] = board.map((row) => row.trim().replace(/\s+/g, " "));

		return boardMap;
	}, {});

	// turn each board into a collection of its columns (above transposed)
	const boardsByColumn = boards.reduce((boardMap, board, boardIdx) => {
		boardMap[boardIdx] = board.map((row1, rowIdx) =>
			board
				.flatMap((row2) => row2.trim().replace(/\s+/g, " ").split(" ")[rowIdx])
				.join(" ")
		);

		return boardMap;
	}, {});

	return { byRow: boardsByRow, byColumn: boardsByColumn };
}

function matchNumberToBoards(currentNumber, boards) {
	if (boards === null) {
		throw new Error("Unknown board dimension");
	}

	// build matched numbers per board in here
	const matchedNumbersByBoard = {};
	// the boards which win with this currentNumber
	const winningBoards = [];

	// check all boards
	for (let [boardIdx, board] of Object.entries(boards)) {
		matchedNumbersByBoard[boardIdx] = {};

		// check each entry of the board (i.e. the rows/columns)
		for (let idx = 0; idx < board.length; idx++) {
			matchedNumbersByBoard[boardIdx] = { [idx]: [] };

			// find number in the current entry
			const match = board[idx]
				.split(" ")
				.filter((val) => val === currentNumber)
				.join("");

			if (match) {
				// capture the matching number on the relevant board and entry (row/column)
				if (matchedNumbersByBoard[boardIdx][idx].indexOf(match) === -1) {
					matchedNumbersByBoard[boardIdx][idx].push(match);
				}

				// remove the matched number from the row/column
				board[idx] = board[idx]
					.replace(new RegExp("\\b" + currentNumber + "\\b"), "")
					.trim();

				// BINGO! - we've encountered an empty row/column so capture the result
				if (board[idx] === "") {
					winningBoards.push({
						id: boardIdx,
						remainingNumbers: boards[boardIdx],
					});
				}
			}
		}
	}

	return winningBoards;
}

function calculateAndPrintAnswer(lastNumberCalled, winningBoard) {
	const remainingNumbers = winningBoard.remainingNumbers
		.filter(Boolean)
		.reduce(
			(remainder, entry) =>
				remainder.concat(entry.replace(/\s+/g, " ").split(" ").map(Number)),
			[]
		);

	const sumOfRemainingNumbers = remainingNumbers.reduce(
		(sum, num) => sum + num,
		0
	);

	const answer = sumOfRemainingNumbers * lastNumberCalled;

	console.group("\n✨✨BINGO✨✨\n-------------");
	console.log(`winning board\t-> ${winningBoard.id}`);
	console.log(`winning draw\t-> ${lastNumberCalled}`);
	console.log(`remaining numbers\t-> ${remainingNumbers}`);
	console.log(`sum of remaining\t-> ${sumOfRemainingNumbers}`);
	console.log(`${sumOfRemainingNumbers} × ${lastNumberCalled}\t\t-> ${answer}`);
	console.log();
	console.groupEnd();

	return answer;
}

// PART 1
(function () {
	console.group("part 1");
	console.log("lesssgoooo...");

	const boards = constructBoards(boardsInput);

	for (let i = 0; i < draw.length; i++) {
		const currentNumber = draw[i];
		console.log(`👉 draw no.${i} -> ${call(currentNumber)}`);

		// check all the rows
		const winningBoardRows = matchNumberToBoards(currentNumber, boards.byRow);
		// we found a winning row on a board, stop now
		if (winningBoardRows.length) {
			const answer = calculateAndPrintAnswer(
				currentNumber,
				winningBoardRows[0]
			);
			// assert.equal(answer, 55770);
			break;
		}

		// check all the columns
		const winningBoardColumns = matchNumberToBoards(
			currentNumber,
			boards.byColumn
		);
		// we found a winning column on a board, stop now
		if (winningBoardColumns.length) {
			const answer = calculateAndPrintAnswer(
				currentNumber,
				winningBoardColumns[0]
			);
			break;
		}
	}

	console.groupEnd();
})();

// PART 2
(function () {
	console.group("part 2");
	console.log("lesssgoooo again...");

	const boards = constructBoards(boardsInput);
	const allWinningBoardIds = new Set();

	for (let i = 0; i < draw.length; i++) {
		const currentNumber = draw[i];
		console.log(`👉 draw no.${i} -> ${call(currentNumber)}`);

		// check all the rows
		const winningBoardRows = matchNumberToBoards(currentNumber, boards.byRow);
		// if this board hasn't won already, register the win and print result
		if (winningBoardRows.length) {
			winningBoardRows.forEach((board) => {
				if (allWinningBoardIds.has(board.id) === false) {
					allWinningBoardIds.add(board.id);
					calculateAndPrintAnswer(currentNumber, board);
				}
			});
		}

		// check all the columns
		const winningBoardColumns = matchNumberToBoards(
			currentNumber,
			boards.byColumn
		);
		// if this board hasn't won already, register the win and print result
		if (winningBoardColumns.length) {
			winningBoardColumns.forEach((board) => {
				if (allWinningBoardIds.has(board.id) === false) {
					allWinningBoardIds.add(board.id);
					calculateAndPrintAnswer(currentNumber, board);
				}
			});
		}
	}

	// this prints every winning board, so the last one printed is the one to
	// choose. this code DOES NOT select the last board, which would be better
	// but we can get the right answer this way so...🤷

	console.groupEnd();
})();

function call(num) {
	switch (num) {
		case "1":
			return `Kelly’s eye, ${num}`;
		case "2":
			return `One little duck, ${num}`;
		case "3":
			return `Cup of tea, ${num}`;
		case "4":
			return `Knock at the door, ${num}`;
		case "5":
			return `Man alive, ${num}`;
		case "6":
			return `Half a dozen, ${num}`;
		case "7":
			return `Lucky number ${num}`;
		case "8":
			return `Garden gate, ${num}`;
		case "9":
			return `Doctor’s orders, ${num}`;
		case "10":
			return `Prime Minister’s den, ${num}`;
		case "11":
			return `Legs ${num}`;
		case "12":
			return `One dozen, ${num}`;
		case "13":
			return `Unlucky for some, ${num}`;
		case "14":
			return `Valentine’s Day, ${num}`;
		case "15":
			return `Young and keen, ${num}`;
		case "16":
			return `Sweet ${num}`;
		case "17":
			return `Dancing queen, ${num}`;
		case "19":
			return `Goodbye teens, ${num}`;
		case "20":
			return `One score, ${num}`;
		case "21":
			return `Royal salute, ${num}`;
		case "22":
			return `Two little ducks, ${num}`;
		case "23":
			return `Thee and me, ${num}`;
		case "24":
			return `Two dozen, ${num}`;
		case "25":
			return `Duck and dive, ${num}`;
		case "26":
			return `Pick and mix, ${num}`;
		case "27":
			return `Gateway to heaven, ${num}`;
		case "28":
			return `In a state, ${num}`;
		case "29":
			return `Rise and shine, ${num}`;
		case "30":
			return `Dirty Gertie, ${num}`;
		case "31":
			return `Get up and run, ${num}`;
		case "32":
			return `Buckle my shoe, ${num}`;
		case "33":
			return `Dirty knees, all the threes, ${num}`;
		case "34":
			return `Ask for more, ${num}`;
		case "35":
			return `Jump and jive, ${num}`;
		case "36":
			return `Three dozen, ${num}`;
		case "37":
			return `More than eleven, ${num}`;
		case "38":
			return `Christmas cake, ${num}`;
		case "39":
			return `39 steps, ${num}`;
		case "40":
			return `Life begins at, ${num}`;
		case "41":
			return `Time for fun, ${num}`;
		case "42":
			return `Winnie the Pooh, ${num}`;
		case "43":
			return `Down on your knees, ${num}`;
		case "44":
			return `Droopy drawers, ${num}`;
		case "45":
			return `Halfway there, ${num}`;
		case "46":
			return `Up to tricks, ${num}`;
		case "47":
			return `Four and seven, ${num}`;
		case "48":
			return `Four dozen, ${num}`;
		case "49":
			return `PC, ${num}`;
		case "50":
			return `Half a century, ${num}`;
		case "51":
			return `Tweak of the thumb, ${num}`;
		case "52":
			return `Danny La Rue, ${num}`;
		case "53":
			return `Stuck in a tree, ${num}`;
		case "54":
			return `Clean the floor, ${num}`;
		case "55":
			return `Snakes alive, ${num}`;
		case "56":
			return `Shotts Bus, ${num}`;
		case "57":
			return `Heinz varieties, ${num}`;
		case "58":
			return `Make them wait, ${num}`;
		case "59":
			return `Brighton Line, ${num}`;
		case "60":
			return `Five dozen, ${num}`;
		case "61":
			return `Baker’s bun, ${num}`;
		case "62":
			return `Tickety-boo, ${num}`;
		case "63":
			return `Tickle me ${num}`;
		case "64":
			return `Red raw, ${num}`;
		case "65":
			return `Old age pension, ${num}`;
		case "66":
			return `Clickety click, ${num}`;
		case "67":
			return `Stairway to heaven, ${num}`;
		case "68":
			return `Saving Grace, ${num}`;
		case "69":
			return `Favourite of mine, ${num}. Nice.`;
		case "70":
			return `Three score and ten, ${num}`;
		case "71":
			return `Bang on the drum, ${num}`;
		case "72":
			return `Six dozen, ${num}`;
		case "73":
			return `Queen bee, ${num}`;
		case "74":
			return `Hit the floor, ${num}`;
		case "75":
			return `Strive and strive, ${num}`;
		case "76":
			return `Trombones, ${num}`;
		case "77":
			return `Sunset strip, ${num}`;
		case "78":
			return `39 more steps, ${num}`;
		case "79":
			return `One more time, ${num}`;
		case "80":
			return `Eight and blank, ${num}`;
		case "81":
			return `Stop and run, ${num}`;
		case "82":
			return `Straight on through, ${num}`;
		case "83":
			return `Time for tea, ${num}`;
		case "84":
			return `Seven dozen, ${num}`;
		case "85":
			return `Staying alive, ${num}`;
		case "86":
			return `Between the sticks, ${num}`;
		case "87":
			return `Torquay in Devon, ${num}`;
		case "88":
			return `Two fat ladies, ${num}`;
		case "89":
			return `Nearly there, ${num}`;
		case "90":
			return `Top of the shop, ${num}`;
		default:
			return num;
	}
}
