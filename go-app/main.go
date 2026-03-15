package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

type Response struct {
	Status    string `json:"status"`
	Framework string `json:"framework"`
	Message   string `json:"message"`
	Timestamp string `json:"timestamp"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(Response{
			Status:    "ok",
			Framework: "go",
			Message:   "Hello from Go on Veloz!",
			Timestamp: time.Now().Format(time.RFC3339),
		})
	})

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "healthy"})
	})

	fmt.Printf("Server running on port %s\n", port)
	http.ListenAndServe(":"+port, nil)
}
