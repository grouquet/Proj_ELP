package main

import (
	"bufio"
	"fmt"
	"net"
)

func main() {
	portString := ":8000"
	phrase := "banane pomme ananas fraise poire F " // bien envoyé avec un F à la fin
	conn, err := net.Dial("tcp", portString)
	if err != nil {
		fmt.Println("la connexion à échouée")
		return
	}
	fmt.Println("connexion établie")
	defer conn.Close()
	conn.Write([]byte(phrase))
	fmt.Println("c'est écrit")

	reader := bufio.NewReader(conn)
	message, err := reader.ReadString('\n')
	if err != nil {
		fmt.Println("Erreur lors de la lecture de la réponse:", err)
		return
	}
	fmt.Println("c'est lu")
	print(message)
	return
}
