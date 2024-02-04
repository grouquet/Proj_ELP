Lancez le serveur puis le client sur un autre terminal. Indiquez la liste de mot dans le code client.

La logique de calcul des distances de levenshtein sur une liste de mot se base sur l'utilisation de la structure Task. Il y aura une TASK pour chaque paire de mot et celles-ci seront stockées dans un channel. Ensuite, les goroutines viennent se servir dans le channel pour calculer les distances. Puis, elles les renvoient dans un autre channel.

Lorsque le serveur reçoit une connection d'un client (alorsqu'il est sur écoute), celui-ci lance une goroutine pour s'occuper du client puis se remet sur écoute.

Le serveur envoi les distances de Levenshtein au client de manière ordonnée.

Le répertoire autres_fichiers contient les versions antérieures