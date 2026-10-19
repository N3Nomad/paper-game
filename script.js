function getComputerChoice() {
  const randomNumber = Math.floor(Math.random() * 3);
  if (randomNumber === 0) {
    return "бумага";
  } else if (randomNumber === 1) {
    return "ножницы";
  } else {
    return "камень";
  }
}

function completeGame(humanScore, computerScore) {
  if (humanScore > computerScore) {
    return "Ты победил компьютер!";
  } else if (computerScore > humanScore) {
    return "Компьютер тебя обыграл, не расстраивайся, такова сила рандома!";
  } else {
    return "Ничья, играем снова!";
  }
}

function playGame() {
  let humanScore = 0;
  let computerScore = 0;

  function playRound(humanSelection, computerSelection) {
    if (humanSelection === computerSelection) {
      return "Ничья!";
    } else if (humanSelection === "камень" && computerSelection === "ножницы") {
      humanScore++;
      return "Ты победил!";
    } else if (humanSelection === "ножницы" && computerSelection === "бумага") {
      humanScore++;
      return "Ты победил!";
    } else if (humanSelection === "бумага" && computerSelection === "камень") {
      humanScore++;
      return "Ты победил!";
    } else {
      computerScore++;
      return "Победил компьютер!";
    }
  }

  function handleChoice(humanChoice) {
    winnerDiv.textContent = "";
    const computerChoice = getComputerChoice();
    choicesDiv.textContent = `Ты: ${humanChoice} - Компьютер: ${computerChoice}`;
    resultDiv.textContent = playRound(humanChoice, computerChoice);
    scoreDiv.textContent = `Твой счет: ${humanScore}, счет компьютера: ${computerScore}`;

    if (humanScore === 5 || computerScore === 5) {
      winnerDiv.textContent = completeGame(humanScore, computerScore);
      humanScore = 0;
      computerScore = 0;
    }
  }

  const choicesDiv = document.querySelector("#choices");
  const resultDiv = document.querySelector("#result");
  const scoreDiv = document.querySelector("#score");
  const winnerDiv = document.querySelector("#winner");

  const rockButton = document.querySelector("#rock");
  rockButton.addEventListener("click", function () {
    handleChoice("камень");
  });

  const scissorsButton = document.querySelector("#scissors");
  scissorsButton.addEventListener("click", function () {
    handleChoice("ножницы");
  });

  const paperButton = document.querySelector("#paper");
  paperButton.addEventListener("click", function () {
    handleChoice("бумага");
  });
}
playGame();
