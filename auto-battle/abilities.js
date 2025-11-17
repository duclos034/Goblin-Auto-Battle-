//Block for abilities
class ability {
    constructor(name, effect){
        this.name = name;
        this.effect = effect;
    }
}

const heal = new ability("heal", (self, opponent) => {
    if (self.health === 1 && !self.abilityUsed) {
        self.health += 2;
        self.abilityUsed = true;
        document.getElementById("battleLog").innerText +=
         `\n${self.champion} uses heal and recovered 2 HP!`;

    }
});

const poison = new ability("poison", (self, opponent) => {
    if (!opponent.poisoned) {
        opponent.poisoned = true;
        self.abilityUsed = true;
        // log 
        document.getElementById("battleLog").innerText += `Poison has been applied`;
    }
})
