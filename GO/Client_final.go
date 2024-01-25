package main

import (
	"bufio"
	"fmt"
	"net"
)

func main() {
	portString := ":8000"
	// bien envoyé avec un F à la fin
	phrase := "banane pomme ananas fraise poire F "
	conn, err := net.Dial("tcp", portString)
	if err != nil {
		fmt.Println("La connexion à échouée")
		return
	}
	defer conn.Close()
	conn.Write([]byte(phrase))
	fmt.Println("Requête envoyée au serveur.\n")

	reader := bufio.NewReader(conn)
	message, err := reader.ReadString('$')
	if err != nil {
		fmt.Println("Erreur lors de la lecture de la réponse:", err)
		return
	}
	fmt.Println("Réponse du serveur reçue.\n")
	fmt.Println(message)
	return
}
