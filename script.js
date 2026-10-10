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
  const humanSelection = getHumanChoice();
  const computerSelection = getComputerChoice();

  console.log(humanSelection);
  console.log(computerSelection);
  console.log(playRound(humanSelection, computerSelection));
  console.log(humanScore, computerScore);
}

playGame();
