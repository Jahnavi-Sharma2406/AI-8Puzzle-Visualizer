
const defaultInitial = [1, 2, 3, 4, 5, 6, 7, 0, 8];
const defaultGoal = [1, 2, 3, 4, 5, 6, 7, 8, 0];

let solutionPath = [];
let currentStep = 0;
let searchStats = { generated: 0, expanded: 0 };

function createInputBoard(containerId, values) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    values.forEach((value, index) => {
        const input = document.createElement("input");
        input.className = "board-input";
        input.type = "number";
        input.min = "0";
        input.max = "8";
        input.value = value;
        input.setAttribute("aria-label", `Tile ${index + 1}`);
        container.appendChild(input);
    });
}

function readBoard(containerId) {
    const inputs = [
        ...document.querySelectorAll(`#${containerId} input`)
    ];
    const values = inputs.map(input => Number(input.value));

    const valid = values.length === 9 &&
        values.every(Number.isInteger) &&
        [...values].sort((a, b) => a - b).every((n, i) => n === i);

    if (!valid) {
        throw new Error("Each board must contain 0–8 exactly once.");
    }

    return values;
}

function boardKey(board) {
    return board.join("");
}

function isSolvable(start, goal) {
    function inversions(board) {
        const nums = board.filter(n => n !== 0);
        let count = 0;

        for (let i = 0; i < nums.length; i++) {
            for (let j = i + 1; j < nums.length; j++) {
                if (nums[i] > nums[j]) count++;
            }
        }

        return count;
    }

    return inversions(start) % 2 === inversions(goal) % 2;
}

function getNeighbors(board) {
    const blank = board.indexOf(0);
    const row = Math.floor(blank / 3);
    const col = blank % 3;

    // This order makes the right-hand move explored first.
    const moves = [
        [row, col + 1],
        [row + 1, col],
        [row, col - 1],
        [row - 1, col]
    ];

    const neighbors = [];

    for (const [r, c] of moves) {
        if (r < 0 || r > 2 || c < 0 || c > 2) continue;

        const next = [...board];
        const position = r * 3 + c;

        [next[blank], next[position]] =
            [next[position], next[blank]];

        neighbors.push(next);
    }

    return neighbors;
}

function dfs(start, goal) {
    const stack = [{
        board: start,
        path: [start]
    }];

    const visited = new Set([boardKey(start)]);
    let generated = 1;
    let expanded = 0;
    const maxNodes = 100000;

    while (stack.length > 0 && expanded < maxNodes) {
        const node = stack.pop();
        expanded++;

        if (boardKey(node.board) === boardKey(goal)) {
            return {
                path: node.path,
                generated,
                expanded,
                found: true
            };
        }

        const neighbors = getNeighbors(node.board);

        // Reverse insertion so the first neighbor is explored first.
        for (const next of [...neighbors].reverse()) {
            const key = boardKey(next);

            if (!visited.has(key)) {
                visited.add(key);
                generated++;

                stack.push({
                    board: next,
                    path: [...node.path, next]
                });
            }
        }
    }

    return {
        path: [],
        generated,
        expanded,
        found: false
    };
}

function renderBoard(containerId, board) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    board.forEach(number => {
        const tile = document.createElement("div");
        tile.className = number === 0 ? "tile empty" : "tile";
        tile.textContent = number === 0 ? "" : number;
        container.appendChild(tile);
    });
}

function showStep() {
    if (solutionPath.length === 0) return;

    const board = solutionPath[currentStep];
    renderBoard("currentBoard", board);

    document.getElementById("stepLabel").textContent =
        `Step ${currentStep} of ${solutionPath.length - 1}`;

    document.getElementById("searchDetails").textContent =
        `Current state: ${boardKey(board)}. ` +
        `Path cost: ${currentStep}. ` +
        `Parent: ${currentStep === 0
            ? "None (initial state)"
            : boardKey(solutionPath[currentStep - 1])}.`;

    document.getElementById("prevBtn").disabled = currentStep === 0;
    document.getElementById("nextBtn").disabled =
        currentStep === solutionPath.length - 1;
}

function updateStats(result) {
    document.getElementById("generated").textContent = result.generated;
    document.getElementById("expanded").textContent = result.expanded;
    document.getElementById("depth").textContent =
        result.found ? result.path.length - 1 : "—";
    document.getElementById("cost").textContent =
        result.found ? result.path.length - 1 : "—";
}

function runSolver() {
    const status = document.getElementById("status");

    try {
        const start = readBoard("initialInput");
        const goal = readBoard("goalInput");

        if (!isSolvable(start, goal)) {
            throw new Error("This initial state cannot reach the selected goal.");
        }

        status.textContent = "Running DFS...";

        const result = dfs(start, goal);
        searchStats = result;
        updateStats(result);

        if (!result.found) {
            solutionPath = [];
            currentStep = 0;
            status.textContent =
                "No solution found within the search limit. Try a simpler puzzle.";
            document.getElementById("currentBoard").innerHTML = "";
            document.getElementById("stepLabel").textContent = "No solution";
            document.getElementById("searchDetails").textContent =
                "DFS reached its node limit.";
            return;
        }

        solutionPath = result.path;
        currentStep = 0;
        showStep();

        status.textContent =
            `Solution found in ${result.path.length - 1} moves.`;
    } catch (error) {
        status.textContent = error.message;
    }
}

document.getElementById("solveBtn").addEventListener("click", runSolver);

document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentStep < solutionPath.length - 1) {
        currentStep++;
        showStep();
    }
});

document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentStep > 0) {
        currentStep--;
        showStep();
    }
});

document.getElementById("resetBtn").addEventListener("click", () => {
    currentStep = 0;
    if (solutionPath.length) showStep();
});

document.getElementById("randomBtn").addEventListener("click", () => {
    let board;

    do {
        board = [...defaultGoal];

        for (let i = board.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [board[i], board[j]] = [board[j], board[i]];
        }
    } while (!isSolvable(board, defaultGoal));

    createInputBoard("initialInput", board);
    document.getElementById("status").textContent =
        "New solvable puzzle generated. Click Run DFS.";
});

createInputBoard("initialInput", defaultInitial);
createInputBoard("goalInput", defaultGoal);
renderBoard("currentBoard", defaultInitial);
