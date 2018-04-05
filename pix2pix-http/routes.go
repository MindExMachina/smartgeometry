package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"image/jpeg"
	"io"
	"net/http"
	"os"
	"strconv"

	"github.com/disintegration/imaging"
	"github.com/gorilla/mux"
)

// MakeRoutes creates the http routes.
func MakeRoutes() {

	// Define http routes.

	r := mux.NewRouter()
	r.HandleFunc("/", getHomeHandler)
	r.HandleFunc("/pix2pix", postPix2pixHandler).Methods("POST")
	r.HandleFunc("/blur", postProcessImageBlurHandler).Methods("POST")

	// Start the server.

	http.Handle("/", r)
	log.Fatal(http.ListenAndServe(":"+Env("PORT"), nil))
}

func getHomeHandler(w http.ResponseWriter, r *http.Request) {
	// json output
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusCreated)
	j, _ := json.Marshal(struct {
		Success bool   `json:"working"`
		Error   string `json:"message"`
	}{true, "pix2pix http is running"})
	w.Write(j)
}

func postProcessImageBlurHandler(w http.ResponseWriter, r *http.Request) {

	// Get form values

	var sigma string
	if r.Method == "POST" {
		sigma = r.FormValue("sigma")
		fmt.Println("sigma", sigma)
	}

	// Copy image

	f, err := copyFile(w, r, "images_file", "./tmp")
	if err == nil {
		// ..
	}

	// Open and Blur image

	srcImage, err := imaging.Open("./tmp/" + f)
	if err != nil {
		log.Fatalf("Open failed: %v", err)
	}
	sigmaFloat, err := strconv.ParseFloat(sigma, 64)
	if err != nil {
		// ..
	}
	dstImage := imaging.Blur(srcImage, sigmaFloat)

	// Save the resulting image.

	err = imaging.Save(dstImage, ("./tmp/blur-" + f))
	if err != nil {
		log.Fatalf("failed to save image: %v", err)
	}

	buffer := new(bytes.Buffer)
	err = jpeg.Encode(buffer, dstImage, nil)

	// Output image data

	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "image/png; charset=UTF-8")

	if _, err := w.Write(buffer.Bytes()); err != nil {
		log.Println("unable to write image.")
	}
}

func postPix2pixHandler(w http.ResponseWriter, r *http.Request) {

	// Get form values

	// var model string
	// var modelsRoot string
	var modelPath string
	if r.Method == "POST" {
		// model = r.FormValue("model")
		// modelsRoot = r.FormValue("dir")
		modelPath = r.FormValue("model_path")
	}

	// Copy image

	f, err := copyFile(w, r, "images_file", "./tmp")
	if err == nil {
		// ..
	}

	// Open and generate pix2pix output image

	// if modelPath == "" {
	// 	modelID, _ := strconv.Atoi(model)
	// 	modelPath = pix2pix.ModelDirWithRootPath(modelID, modelsRoot)
	// }

	inputPath := "./tmp/" + f
	outputPath := "./tmp/pix-" + f
	Pix2pixGenerate(modelPath, inputPath, outputPath)

	outputImage, err := imaging.Open(outputPath)
	if err != nil {
		log.Fatalf("Open failed: %v", err)
	}

	// Get the byte buffer of the output image.

	buffer := new(bytes.Buffer)
	err = jpeg.Encode(buffer, outputImage, nil)

	// Output image data

	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "image/png; charset=UTF-8")

	if _, err := w.Write(buffer.Bytes()); err != nil {
		log.Println("unable to write image.")
	}
}

// Helpers for copying POST form files

// copyfile
func copyFile(w http.ResponseWriter, r *http.Request, formfile string, target string) (string, error) {
	// https://astaxie.gitbooks.io/build-web-application-with-golang/content/en/04.5.html
	r.ParseMultipartForm(32 << 20)
	file, handler, err := r.FormFile(formfile)
	if err != nil {
		return "", err
	}
	defer file.Close()

	f, err := os.OpenFile(target+"/"+handler.Filename, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	defer f.Close()
	io.Copy(f, file)

	return handler.Filename, nil
}

// copyFileWithName
func copyFileWithName(w http.ResponseWriter, r *http.Request, formfile string, target string) (string, error) {
	// https://astaxie.gitbooks.io/build-web-application-with-golang/content/en/04.5.html
	r.ParseMultipartForm(32 << 20)
	file, handler, err := r.FormFile(formfile)
	if err != nil {
		return "", err
	}
	defer file.Close()

	f, err := os.OpenFile(target+"/"+r.FormValue("filename"), os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	defer f.Close()
	io.Copy(f, file)

	return handler.Filename, nil
}
