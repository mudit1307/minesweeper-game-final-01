const grid = document.querySelector(".grid");
const flag = document.querySelector("#flag-left");

let width = 10;
let bombAmount = 20;
let squares = [];
let flags = 20;
let isGameOver = false;

//create board
function createBoard() {
  let shuffledArray = Array(width * width).fill("valid");
  let randomBombsIndex = [];
  while (randomBombsIndex.length < 20) {
    let r = Math.floor(Math.random() * (99 - 0 + 1)) + 0;
    if (!randomBombsIndex.includes(r)) {
      randomBombsIndex.push(r);
      shuffledArray[r] = "bomb";
    }
  }
  console.log(randomBombsIndex.length);
//   console.log(shuffledArray);

  //creating squares
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    // square.setAttribute("id",i);
    square.id = i;
    square.classList.add(shuffledArray[i]);
    grid.appendChild(square);
    squares.push(square);

    //square normal click functionality
    square.onclick = () => {
      console.log("click");
      clickBait(square);
    };

    square.addEventListener("contextmenu", function (event) {
      event.preventDefault();
      addFlag(square);
    //   console.log("right click")
    });
  }
  //add numbers to grid
  calculateSquareValues();
}
createBoard();


function calculateSquareValues() {
    //add numbers
  for (let i = 0; i < width * width; i++) {
    //checks number of bobms and display count more than 0;

    let total = 0;
    const leftEdge = i % width == 0;
    const rightEdge = i % width == width - 1;

    if (squares[i].classList.contains("valid")) {
      //four sides
      if (i % 10 != 9 && squares[i + 1].classList.contains("bomb")) total++;
      if (i % 10 != 0 && squares[i - 1].classList.contains("bomb")) total++;
      if (i > 9 && squares[i - width].classList.contains("bomb")) total++;
      if (i < 90 && squares[i + width].classList.contains("bomb")) total++;

      //diagonal corners
      if (
        !leftEdge &&
        i > 9 &&
        squares[i - width - 1].classList.contains("bomb")
      )
        total++;
      if (
        !leftEdge &&
        i < 90 &&
        squares[i + width - 1].classList.contains("bomb")
      )
        total++;
      if (
        !rightEdge &&
        i > 9 &&
        squares[i - width + 1].classList.contains("bomb")
      )
        total++;
      if (
        !rightEdge &&
        i < 90 &&
        squares[i + width + 1].classList.contains("bomb")
      )
        total++;

      squares[i].setAttribute("data", total);

    }
  }
}

    //click on square actions
function clickBait(square) {
  let currentId = square.id;
  if (isGameOver) return;

  if (square.classList.contains("checked") || square.classList.contains("flag"))
    return;

  if (square.classList.contains("bomb")) {
    gameOver(square);
  }

  // else if (!square.classList.contains("flag") ) {
  //     // square.style.border = "1px solid gray";
  //     let x = square.getAttribute("id");
  //     // console.log(x);
  //     callRecursion(x);
  // }

  else {
    let total = square.getAttribute("data");
    if (total != 0) {
      square.classList.add("checked");
      square.innerHTML = total;
      return;
    }
    checkSquare(square, currentId);
  }
  square.classList.add("checked");
}


//add flag with right click
function addFlag(square) {
  // console.log("add flag");
//   console.log(square);
  if (isGameOver) return;

  if (!square.classList.contains("checked") && flags > 0) {

    if (!square.classList.contains("flag")) {
      square.classList.add("flag");
      square.innerHTML = "🚩";
      flags--;
      flag.innerHTML = flags;
      checkForWin();
    } else {
      square.classList.remove("flag");
      square.innerHTML=' ';
      flags++;
      flag.innerHTML = flags;
    }
  }
}

    //add flag with right click
    // function addFlag(square)
    // {
    //     if(isGameOver) return
    //     if(!square.classList.contains('checked') && (flags <bombAmount))
    //     {
    //         if(!square.classList.contains('flag'))
    //         {
    //             square.classList.add("flag");
    //             square.innerHTML=' 🚩';
    //             flags++;
    //             flagCount.innerHTML=bombAmount-flags;
    //             checkForWin()
    //         }
    //         else
    //         {
    //             square.classList.remove("flag");
    //             square.innerHTML=' ';
    //             flags--;
    //             flagCount.innerHTML=bombAmount-flags;
    //         }
    //     }
    // }


// check neighboring squares once square is clicked
function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;
  
    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id;
        const newSquare = document.getElementById(newId);
        clickBait(newSquare);
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id;
        const newSquare = document.getElementById(newId);
        clickBait(newSquare);
      }
      if (currentId > 10) {
        const newId = squares[parseInt(currentId) - width].id;
        const newSquare = document.getElementById(newId);
        clickBait(newSquare);
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id;
        const newSquare = document.getElementById(newId);
        clickBait(newSquare);
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id;
        const newSquare = document.getElementById(newId);
        clickBait(newSquare);
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        clickBait(newSquare);
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        clickBait(newSquare);
      }
      if (currentId < 89) {
        const newId = squares[parseInt(currentId) + width].id;
        const newSquare = document.getElementById(newId);
        clickBait(newSquare);
      }
    }, 10);
  }


//game over
function gameOver() {
  console.log("BOM! Game Over");
  isGameOver = true;

  //show all the bobms
  squares.forEach(square => {
    square.onclick = "";
    if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
      square.style.backgroundColor="red";
      square.style.border="none";
    }
  })
}

// check for win
function checkForWin() {
  let matches = 0;
  for (let i = 0; i < squares.length; i++) {
    if (
      squares[i].classList.contains("flag") &&
      squares[i].classList.contains("bomb")
    ) {
      matches++;
    }
    if (matches == bombAmount) {
      console.log("YOU WIN!");
      alert("YOU WIN");
      isGameOver = true;
    }
  }
}
