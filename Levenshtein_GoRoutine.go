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

type Task struct {
	i, j       int
	str1, str2 string
	distance   int
}

// Worker est une goroutine qui calcule la distance de Levenshtein entre 2 tasks

func worker(tasks <-chan Task, results chan<- Task, wg *sync.WaitGroup) {
	defer wg.Done()
	for task := range tasks {
		task.distance = LevenshteinDistance(task.str1, task.str2)
		results <- task
	}
}

func main() {
	words := []string{"apple", "banana", "orange", "grape"}
	numWorkers := 2 // Nombre arbitraire de travailleurs.
	n := len(words)

	tasks := make(chan Task, n*n)
	results := make(chan Task, n*n)
	var wg sync.WaitGroup

	// Assigner les tâches.
	//Possibilités de faire commencer j à i+1 ??? pour gagner du temps
	for i := 0; i < n; i++ {
		for j := 0; j < n; j++ {
			tasks <- Task{i, j, words[i], words[j], 100}
		}
	}
	close(tasks)

	// Lancer les travailleurs.
	for w := 0; w < numWorkers; w++ {
		wg.Add(1)
		go worker(tasks, results, &wg)
	}

	// Attendre la fin des tâches.
	go func() {
		wg.Wait()
		close(results)
	}()

	//Afficher résultats
	for task := range results {
		fmt.Printf("distances entre %s et %s est : %d\n", task.str1, task.str2, task.distance)
	}
}
