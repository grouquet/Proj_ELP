package main

import (
	"bufio"
	"fmt"
	"net"
	"os"
	"strings"
)

func main() {
	// 服务器地址和端口
	const serverAddr = "127.0.0.1:4567"

	// 连接到服务器
	conn, err := net.Dial("tcp", serverAddr)
	if err != nil {
		fmt.Println("Error connecting:", err)
		os.Exit(1)
	}
	defer conn.Close()
	fmt.Println("Connected to server at", serverAddr)

	// 创建读取器用于读取服务器的响应
	reader := bufio.NewReader(conn)

	// 从标准输入读取数据
	consoleReader := bufio.NewReader(os.Stdin)
	fmt.Println("Enter text to send to the server. Type 'exit' to close the connection.")

	fmt.Print("> ")
	userInput, _ := consoleReader.ReadString('\n')
	trimmedInput := strings.TrimSpace(userInput)

	// 发送数据到服务器
	_, err = conn.Write([]byte(trimmedInput + "\n"))
	if err != nil {
		fmt.Println("Error sending message:", err)
		os.Exit(1) // 如果发送失败，立即退出
	}

	// 接收服务器的响应
	response, err := reader.ReadString('\n')
	if err != nil {
		fmt.Println("Error reading response:", err)
		os.Exit(1) // 如果读取失败，立即退出
	}
	fmt.Print("Server response: ", response)

	// 收到响应后立即退出
	os.Exit(0)
}
