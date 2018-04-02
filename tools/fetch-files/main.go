package main

import (
	"flag"
	"fmt"
)

var (
	output_dir = ""
)

func main() {

	url := flag.String("url", "", "URL to json api to fetch images from.")
	dir := flag.String("dir", "", "Output directory path to save downloaded images.")

	flag.Parse()
	if *url == "" || *dir == "" {
		flag.Usage()
		return
	}

	output_dir = *dir

	fmt.Println("Fetching from", *url+"...")

	var urls = fetch_urls(*url)
	download_files(urls)

}
