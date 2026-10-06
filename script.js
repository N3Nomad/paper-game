function getComputerChoice() {
    const randomNumber = (Math.floor(Math.random() * 3))
    if (randomNumber === 0) {
    return "бумага";
    } else if (randomNumber === 1)  {
        return "ножницы";
    } else {
        return "камень";
    }
}

function getHumanChoice(){
    let choice = prompt("камень, ножницы или бумага?")
    return choice.toLowerCase();
}

function playRound(humanSelection, computerSelection) {
    if (humanSelection === computerSelection) {
        return "Ничья!"
    } else if (humanSelection === "камень" && computerSelection === "ножницы") {
        return "Человек победил!";
    } else if (humanSelection === "ножницы" && computerSelection === "бумага"){
        return "Человек победил!";
    } else if (humanSelection === "бумага" && computerSelection === "камень") {
        return "Человек победил!"
    } else {
        return "Победил компьютер!"
    }
        
}

const humanSelection = getHumanChoice();
const computerSelection = getComputerChoice();

console.log(humanSelection)
console.log(computerSelection);
console.log(playRound(humanSelection, computerSelection))