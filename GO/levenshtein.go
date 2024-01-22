package main

import (
	"fmt"
	"sync"
)

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

func main() {
	reference := "exemple"
	inputData := []string{"example", "exemple", "exemplaire", "test", "essai"}

	var wg sync.WaitGroup
	inputChan := make(chan string, len(inputData))
	resultsChan := make(chan int, len(inputData))

	// Remplir la file d'attente avec les données d'entrée
	for _, s := range inputData {
		inputChan <- s
	}
	close(inputChan)

	// Nombre de goroutines
	numWorkers := 3

	// Diviser les données entre les goroutines
	chunkSize := (len(inputData) + numWorkers - 1) / numWorkers
	for i := 0; i < numWorkers; i++ {
		start := i * chunkSize
		end := (i + 1) * chunkSize
		if end > len(inputData) {
			end = len(inputData)
		}

		wg.Add(1)
		go func(start, end int) {
			defer wg.Done()
			// Traitement des sous-listes
			for j := start; j < end; j++ {
				distance := LevenshteinDistance(reference, inputData[j])
				resultsChan <- distance
			}
		}(start, end)
	}

	// Attendre la fin de toutes les goroutines
	// wg.Wait aussi en goroutine ici
	go func() {
		wg.Wait()
		close(resultsChan)
	}()

	// Récupérer les résultats
	for distance := range resultsChan {
		fmt.Println("Distance:", distance)
	}
}
