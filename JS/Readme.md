
Lancer le jeu :
    Avoir Node.js installé sur votre machine
    Saisir la commande : "node Jarnaque_V5.js"
    Suivre les instructions en ligne de commande 


Réalisation des coups de Jarnaque :
    Lors de l'exécution du programme, un fichier texte "Coups_Jarnaque" se créer dans le même répertoire (si celui-ci existe déjà alors il est remplacé).
    Chaque ligne du fichier présente un coup de Jarnaque en indiquant le rôle des joueurs ainsi que le mot crée et le mot volé (si il y en a un).

Jarnaque : 
    Le jeu se sert du fichier dictionnaire.json pour vérifier la validité des mots saisies. Celui-ci étant crée par l'exécution du programme transfo_json.py qui transforme le fichier liste_de_mot.json pour obtenir un format des données plus accessible.
    Cette liste de mot rassemble un grand nombre de mots français et conserve les mots avec des accents mais sans ces derniers ("éléphant -> elephant).
    Le répertoire création_du_jeu contient les versions antérieurs de Jarnaque_V5.js.
    A propose du jeu :
        Les fautes de frappes sont gérée dans la plupart des cas mais lorsqu'un choix (créer un mot, passer,...) est fait, on ne peut plus revenir en arrière.
        Enfin, dans cette version du jeu, lorsque le jeu change de joueur, celui qui prend la main peut effectuer un nombre illimité de coup Jarnaque.

    

