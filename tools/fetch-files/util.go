package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	_ "image/png"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

func fetch_urls(url string) []string {

	var urls []string

	var jsonm = []byte(`{"foo":"bar"}`)

	req, err := http.NewRequest("GET", url, bytes.NewBuffer(jsonm))
	if err != nil {
		fmt.Printf("http.NewRequest() error: %v\n", err)
		return urls
	}

	req.Header.Add("Content-Type", "application/json")

	c := &http.Client{}
	resp, err := c.Do(req)
	if err != nil {
		fmt.Printf("http.Do() error: %v\n", err)
		return urls
	}
	defer resp.Body.Close()

	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("ioutil.ReadAll() error: %v\n", err)
		return urls
	}

	if err := json.Unmarshal(data, &urls); err != nil {
		panic(err)
	}

	return urls
}

func download_files(urls []string) {
	for i, url := range urls {
		_ = i
		fmt.Println(url)
		slice := strings.Split(url, "/")
		filename := slice[len(slice)-1]

		destination := output_dir + "/" + filename
		download(url, destination)
	}
}

func download(url string, destination string) {

	// time.Sleep(time.Second / 7)

	// Just a simple GET request to the image URL
	// We get back a *Response, and an error
	res, err := http.Get(url)

	if err != nil {
		log.Fatalf("http.Get -> %v", err)
	}

	// We read all the bytes of the image
	// Types: data []byte
	data, err := ioutil.ReadAll(res.Body)

	if err != nil {
		log.Fatalf("ioutil.ReadAll -> %v", err)
	}

	// You have to manually close the body, check docs
	// This is required if you want to use things like
	// Keep-Alive and other HTTP sorcery.
	res.Body.Close()

	// You can now save it to disk or whatever...
	ioutil.WriteFile(destination, data, 0666)
	// jpgFrom("./tmp/stroke.png")

}
