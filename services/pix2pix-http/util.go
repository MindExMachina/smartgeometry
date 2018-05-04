package main

import (
	"fmt"
	"net"
	"os"
	"os/exec"
)

// Env retrieves an environment variable from the .env file
func Env(s string) string {
	value := os.Getenv(s)
	if value == "" {
		log.WithField(s, value).Fatal("$" + s + " must be set")
	}
	return value
}

// Get retrieves your network ip (e.g., 10.0.0.200 instead of 127.0.0.1)
func Get() string {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		fmt.Println("Oops: " + err.Error() + "\n")
		os.Exit(1)
		return ""
	}

	for _, a := range addrs {
		if ipnet, ok := a.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				return ipnet.IP.String()
			}
		}
	}
	return ""
}

// Pix2pixGenerate generates an output image using a pix2pix model.
func Pix2pixGenerate(modelDir, inputFile, outputFile string) {

	cmd := exec.Command(
		"python2",
		Env("PIX2PIX_PROCESSLOCALPY"),
		"--model_dir",
		modelDir,
		"--input_file",
		inputFile,
		"--output_file",
		outputFile,
	)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Run()
	// log.Println(cmd.Run())
}
