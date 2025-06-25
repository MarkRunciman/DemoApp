import React, { useState } from "react";
import Board from "./components/Board";
import "./styles.css";

function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const currentSquares = history[stepNumber];

  function handlePlay(nextSquares) {
    const nextHistory = history.slice(0, stepNumber + 1).concat([nextSquares]);
    setHistory(nextHistory);
    setStepNumber(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextStep) {
    setStepNumber(nextStep);
    setXIsNext(nextStep % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    const description = move ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="app">
      <h1>Tic-Tac-Toe</h1>
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      <div className="history">
        <h3>History</h3>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export default App;