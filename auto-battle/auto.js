let team1 = [];

let f1, f2;
let currentTurn = 1;

let battleInterval = null;
var parsed = "";
const attackSound = new Audio('death.wav');

let player1Health = 6;
let player2Health = 6;


//fighter1.abilities.push(heal);
//Sets up abilities for characters
function restoreAbilities(fighter) {
    fighter.abilities = [];
    if (fighter.champion === "Slime") {
         fighter.abilities.push(heal);
    }
    if (fighter.champion === "Andrew") {
        fighter.abilities.push(poison);
    }
    
}


function log(msg){
    document.getElementById("battleLog").innerHTML += msg + "<br>";
}


//prints stat of monsters to the team builder
let submittedChampions = [];
function printMonster(){
     const tableHead = document.querySelector("#myTable thead tr");
    const tableBody = document.querySelector("#myTable tbody");

    tableBody.innerHTML = "";
    tableHead.innerHTML = ""; // Clear previous headers

    // Only show selected columns
    const columnsToShow = ["champion", "health", "attack", "tier", "abilityName" ];

    // Create table headers
    columnsToShow.forEach(key => {
        const th = document.createElement("th");
        th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        tableHead.appendChild(th);
    });

    // Populate table rows
    for (let i = 0; i < championList.length; i++) {
        const currentChampion = championList[i];
        const row = tableBody.insertRow();

        columnsToShow.forEach(key => {
            const cell = row.insertCell();
            if (key === "abilities") {
                // Show ability names, or "None"
                cell.textContent = currentChampion.abilities && currentChampion.abilities.length > 0
                    ? currentChampion.abilities.map(a => a.name).join(", ")
                    : "None";
            } else {
                cell.textContent = currentChampion[key];
            }
        });

        // Add submit button as before
        const actionCell = row.insertCell();
        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit";
        submitButton.addEventListener("click", () => {
            submittedChampions.push(currentChampion);
            printTeams();
        });
        actionCell.appendChild(submitButton);
    }
}

//Portion of code used to display teams in battle screen
function printTeams(){
    const teamList = document.getElementById("teamList");
    teamList.innerHTML = "";
    
    submittedChampions.forEach((champion, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = ` ${champion.champion}`;
        teamList.appendChild(listItem);
    })
}

function displayTeam(team1, team2) {
     document.getElementById("team1Display").innerHTML =
        "Your Team:<br>" +
        team1.map(f => `
            <div>
                <img src="${f.image}" alt="${f.champion}" style="width:50px;height:50px;"><br>
                ${f.champion}
            </div>
        `).join("");
    document.getElementById("team2Display").innerHTML =
        "Enemy Team:<br>" +
        team2.map(f => `
            <div>
                <img src="${f.image}" alt="${f.champion}" style="width:50px;height:50px;"><br>
                ${f.champion}
            </div>
        `).join("");
}
    


function saveTeam(){
    localStorage.setItem("team1", JSON.stringify(submittedChampions));
    window.location.href = "auto.html";
}


//Work in progress to have the ai team be random
function setEnemyTeam(arr){
    const randomIndex = Math.floor(Math.random() * arr.length);

    return arr[randomIndex];
}

const randomTeam = setEnemyTeam(championList);
console.log(randomTeam);

const team2 = [
    {...fighter1},
    {...fighter2},
    { ...fighter3},
    { ...fighter4},
    {...fighter5}
];

//main loop of the program
function startBattle(){
    team1 = JSON.parse(localStorage.getItem("team1"));
    displayTeam(team1, team2);
    document.getElementById("team1Log").innerHTML = "";
    document.getElementById("team2Log").innerHTML = "";
    team1.forEach(f => f.abilityUsed = false);
    team2.forEach(f => f.abilityUsed = false);
    team1Index = 0;
    team2Index = 0;
    f1 = {...team1[team1Index]};
    restoreAbilities(f1); 
    f2 = {...team2[team2Index]};
    restoreAbilities(f2);
    updateActivePortraits();
    alert("Battle started");
    updateStatus();
    //Set wait function
    if(battleInterval) clearInterval(battleInterval);
    battleInterval = setInterval(() => {
        nextTurn();
        
    }, 2000);
}
//Will update the imge held in the containers
function updateActivePortraits() {
    //For team1
    document.getElementById("activeTeam1Img").src = f1.image;
    document.getElementById("activeTeam1Img").alt = f1.champion;
    document.getElementById("activeTeam1Name").textContent = f1.champion;
    //For team2
     document.getElementById("activeTeam2Img").src = f2.image;
    document.getElementById("activeTeam2Img").alt = f2.champion;
    document.getElementById("activeTeam2Name").textContent = f2.champion;
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function nextTurn(){
    //combat functions
    
    //Poison check
    if (f1.poisoned) {
        f1.health -= 1;
        document.getElementById("battleLog").innerText += `\n${f1.champion} takes 1 poison damage!`
    }
    if (f2.poisoned) {
        f2.health -= 1;
        document.getElementById("battleLog").innerText += `\n${f2.champion} takes 1 poison damage!`
    }


    //Initially ends the battle
    if (team1Index >= team1.length || team2Index >= team2.length){
        clearInterval(battleInterval);
        return;
    }

    if (currentTurn === 1){

        if (f1.abilities.length > 0 && !f1.abilityUsed){
            f1.abilities[0].effect(f1,f2);

        }else {
            f2.health -= f1.attack;
            
            document.getElementById("battleLog").innerText +=
                `\n${f1.champion} attacks ${f2.champion} for ${f1.attack} damage!`;
        }
        currentTurn = 2;
    } else {
        if (f2.abilities.length > 0 && !f2.abilityUsed) {
            f2.abilities[0].effect(f2, f1);
        }
        f1.health -= f2.attack;
        document.getElementById("battleLog").innerText +=
            `\n${f2.champion} attacks ${f1.champion} for ${f2.attack} damage!`;
        
        currentTurn = 1;
    }
    updateStatus();
    
    //fighter swap
    if(f1.health <= 0){
        await wait(1000);
        attackSound.play();
        document.getElementById("battleLog").innerText += `\n${f1.champion} is defeated!`;
        team1Index++;
        if (team1Index < team1.length) {
            f1 = { ...team1[team1Index] };
            restoreAbilities(f1);
            updateActivePortraits();
            document.getElementById("battleLog").innerText += `\n${f1.champion} enters the battle!`;
        }
    }
    if(f2.health <= 0){
        await wait(1000);
        attackSound.play();
        document.getElementById("battleLog").innerText += `\n${f2.champion} is defeated!`;
        team2Index++;
        if (team2Index < team2.length){
            f2 = { ...team2[team2Index]};
            restoreAbilities(f2);
            updateActivePortraits();
            document.getElementById("battleLog").innerText += `\n${f2.champion} enters the battle!`;
        }
    }
    //end of battle
    if (team1Index >= team1.length && team2Index >= team2.length) {
          document.getElementById("battleLog").innerText += `\nIt's a draw!`;
          setTimeout(() => window.location.href = "team-build.html", 3000);
         
    } else if (team1Index >= team1.length) {
        document.getElementById("battleLog").innerText += `\nTeam 2 wins!`;
        setTimeout(() => window.location.href = "team-build.html", 3000);
        team1Score -= 1;
    } else if (team2Index >= team2.length) {
        document.getElementById("battleLog").innerText += `\nTeam 1 wins!`;
        setTimeout(() => window.location.href = "team-build.html", 3000);
        team2Score -= 1;
    }
    
    
   
}
//just updates it
function updateStatus() {
    document.getElementById("team1Log").innerHTML =
      `Team 1: ${f1.champion} (HP: ${f1.health})`;
    document.getElementById("team2Log").innerHTML =
      `Team 2: ${f2.champion} (HP: ${f2.health})`;
}
