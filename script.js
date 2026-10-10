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

function getHumanChoice() {
  let choice = prompt("камень, ножницы или бумага?");
  return choice.toLowerCase();
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

  for (let round = 0; round < 5; round++) {
    const humanSelection = getHumanChoice();
    const computerSelection = getComputerChoice();

    console.log(humanSelection);
    console.log(computerSelection);
    console.log(playRound(humanSelection, computerSelection));
    console.log(humanScore, computerScore);
  }

  console.log(completeGame(humanScore, computerScore));
}

playGame();
