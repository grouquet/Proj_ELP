const readline = require('readline');
const dictionnaire = require("./dictionnaire.json")

// On tire une carte quand ? A chaque fois après avoir crée un mot OU après avoir modifier un mot ????

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

  async create_word(letterBag) {
    console.log("Votre tapis : ", this.letters);
    if (this.words.length == 0) {
      console.log("Aucun mot crée pour l'instant")
    } else {
      console.log("Mots actuels :  " + this.words.join(', '))
    }
    let choix;
    let rejouer = true;
    if (this.words[7] && this.words[7].length != 0) {
      choix = "mod";
    } else {
      let essai = 0;
      do {
        if (essai > 0) {
          console.log("Faute d'orthographe !!!")
        }
        essai++
        choix = await this.ask("Si vous souhaitez modifier un mot déjà présent taper <mod>, taper <new> ou <pass>");
      } while (choix != "mod" && choix != "new" && choix != "pass");
    }
    //Le choix été fait
    if (choix == "new") {
      let mot;
      let essai = 0;
      do {
        if (essai > 0) {
          if (!this.check_new_word(mot) && !this.real_word(mot)) {
            console.log("Rien ne vas !!")
          }
          else if (!this.check_new_word(mot)) {
            console.log("Tu n'as pas toutes ces lettres")
          }
          else if (!this.real_word(mot)) {
            console.log("Ton mot n'est pas dans le dico")
          }
        }
        essai++
        mot = await this.ask("Quelle mot créer à partir de ces lettres ?");
      } while (!this.check_new_word(mot) || !this.real_word(mot));
      this.words.push(mot);
      for (let i = 0; i < mot.length; i++) {
        let index = this.letters.indexOf(mot[i])
        this.letters.splice(index, 1);
      }
      let new_letter = letterBag.pop()
      this.letters.push(new_letter)
      return rejouer
    } else if (choix == "mod") {
      let mot;
      let num;
      do {
        num = await this.ask("Entrez l'index du mot à changer (0 à 7) : ");
        mot = await this.ask("Quelle mot créer à partir de ces lettres ? ");
      } while (!this.check_word(mot, num) || !this.real_word(mot));
      let availableLetters = this.letters.slice();
      let word = this.words[num]
      let availableLetters_and_word = availableLetters.concat(word.split(''));
      for (let i = 0; i < mot.length; i++) {
        let index = availableLetters_and_word.indexOf(mot[i])
        availableLetters_and_word.splice(index, 1);
      }
      this.letters = availableLetters_and_word
      this.words[num] = mot;
      let new_letter = letterBag.pop()
      this.letters.push(new_letter)
      return rejouer
    } else if (choix == "pass") {
      rejouer = false;
      return rejouer
    } 
  }

  check_word(str, index_word) {
    if ((str.length) < 3) {
      console.log("Moins de 3 lettres !")
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
      console.log("Moins de 3 lettres !")
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
    return dictionnaire[str];
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
//arquer_ou_pas va demander si il veut arnaquer et après faire un while dans boucle principale
  //async arnaquer_ou_pas(Player) {
    //y_or_n = await this.ask("Voulez vous arnaquer l'autre joueur")
      //affichage du jeu de l'autre joueur
    //console.log("Mots de l'autre joueur : ", Player.words)
    //console.log()
  //}
}


async function Game() {

  //sac de lettres
  let letterBag = [];
  const letterFrequencies = { 'a': 14, 'b': 4, 'c': 7, 'd': 5, 'e': 19, 'f': 2, 'g': 4, 'h': 2, 'i': 11, 'j':1, 'k': 1, 'l': 6, 'm': 5, 'n': 9, 'o': 8, 'p': 4, 'q': 1, 'r': 10, 's': 7, 't': 9, 'u': 8, 'v': 2, 'w': 1, 'x': 1, 'y': 1, 'z': 2};

  for (let letter in letterFrequencies) {
    for (let i = 0; i < letterFrequencies[letter]; i++) {
      letterBag.push(letter);
    }
  }

  let Player1 = new PlayerBoard();
  let Player2 = new PlayerBoard();

  // on rempli tapis
  for (let j = 0; j <= 5; j++) {
    carte1 = getRandomLetter(letterBag)
    carte2 = getRandomLetter(letterBag)
    Player1.add_letter(carte1)
    Player2.add_letter(carte2)
  }
  
  let rejouer;
  do {
    console.log("Deck -> " + letterBag.length + " cartes")
    rejouer = await Player1.create_word(letterBag)
  } while (rejouer)

  console.log(Player1.words.join(', '))
}

Game()