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
      return "Ты победил! Камень бьет ножницы.";
    } else if (humanSelection === "ножницы" && computerSelection === "бумага") {
      humanScore++;
      return "Ты победил! Ножницы режут бумагу.";
    } else if (humanSelection === "бумага" && computerSelection === "камень") {
      humanScore++;
      return "Ты победил! Бумага накрывает камень.";
    } else {
      computerScore++;
      return "Победил компьютер!";
    }
  }

  const resultDiv = document.querySelector("#result");
  const scoreDiv = document.querySelector("#score");
  

  const rockButton = document.querySelector("#rock");
  rockButton.addEventListener("click", function () {
    resultDiv.textContent = playRound("камень", getComputerChoice());
    scoreDiv.textContent = (`Твой счет: ${humanScore}, счет компьютера: ${computerScore}`);
  });

  const scissorsButton = document.querySelector("#scissors");
  scissorsButton.addEventListener("click", function () {
    resultDiv.textContent = playRound("ножницы", getComputerChoice());
    scoreDiv.textContent = (`Твой счет: ${humanScore}, счет компьютера: ${computerScore}`);
  });

  const paperButton = document.querySelector("#paper");
  paperButton.addEventListener("click", function () {
    resultDiv.textContent = playRound("бумага", getComputerChoice());
    scoreDiv.textContent = (`Твой счет: ${humanScore}, счет компьютера: ${computerScore}`);
  });
}
playGame();
