package main

import (
	"fmt"
)

// min returns the minimum of three integers
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

// levenshteinDistance calculates the Levenshtein distance between two strings
func levenshteinDistance(str1, str2 string) int {
	lenStr1 := len(str1)
	lenStr2 := len(str2)
	dp := make([][]int, lenStr1+1)

	for i := range dp {
		dp[i] = make([]int, lenStr2+1)
	}

	for i := 0; i <= lenStr1; i++ {
		dp[i][0] = i
	}
	for j := 0; j <= lenStr2; j++ {
		dp[0][j] = j
	}

	for i := 1; i <= lenStr1; i++ {
		for j := 1; j <= lenStr2; j++ {
			if str1[i-1] == str2[j-1] {
				dp[i][j] = dp[i-1][j-1]
			} else {
				dp[i][j] = min(dp[i-1][j-1]+1, dp[i][j-1]+1, dp[i-1][j]+1)
			}
		}
	}

	return dp[lenStr1][lenStr2]
}

func main() {
	str1 := "zino"
	str2 := "xinyu"
	distance := levenshteinDistance(str1, str2)
	fmt.Printf("The Levenshtein Distance between %s and %s is %d.\n", str1, str2, distance)
}