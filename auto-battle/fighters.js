//Possible change to format of fighters, to be worked on later
class fighter {
    constructor(champion, health, attack, tier, abilityName, image){
        this.champion = champion;
        this.health = health;
        this.attack = attack;
        this.tier = tier;
        this.abilityName = abilityName;
        this.abilities = [];
        this.abilityUsed = false;
        this.poisoned = false;
        this.image = image;
    }
}
//define characters
const fighter1 = new fighter("Slime", 2, 1,1, "Heal", "images/Slime.jpg");
const fighter2 = new fighter("Goblin", 2, 1,1, null, "images/Goblin.jpg");
const fighter3 = new fighter("Herbert", 3, 1,2, null, "images/Herbert.jpg");
const fighter4 = new fighter("Troll", 4, 2,2, null, "images/Troll.jpg");
const fighter5 = new fighter("Andrew", 5, 2, 3, "Poison", "images/Andrew.jpg");


const championList = [
    fighter1,
    fighter2,
    fighter3,
    fighter4,
    fighter5
];