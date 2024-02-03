const readline = require('readline');
const dictionnaire = require("./dictionnaire.json")
const fs = require('fs');
const path = require("path");

//Revoir la fin du jeu car lorsqu'un joueur a 8 mots le jeu propose un jarnaque a l'autre joueur

function getRandomLetter(letterBag) {
    const randomIndex = Math.floor(Math.random() * letterBag.length);
    const randomLetter = letterBag[randomIndex];
    return randomLetter;
}

function logToFile(outputFilePath, data) {
    const filePath = path.join(__dirname, outputFilePath); // Construit le chemin absolu
    fs.appendFile(filePath, data + '\n', (err) => { // Ajoute les données avec un saut de ligne
      if (err) throw err; // Gère les erreurs potentielles
    });
  }

class PlayerBoard {
  constructor(i) {
    this.words = []; // Mots formés
    this.letters = []; // Lettres en main
    this.id = i;
  }

  async create_word(letterBag) {
    console.log("Votre tapis : ", this.letters);
    if (this.words.length == 0) {
      console.log("Aucun mot crée pour l'instant")
    } else {
      console.log("Mots actuels :  " + this.words.join(', '))
    }
    let choix = "";
    let rejouer = true;
    let essai = 0;
    do {
      if (essai > 0) {
        console.log("Faute d'orthographe !!!")
      }
      essai++
      choix = await this.ask("Si vous souhaitez modifier un mot déjà présent taper <mod>, taper <new> ou <pass>");
    } while (choix != "mod" && choix != "new" && choix != "pass");
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
            console.log("Il n'y a pas toutes ces lettres")
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
      await this.draw_or_exchange(letterBag)
      return rejouer
    } else if (choix == "mod") {
      let mot;
      let num;
      let essai = 0;
      do {
        if (essai > 0) {
          if (!this.check_word(mot, num) && !this.real_word(mot)) {
            console.log("Rien ne vas !!")
          }
          else if (!this.check_word(mot, num)) {
            console.log("Il n'y a pas toutes ces lettres sur ton tapis et sur le mot " + num + " ou bien sur les lettres de l'ancien mot ne sont pas toutes dans le nouveau mot")
          }
          else if (!this.real_word(mot)) {
            console.log("Ton mot n'est pas dans le dico")
          }
        }
        essai++
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
      await this.draw_or_exchange(letterBag)
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
    let word = this.words[index_word]
    // on vérifie d'abord si toutes les lettres de l'ancien mot se retrouvent dans le nouveau mot (str) 
    for (let i = 0; i < this.words.length; i++) {
      const letterIndex = str.indexOf(this.words[i]);
      if (letterIndex === -1) {
        return false;
      }
    } //Puis on vérifie que toutes les lettres du nouveau mot son soit dans le tapis soit dans l'ancien mot
    let availableLetters = this.letters.slice();
    let availableLetters_and_word = availableLetters.concat(word.split(''));
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

  async draw_or_exchange(letterBag) {
    console.log("Deck -> " + letterBag.length + " cartes");
    console.log("Votre tapis : ", this.letters);
    if (this.words.length == 0) {
      console.log("Aucun mot crée pour l'instant");
    } else {
      console.log("Mots actuels :  " + this.words.join(", "));
    }
    let draw_exchange = await this.ask(
      "<draw> pour piocher une lettre, ou <exchange> pour echanger trois lettre: ",
    );
    while (draw_exchange !== "draw" && draw_exchange !== "exchange") {
      console.log("Vous avez fait une erreur de saisie");
      draw_exchange = await this.ask(
        "<draw> pour piocher une lettre, ou <exchange> pour echanger trois lettre: ",
      );
    }
    if (draw_exchange == "draw") {
      let letter = getRandomLetter(letterBag)
      this.add_letter(letter);
    }
    if (draw_exchange == "exchange") {
      let card_to_exchange1 = await this.ask(
        "Choisissez une lettre pour echanger(1/3): ",
      );
      let card_to_exchange2 = await this.ask(
        "Choisissez une lettre pour echanger(2/3): ",
      );
      let card_to_exchange3 = await this.ask(
        "Choisissez une lettre pour echanger(3/3): ",
      );
  
      while (
        this.letters.indexOf(card_to_exchange1) == -1 ||
        this.letters.indexOf(card_to_exchange2) == -1 ||
        this.letters.indexOf(card_to_exchange3) == -1
      ) {
        console.log("Il y a au moins une lettre que vous n'avez pas !");
        card_to_exchange1 = await this.ask(
          "Choisissez une lettre pour echanger(1/3): ",
        );
        card_to_exchange2 = await this.ask(
          "Choisissez une lettre pour echanger(2/3): ",
        );
        card_to_exchange3 = await this.ask(
          "Choisissez une lettre pour echanger(3/3): ",
        );
      }
      let index1 = this.letters.indexOf(card_to_exchange1);
      this.letters.splice(index1, 1);
      let index2 = this.letters.indexOf(card_to_exchange2);
      this.letters.splice(index2, 1);
      let index3 = this.letters.indexOf(card_to_exchange3);
      this.letters.splice(index3, 1);
      let letter1 = getRandomLetter(letterBag);
      let letter2 = getRandomLetter(letterBag);
      let letter3 = getRandomLetter(letterBag);
      this.add_letter(letter1);
      this.add_letter(letter2);
      this.add_letter(letter3);
    }
  }

  end_of_game() {
    let fin = true
    if (this.words.length < 8) {
      fin = false;
    }
    for (let i = 0; i < this.words.length; i++) {
      if (this.words[i].length == 0) {
        fin = false;
      }
    }
    return fin
  }

  count_points() {
    let acc = 0;
    for (let i = 0; i < this.words.length; i++) {
      acc = acc + (words[i].length)*(words[i].length)
    }
    return acc
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
  //arquer_ou_pas va demander si il veut arnaquer 
  async arnaquer_ou_pas(Player) {
    console.log("Tapis de l'adversaire : ", Player.letters);
      if (Player.words.length == 0) {
        console.log("L'adversaire n'a crée aucun mot pour l'instant")
      } else {
        console.log("Mots actuels :  " + Player.words.join(', '))
      }
    let y_or_n = await this.ask("Voulez vous arnaquer l'autre joueur <oui> ou <non>")
    if (y_or_n == "non") {
      return false;
    } else if (y_or_n == "oui") {
      console.log("\n\n--------------Arnaquons !--------------\n")
      let choix;
      let rejouer = true;
      let essai = 0;
      do {
        if (essai > 0) {
          console.log("Faute d'orthographe !!!")
        }
        essai++
        choix = await this.ask("Arnaquez : si vous souhaitez modifier un mot déjà présent taper <mod>, taper <new> ou <pass>");
      } while (choix != "mod" && choix != "new" && choix != "pass");
      //Le choix a été fait
      if (choix == "new") {
        let mot;
        let essai = 0;
        do {
          if (essai > 0) {
            if (!Player.check_new_word(mot) && !Player.real_word(mot)) {
              console.log("Rien ne vas !!")
            }
            else if (!Player.check_new_word(mot)) {
              console.log("L'adversaire n'a pas toutes ces lettres sur son tapis")
            }
            else if (!Player.real_word(mot)) {
              console.log("Ce mot n'est pas dans le dico")
            }
          }
          essai++
          mot = await this.ask("Quelle mot créer à partir de ces lettres ?");
        } while (!Player.check_new_word(mot) || !Player.real_word(mot));
        this.words.push(mot);
        for (let i = 0; i < mot.length; i++) {
          let index = Player.letters.indexOf(mot[i])
          Player.letters.splice(index, 1);
        }
        logToFile("Coups_Jarnaque.txt", `HAHAHAHA le joueur ${this.id} a volé le mot ${mot} au joueur ${Player.id} en se servant seulement dans son tapis !!!`);
        setTimeout(() => {}, 2000);
        return rejouer
      } else if (choix == "mod") {
        let mot;
        let num;
        let essai = 0;
        do {
          if (essai > 0) {
            if (!Player.check_word(mot, num) && !Player.real_word(mot)) {
              console.log("Rien ne vas !!")
            }
            else if (!Player.check_word(mot, num)) {
              console.log("L'adversaire n'a pas toutes ces lettres sur son tapis et sur son mot " + num + "ou bien le nouveau mot n'a pas toutes les lettres de l'ancien mot")
            }
            else if (!Player.real_word(mot)) {
              console.log("Ce mot n'est pas dans le dico")
            }
          }
          essai++
          num = await this.ask("Entrez l'index du mot à changer (0 à 7) : ");
          mot = await this.ask("Quelle mot créer à partir de ces lettres ? ");
        } while (!Player.check_word(mot, num) || !Player.real_word(mot));
        this.words.push(mot)
        let availableLetters = Player.letters.slice();
        let word = Player.words[num]
        let availableLetters_and_word = availableLetters.concat(word.split(''));
        for (let i = 0; i < mot.length; i++) {
          let index = availableLetters_and_word.indexOf(mot[i])
          availableLetters_and_word.splice(index, 1);
        }
        Player.letters = availableLetters_and_word
        logToFile("Coups_Jarnaque.txt", `HAHAHAHA le joueur ${this.id} a volé le mot ${mot} au joueur ${Player.id} en lui prenant son mot ${Player.words[num]} et en se servant dans son tapis !!!`);
        setTimeout(() => {}, 2000);
        Player.words.splice(num,1)
        return rejouer
      } else if (choix == "pass") {
        rejouer = false;
        return rejouer
      } 
    }
  }
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

  let Player1 = new PlayerBoard(1);
  let Player2 = new PlayerBoard(2);

  // on rempli tapis 
  for (let j = 0; j <= 5; j++) {
    carte1 = getRandomLetter(letterBag)
    carte2 = getRandomLetter(letterBag)
    Player1.add_letter(carte1)
    Player2.add_letter(carte2)
  }

  let Player = Player1;
  let end_game;
  console.log("\n\n\n---------C'est au joueur 1 de jouer !!!-----------\n")
  do {
    do {
      console.log("Deck -> " + letterBag.length + " cartes")
      rejouer = await Player.create_word(letterBag)
      end_game = Player.end_of_game()
      if (end_game == true) {
        break
      }
    } while (rejouer)
    let Player_pass = Player
    if (Player == Player1) {
      Player = Player2
    } else if (Player == Player2) {
      Player = Player1
    }
    if (Player == Player1) {
      console.log("\n\n\n---------C'est au joueur 1 de jouer !!!-----------\n")
    } else if (Player == Player2) {
      console.log("\n\n\n---------C'est au joueur 2 de jouer !!!-----------\n")
    }
    if (!end_game) {
      do {
        rejouer = await Player.arnaquer_ou_pas(Player_pass)
        end_game = Player.end_of_game()
      } while (rejouer)
    }    
    // A chaque changement de joueur, on tire ou echange trois lettres
    await Player.draw_or_exchange(letterBag)
  } while (!end_game)
  let result1 = Player1.count_points()
  let result2 = Player2.count_points()
  if (result1 < result2) {
    console.log("Le gagnant est le joueur 2")
    console.log("Ses mots sont : ", Player2.words)
  } else if (result1 > result2) {
    console.log("Le gagnant est le joueur 1")
    console.log("Ses mots sont : ", Player1.words)
  } else {
    console.log("EGALITE")
  }

}

Game()