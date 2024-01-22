package main

import (
	"bufio"
	"fmt"
	"io"
	"net"
	"os"
	"strings"
)

func main() {
	// 定义监听的端口
	const portString = "127.0.0.1:4567"

	// 在TCP端口上监听
	ln, err := net.Listen("tcp", portString)
	if err != nil {
		fmt.Println("Error listening:", err)
		os.Exit(1)
	}
	defer ln.Close()
	fmt.Println("Listening on", portString)

	// 循环接受新的连接
	for {
		conn, err := ln.Accept()
		if err != nil {
			fmt.Println("Error accepting connection:", err)
			continue
		}

		// 为每个客户端创建一个goroutine来处理连接
		go handleClient(conn)
	}
}

func handleClient(conn net.Conn) {
	defer conn.Close()
	fmt.Println("Connected to client", conn.RemoteAddr())

	reader := bufio.NewReader(conn)

	// 持续读取并处理来自客户端的数据
	for {
		message, err := reader.ReadString('\n')
		if err != nil {
			if err != io.EOF {
				fmt.Println("Error reading:", err)
			}
			break
		}

		fmt.Printf("Received from %v: %s", conn.RemoteAddr(), message)

		// 这里的处理是将消息转换为大写
		processedMessage := strings.ToUpper(message)

		// 将处理后的消息发送回客户端
		_, err = conn.Write([]byte(processedMessage))
		if err != nil {
			fmt.Println("Error writing:", err)
			break
		}
	}
	fmt.Println("Connection closed:", conn.RemoteAddr())
}
