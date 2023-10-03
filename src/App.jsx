import { useEffect, useState } from 'react'
import './App.css'
import BingoBoard from './components/bingoBoard';
import Squid from '/images/Squid.png'

const fetchBoards = async () => {
  let resp = await fetch('/input/boards.txt');
  let boardInput = await resp.text();
  const boards = boardInput.trim().split('\n\r');
  const bingoBoards = [];

  for (let i = 0; i < boards.length; i++) {
    const rows = boards[i].trim().split('\r\n');
    const boardArray = [];

    for (let j = 0; j < rows.length; j++) {
      const rowNumbers = rows[j].trim().split(/\s+/).map(Number);
      const rowMarked = rowNumbers.map(number => ({
        value: number,
        marked: false
      }));
      boardArray.push(rowMarked);
    }
    bingoBoards.push({ board: boardArray, isWinning: false });
  }
  return bingoBoards; 
}

const fetchDraw = async()=> {
  let resp = await fetch('/input/draw.txt');
  let drawInput = await resp.text();
  return drawInput.split(',').map(Number);
}

function App() {

  const [bingoBoards, setBingoBoards] = useState([]);
  const [drawNumbers, setDrawNumbers] = useState([]);
  const [winningBoardArray, setWinningBoardArray] = useState([]);
  const [lastWinningBoard, setLastWinningBoard] = useState([]);
  const [lastWinningBoardIndex, setLastWinningBoardIndex] = useState([]);
  const [lastWinningScore, setLastWinningScore] = useState();
  const [winningNumber, setWinningNumber] = useState();
  
  useEffect(() => {
    async function fetchData() {
      const boards = await fetchBoards();
      const draw = await fetchDraw();
      setBingoBoards(boards);
      setDrawNumbers(draw);
      markNumbers(boards, draw);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (winningBoardArray.length > 0) {
      scoreOfLastWinningBoard(winningBoardArray);
    }
  }, [winningBoardArray]);
  

  const markNumbers = (boards, draw) => {
    const winningBoardOrder = [];
    const updatedBoards = boards.map((boardData) => {
      const board = [...boardData.board];
      let isWinning = boardData.isWinning; 
        for (let x = 0; x < draw.length; x++)
        {
          if (isWinning) {break;}
          for (let i = 0; i < board.length; i++) {
            if (isWinning) {break;}
              for (let j = 0; j < board[i].length; j++) {
                if (isWinning) {break;}
                const number = board[i][j].value;
                  if (draw[x] === number){
                    if (!checkWinning(board)){
                      board[i][j].marked = true;
                    }
                    if (checkWinning(board))
                    {
                      isWinning = true;
                      winningBoardOrder.push({
                        boardAtWin: board, 
                        winningNumber: number, 
                        winningNumberDrawIndex: x});
                    }
                }
              }
          }
        }  
      return { board, isWinning };
    });
    setBingoBoards(updatedBoards);
    setWinningBoardArray(winningBoardOrder);
  };

  const checkWinning = (board) => {
    const rowCount = board.length;
    const colCount = board[0].length;
  
    for (let i = 0; i < rowCount; i++) {
      let markedCount = 0;
      for (let j = 0; j < colCount; j++) {
        if (board[i][j].marked) {
          markedCount++;
          if (markedCount === 5) {
            return true;
          }
        } else {
          markedCount = 0;
        }
      }
    }
  
    for (let i = 0; i < colCount; i++) {
      let markedCount = 0;
      for (let j = 0; j < rowCount; j++) {
        if (board[j][i].marked) {
          markedCount++;
          if (markedCount === 5) {
            return true;
          }
        } else {
          markedCount = 0;
        }
      }
    }

    return false;
  };

  const scoreOfLastWinningBoard = (winningBoards) => {
    let highestIndex = -1;
    let score = 0;
    let boardWithHighestIndex;
    let multiplier = -1;

    for (let i = 0; i < winningBoards.length; i++) {
      if (winningBoards[i].winningNumberDrawIndex > highestIndex) {
        highestIndex = winningBoards[i].winningNumberDrawIndex;
        boardWithHighestIndex = winningBoards[i].boardAtWin;
        multiplier = winningBoards[i].winningNumber;
        setWinningNumber(multiplier);
      }
    }

    for (let i = 0; i < boardWithHighestIndex.length; i++){
      for (let j = 0; j < boardWithHighestIndex[i].length; j++){
        if (!boardWithHighestIndex[i][j].marked)
        score += boardWithHighestIndex[i][j].value;
      }
    }
    score *= multiplier;
    setLastWinningScore(score);
    setLastWinningBoard(boardWithHighestIndex);
    setLastWinningBoardIndex(highestIndex-1);
  }

  return (
    <>
    <div>
      <img src={Squid}  className='logo' />
        <h1>Squid Game</h1>
        <div className="paragraph">
          <p>
          Out of the <span className="result-text">{bingoBoards.length}</span> boards the last winning board is number <span className="result-text">{lastWinningBoardIndex}</span> 
          </p>
          <p>
          The board wins after number <span className="result-text">{winningNumber}</span> is drawn
          </p>
          <BingoBoard boardData={lastWinningBoard}/>
          <p>
          With a score of: <span className="result-text">{lastWinningScore}</span>
          </p>
      </div>
    </div>
    </>
  )
}

export default App