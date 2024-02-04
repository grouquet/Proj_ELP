const readline = require('readline');
const dictionnaire = require("./dictionnaire.json")

//ECRIRE EN MAJ !!!!


function getRandomLetter(letterBag) {
    const randomIndex = Math.floor(Math.random() * letterBag.length);
    const randomLetter = letterBag[randomIndex];
    return randomLetter;
}


class PlayerBoard {
  constructor() {
    this.words = []; // Mots formés
    this.letters = []; // Lettres en main
  }

  async create_word() {
    console.log("Votre tapis : ", this.letters);
    let choix;
    if (this.words[7] && this.words[7].length != 0) {
      choix = "mod";
    } else {
      choix = await this.ask("Si vous souhaitez modifier un mot déjà présent taper <mod> sinon taper <new>");
    }
    if (choix == "new") {
      let mot;
      do {
        mot = await this.ask("Quelle mot créer à partir de ces lettres ?");
      } while (!this.check_new_word(mot) || !this.real_word(mot));
      this.words.push(mot);
    } else {
      let mot;
      let num;
      do {
        num = await this.ask("Entrez l'index du mot à changer (0 à 7) : ");
        mot = await this.ask("Quelle mot créer à partir de ces lettres ? ");
      } while (!this.check_word(mot, num) || !this.real_word(mot));
      this.words[num] = mot;
    }
  }

  check_word(str, index_word) {
    if ((str.length) < 3) {
      return false;
    }
    let availableLetters = this.letters.slice();
    let word = this.words[index_word]
    let availableLetters_and_word = availableLetters.concat(word.split('')); //contient les lettres du tapis et celles du mot à changer
    for (let j = 0; j < str.length; j++) {
      const letterIndex = availableLetters_and_word.indexOf(str[j]);
      if (letterIndex === -1) {
        return false;
      }
    }
    return true;
  }

  check_new_word(str) {
    if ((str.length) < 3) {
      return false;
    }
    let availableLetters = this.letters.slice();
    for (let j = 0; j < str.length; j++) {
      const letterIndex = availableLetters.indexOf(str[j]);
      if (letterIndex === -1) {
        return false;
      }
    }
    return true;
  }
  real_word(str) {
    return !!dictionnaire[str];
  }

  add_letter(letter) {
    this.letters.push(letter);
  }

  ask(question) {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
  
      rl.question(question, (num) => {
        rl.close();
        resolve(num);
      });
    });
  }
}


//sac de lettres
let letterBag = [];
const letterFrequencies = { 'A': 14, 'B': 4, 'C': 7, 'D': 5, 'E': 19, 'F': 2, 'G': 4, 'H': 2, 'I': 11, 'J':1, 'K': 1, 'L': 6, 'M': 5, 'N': 9, 'O': 8, 'P': 4, 'Q': 1, 'R': 10, 'S': 7, 'T': 9, 'U': 8, 'V': 2, 'W': 1, 'X': 1, 'Y': 1, 'Z': 2};

for (let letter in letterFrequencies) {
  for (let i = 0; i < letterFrequencies[letter]; i++) {
    letterBag.push(letter);
  }
}

console.log(letterBag)


let Player1 = new PlayerBoard();
let Player2 = new PlayerBoard();

// on rempli tapis du P1
for (let j = 0; j <= 5; j++) {
  carte = getRandomLetter(letterBag)
  Player1.add_letter(carte)
}



Player1.create_word()

console.log(Player1.words.join(', '))