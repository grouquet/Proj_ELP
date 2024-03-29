package main

import (
	"bufio"
	"fmt"
	"net"
	"strings"
	"sync"
)

// Fonction principale pour démarrer le serveur
func main() {
	portString := ":8000" // Définissez le port sur lequel le serveur doit écouter
	ln, err := net.Listen("tcp", portString)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer ln.Close()
	fmt.Println("serveur sur écoute")
	var wg sync.WaitGroup

	i := 1 // seulemnt pour voir n° du client
	for {  //boucle infinie
		conn, err := ln.Accept() //ln.Accept() est bloquant (le programme s'arrête et attend une connection)
		if err != nil {
			fmt.Println(err)
			continue
		}
		fmt.Println("connexion acceptée")
		wg.Add(1)
		go handleClient(conn, &wg) // Gérer chaque client dans une goroutine séparée
		fmt.Printf("client n° %v\n", i)
		i = i + 1
	}
	wg.Wait()
}

// Fonction pour gérer la connexion d'un client
func handleClient(conn net.Conn, wg *sync.WaitGroup) {
	defer wg.Done()
	defer conn.Close()

	reader := bufio.NewReader(conn) //buffer sur la connexion
	errorOccured := false
	words := []string{}

	for {
		message, err := reader.ReadString(' ')
		if err != nil {
			fmt.Println(err)
			errorOccured = true
			break
		}
		clean_message := strings.TrimSpace(message) //nettoyer espaces blancs avant et après
		if clean_message == "F" {
			break
		}
		words = append(words, clean_message)
	}
	fmt.Printf("les mots reçus sont : %s\n", words)
	if errorOccured == true {
		excuse := "désolé ça n'a pas marché"
		conn.Write([]byte(excuse + "\n"))
		return
	}
	numWorkers := 2 // Nombre arbitraire de travailleurs.
	n := len(words)
	N := n * (n - 1) / 2 // nombre de paire qu'il y aura à comparer
	tasks := make(chan Task, N)
	results := make(chan Task, N)
	var wga sync.WaitGroup

	// Assigner les tâches.
	//Possibilités de faire commencer j à i+1 ??? pour gagner du temps
	for i := 0; i < n; i++ {
		for j := i + 1; j < n; j++ {
			tasks <- Task{i, j, words[i], words[j], 100}
		}
	}
	close(tasks)
	// Lancer les travailleurs.
	for w := 0; w < numWorkers; w++ {
		wga.Add(1)
		go worker(tasks, results, &wga)
	}
	// Attendre la fin des tâches.
	go func() {
		wga.Wait()
		close(results)
	}()
	var message_retour string
	for result := range results {
		response := fmt.Sprintf("   distances entre %s et %s est : %v   |", result.str1, result.str2, result.distance)
		message_retour = fmt.Sprintf("%s %s", message_retour, response)
	}
	// Envoyer la réponse
	conn.Write([]byte(message_retour + "\n"))
	fmt.Println("c'est envoyé au client !!!")

}

func min(a, b, c int) int {
	if a < b {
		if a < c {
			return a
		}
		return c
	}
	if b < c {
		return b
	}
	return c
}

func LevenshteinDistance(a, b string) int {
	lenA, lenB := len(a), len(b)

	// Initialiser une matrice pour stocker les distances intermédiaires
	matrix := make([][]int, lenA+1)
	for i := range matrix {
		matrix[i] = make([]int, lenB+1)
	}

	// Initialiser la première ligne et la première colonne de la matrice
	for i := 0; i <= lenA; i++ {
		matrix[i][0] = i
	}
	for j := 0; j <= lenB; j++ {
		matrix[0][j] = j
	}

	// Calculer les distances
	for i := 1; i <= lenA; i++ {
		for j := 1; j <= lenB; j++ {
			cost := 0
			if a[i-1] != b[j-1] {
				cost = 1
			}
			matrix[i][j] = min(
				matrix[i-1][j]+1,      // Suppression
				matrix[i][j-1]+1,      // Insertion
				matrix[i-1][j-1]+cost, // Substitution
			)
		}
	}

	// La distance finale se trouve dans le coin inférieur droit de la matrice
	return matrix[lenA][lenB]
}

type Task struct {
	i, j       int
	str1, str2 string
	distance   int
}

// Worker est une goroutine qui calcule la distance de Levenshtein entre 2 chaines d'une Task
func worker(tasks <-chan Task, results chan<- Task, wg *sync.WaitGroup) {
	defer wg.Done()
	for task := range tasks {
		task.distance = LevenshteinDistance(task.str1, task.str2)
		results <- task
	}
}
