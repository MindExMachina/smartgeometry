API_KEY=fdc8c597eb50cdb8c4ffe07a1c4d4936f62d7070

classify_fruits:
	@curl -X POST --form "images_file=@fruitbowl.jpg" \
	"https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key=$(API_KEY)&version=2016-05-20"

recognize_face:
	@curl -X POST --form "images_file=@prez.jpg" \
	"https://gateway-a.watsonplatform.net/visual-recognition/api/v3/detect_faces?api_key=$(API_KEY)&version=2016-05-20"