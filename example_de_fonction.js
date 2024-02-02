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
