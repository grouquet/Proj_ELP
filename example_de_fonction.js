// compter les points finale pour joueur
function count_point(Player) {
  let score = 0;
  for (let i = 0; i < Player.words.length; i++) {
    score = Player.words[i].length * Player.words[i].length + score;
  }
  return score;
}

// un exemple pour compter les points
let Player1 = new PlayerBoard();
let Player2 = new PlayerBoard();
Player1.words = ["test", "test2", "test3"];
Player2.words = ["tes", "test", "test"];
score1 = count_point(Player1);
score2 = count_point(Player2);
console.log("le résultat du Joueur 1 est de ", score1);
console.log("le résultat du Joueur 2 est de ", score2);

//un exemple pour enregister les actions dans un fichier
const fs = require("fs");
const path = require("path");

function redirectConsoleOutputToFileAndDisplay(outputFilePath) {
  const filePath = path.join(__dirname, outputFilePath);
  const writeStream = fs.createWriteStream(filePath);
  const originalStdoutWrite = process.stdout.write;

  process.stdout.write = (data) => {
    writeStream.write(data);
    originalStdoutWrite.call(process.stdout, data);
  };

  console.log(
    "A partir de maitenant, les actions vont sauvegarder dans le fichier: " +
      filePath,
  );

  process.on("exit", () => {
    writeStream.end();
    console.log("Enregistrement fini，le fichier est: " + filePath);
  });
}

// un exemple d'utilisation
redirectConsoleOutputToFileAndDisplay("output.txt");

// simuler les output depuis un terminal
console.log("dafadsfasdfasdfadsfasd。");
console.log("1234654651321654654655。");
console.log("f4sdf4d56s4f65sd4f5sd4f65f45sd6f45sd6f465sd4f65。");
setTimeout(() => {
  console.log("processus fini。");
  process.exit();
}, 5000);




// echanger 3 cartes ou piocher 1 carte
function draw_letter(Player, letterBag) {
  let new_letter = letterBag.pop();
  Player.letters.push(new_letter);
}

function shuffle_letters(letterBag) {
  for (let i = letterBag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letterBag[i], letterBag[j]] = [letterBag[j], letterBag[i]];
  }
}

async function draw_or_exchange(Player, letterBag) {
  console.log("Deck -> " + letterBag.length + " cartes");
  console.log("Votre tapis : ", Player.letters);
  if (Player.words.length == 0) {
    console.log("Aucun mot crée pour l'instant");
  } else {
    console.log("Mots actuels :  " + Player.words.join(", "));
  }
  let draw_exchange = await Player.ask(
    "<draw> pour piocher une lettre, ou <exchange> pour echanger trois lettre: ",
  );
  while (draw_exchange !== "draw" && draw_exchange !== "exchange") {
    console.log("Vous avez fait une erreur de saisie");
    draw_exchange = await Player.ask(
      "<draw> pour piocher une lettre, ou <exchange> pour echanger trois lettre: ",
    );
  }

  if (draw_exchange == "draw") {
    draw_letter(Player, letterBag);
  }
  if (draw_exchange == "exchange") {
    card_to_exchange1 = await Player.ask(
      "Choisissez une lettre pour echanger(1/3): ",
    );
    card_to_exchange2 = await Player.ask(
      "Choisissez une lettre pour echanger(2/3): ",
    );
    card_to_exchange3 = await Player.ask(
      "Choisissez une lettre pour echanger(3/3): ",
    );

    while (
      Player.letters.indexOf(card_to_exchange1) == -1 ||
      Player.letters.indexOf(card_to_exchange2) == -1 ||
      Player.letters.indexOf(card_to_exchange3) == -1
    ) {
      console.log("Vous n'avez pas ces lettres");
      card_to_exchange1 = await Player.ask(
        "Choisissez une lettre pour echanger(1/3): ",
      );
      card_to_exchange2 = await Player.ask(
        "Choisissez une lettre pour echanger(2/3): ",
      );
      card_to_exchange3 = await Player.ask(
        "Choisissez une lettre pour echanger(3/3): ",
      );
    }
    let index1 = Player.letters.indexOf(card_to_exchange1);
    Player.letters.splice(index1, 1);
    let index2 = Player.letters.indexOf(card_to_exchange2);
    Player.letters.splice(index2, 1);
    let index3 = Player.letters.indexOf(card_to_exchange3);
    Player.letters.splice(index3, 1);
    draw_letter(Player, letterBag);
    draw_letter(Player, letterBag);
    draw_letter(Player, letterBag);
  }
}
