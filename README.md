# AI 8-Puzzle Solver and Visualizer

An interactive web-based implementation of the classic 8-Puzzle problem using Artificial Intelligence search algorithms.

## Project Overview

The 8-Puzzle consists of a 3 × 3 grid containing eight numbered tiles and one empty space. The objective is to move the tiles until the initial configuration matches the goal configuration.

This project provides a visual interface for exploring the puzzle, understanding search algorithms, and comparing their theoretical properties.

## Features

- Interactive 8-Puzzle solver with initial and goal state configuration
- Random solvable puzzle generation
- Depth-First Search (DFS) implementation
- Step-by-step solution visualization
- Search statistics, including generated states, expanded states, solution depth, and path cost
- Information about BFS, DFS, DLS, IDDFS, GBFS, and A*
- Comparison table covering the properties of different search algorithms

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Bootstrap

## Project Structure

```text
AI-8Puzzle-Visualizer/
├── index.html
├── solver.html
├── algorithms.html
├── comparison.html
├── css/
│   └── style.css
├── js/
│   ├── script.js
│   └── solver.js
├── assets/
└── README.md
```

## How to Run

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using the Live Server extension.
4. Navigate to the solver, algorithm information, and comparison pages.

## Assigned Algorithm

**Depth-First Search (DFS)**

DFS explores a search path as deeply as possible before backtracking. In this project, it is implemented using a stack and a visited-state set to search for a solution to the 8-Puzzle.

DFS does not guarantee the shortest solution path. Its performance depends on the search order and the puzzle configuration.

## Learning Objectives

- Understand state-space search in Artificial Intelligence.
- Represent the 8-Puzzle as a search problem.
- Implement and visualize a search algorithm.
- Examine the differences between uninformed and informed search strategies.

## Author

VIT B.Tech Computer Science and Engineering student

## Academic Project

AI 8-Puzzle Solver and Visualizer
