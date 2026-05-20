const today = new Date();

const day =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

function seededRandom(seed){

    let x = Math.sin(seed) * 10000;

    return x - Math.floor(x);
}

const randomIndex = Math.floor(
    seededRandom(day) * characters.length
);

const guessedCharacters = [];

let gameWon = false;

const answer = characters[randomIndex];
const button = document.querySelector("button");
const input = document.querySelector("input");
const suggestions = document.getElementById("suggestions");
const results = document.getElementById("results");

button.addEventListener("click", () => {

    if(gameWon){
    return;
}

if(input.value.trim() === ""){
    return;
}

    let guessName = input.value;

const firstSuggestion = characters.filter(character => {

    if(
        guessedCharacters.includes(character.name)
    ){
        return false;
    }

    const words = character.name
        .toLowerCase()
        .split(" ");

    return words.some(word =>
        word.startsWith(
            input.value.toLowerCase()
        )
    );

})[0];

if(firstSuggestion){

    guessName = firstSuggestion.name;
}

    const guessedCharacter = characters.find(character =>

    character.name.toLowerCase() ===
    guessName.toLowerCase()

);

if(guessedCharacters.includes(guessedCharacter?.name)){

    return;
}


    if(!guessedCharacter){
    input.value = "";
    suggestions.innerHTML = "";
    return;
}

    showResult(guessedCharacter);

guessedCharacters.push(guessedCharacter.name);

input.value = "";
suggestions.innerHTML = "";

    if(guessedCharacter.name === answer.name){

        gameWon = true;

    const winPopup = document.getElementById("win-popup");

    winPopup.style.display = "block";

    document.getElementById("overlay").classList.add("show");

    setTimeout(() => {
        winPopup.classList.add("show");
    }, 10);

    document.getElementById("winner-image").src = guessedCharacter.image;

    document.getElementById("winner-name").textContent = guessedCharacter.name;

}
});

input.addEventListener("keydown", (event) => {

    if(event.key === "Enter"){

        button.click();

    }

});

function checkTrait(guess, answer){

    if(
        guess === "Unknown" ||
        answer === "Unknown"
    ){

        return guess === answer
        ? "correct"
        : "wrong";
    }

    if(
        typeof guess === "number" &&
        typeof answer === "number"
    ){

        if(guess === answer){
            return "correct";
        }

        return guess > answer
        ? "down"
        : "up";
    }

    if(guess === answer){
        return "correct";
    }

    // Arc kontrolü
    if(
        guess.includes("Arc") &&
        answer.includes("Arc")
    ){

        const guessNumber = parseInt(
            guess.replace("Arc ", "")
        );

        const answerNumber = parseInt(
            answer.replace("Arc ", "")
        );

        if(
            Math.abs(
                guessNumber - answerNumber
            ) === 1
        ){
            return "partial";
        }
    }

    // Virgüllü özellik kontrolü
    const guessTraits = guess
        .toLowerCase()
        .split(",")
        .map(t => t.trim());

    const answerTraits = answer
        .toLowerCase()
        .split(",")
        .map(t => t.trim());

    const hasMatch = guessTraits.some(trait =>
        answerTraits.includes(trait)
    );

    if(hasMatch){
        return "partial";
    }

    return "wrong";
}

function showResult(character){

    const row = document.createElement("div");

    row.classList.add("result-row");

    row.innerHTML = `

    <div class="character-image">

        <img src="${character.image}">

    </div>

    <div class="${checkTrait(character.gender, answer.gender)}">
        ${character.gender}
    </div>

    <div class="${checkTrait(character.race, answer.race)}">
        ${character.race}
    </div>

    <div class="${checkTrait(character.role, answer.role)}">
        ${character.role}
    </div>

    <div class="${checkTrait(character.affiliation, answer.affiliation)}">
        ${character.affiliation}
    </div>

    <div class="${checkTrait(character.age, answer.age)}">

${character.age}

${character.age !== answer.age &&
character.age !== "Unknown" &&
answer.age !== "Unknown"
? (parseInt(character.age) > parseInt(answer.age) ? " ↓" : " ↑")
: ""}

</div>

<div class="${checkTrait(character.height, answer.height)}">

${character.height === "Unknown"
? "Unknown"
: character.height >= 1000
? (character.height / 100) + " m"
: character.height + " cm"}

${character.height !== answer.height &&
character.height !== "Unknown" &&
answer.height !== "Unknown"
? (parseInt(character.height) > parseInt(answer.height) ? " ↓" : " ↑")
: ""}

</div>

    <div class="${checkTrait(character.elementalAffinity, answer.elementalAffinity)}">
        ${character.elementalAffinity}
    </div>

    <div class="${checkTrait(character.divineProtection, answer.divineProtection)}">
        ${character.divineProtection}
    </div>

    <div class="${checkTrait(character.authority, answer.authority)}">
        ${character.authority}
    </div>

    <div class="${checkTrait(character.firstAppearance, answer.firstAppearance)}">
        ${character.firstAppearance}
    </div>

    `;

    results.prepend(row);
}
   
input.addEventListener("input", () => {

    const value = input.value.toLowerCase();

    suggestions.innerHTML = "";

    if(value.length === 0){
        return;
    }

    const filteredCharacters = characters.filter(character => {

    if(
        guessedCharacters.includes(character.name)
    ){
        return false;
    }

    const words = character.name
        .toLowerCase()
        .split(" ");

    return words.some(word =>
        word.startsWith(value)
    );

});


    filteredCharacters.forEach(character => {

        const div = document.createElement("div");

        div.classList.add("suggestion");

        div.innerHTML = `

    <img src="${character.image}" class="suggestion-image">

    <span>${character.name}</span>

`;

        div.addEventListener("click", () => {

            input.value = character.name;

            suggestions.innerHTML = "";

        });

        suggestions.appendChild(div);

    });

});