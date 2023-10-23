import { useState } from "react";

function Square({ value, onSquareClick, isWinnerSquare }) {
  const squareClass = isWinnerSquare
    ? "square winning-square"
    : value === "X"
    ? "square X"
    : "square O";
  return (
    <button className={squareClass} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winnerInfo = caculateWinner(squares);
  const winningSquares = winnerInfo ? winnerInfo.line : null;

  function reSquare(i) {
    const isWinnerSquare = winningSquares && winningSquares.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        isWinnerSquare={isWinnerSquare}
        onSquareClick={() => handleClick(i)}
      />
    );
  }

  function handleClick(i) {
    if (squares[i] || caculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  const winner = caculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner.winner;
  } else if (Array.isArray(squares) && squares.every((square) => square)) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const rowBoard = [];

  for (var row = 0; row < 3; ++row) {
    const rowSquares = [];
    for (var col = 0; col < 3; ++col) {
      rowSquares.push(reSquare(row * 3 + col));
    }
    rowBoard.push(
      <div className="board-row" key={row}>
        {rowSquares}
      </div>
    );
  }
  return (
    <>
      <div className="status">{status}</div>
      {rowBoard}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), index: -1 },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [asc, setAsc] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, i) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, index: i },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((turnInfo, move) => {
    let description;
    let moveDetails = "";
    if (move > 0) {
      const row = Math.floor(turnInfo.index / 3);
      const col = turnInfo.index % 3;
      moveDetails = " - (" + (row + 1) + ", " + (col + 1) + ")";
      description = "Go to move #" + move + moveDetails;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        {currentMove === move && currentMove !== 0 ? (
          <span>
            {" "}
            You are at move #{move}
            {moveDetails}
          </span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  function SortMove() {
    setAsc(!asc);
  }

  const sortedList = asc ? moves : moves.reverse();

  const winnerInfo = caculateWinner(currentSquares);
  const winningSquares = winnerInfo ? winnerInfo.line : null;

  return (
    <>
      <div className="container">
        <div className="game">
          <div className="left">
            <div className="game-board">
              <Board
                xIsNext={xIsNext}
                squares={currentSquares}
                onPlay={handlePlay}
                winningSquares={winningSquares}
              />
            </div>
          </div>
          <div className="right">
            <div className="game-info">
              <div className="btn">
                <button onClick={SortMove}>Sort</button>
              </div>
              <ol>{sortedList}</ol>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <p className="copyright">© DuyHQ</p>
      </footer>
    </>
  );
}

function caculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
