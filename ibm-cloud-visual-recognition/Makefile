# todo: delete api key and put a placeholder
API_KEY=fdc8c597eb50cdb8c4ffe07a1c4d4936f62d7070

classify_fruits:
	@curl -X POST --form "images_file=@fruitbowl.jpg" \
	"https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key=$(API_KEY)&version=2016-05-20"

recognize_face:
	@curl -X POST --form "images_file=@prez.jpg" \
	"https://gateway-a.watsonplatform.net/visual-recognition/api/v3/detect_faces?api_key=$(API_KEY)&version=2016-05-20"

classify_circle:
	@curl -X POST --form "images_file=@circle.png" \
	--form "parameters=@myparams.json" \
	"https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key=$(API_KEY)&version=2016-05-20"


create_dogs_classifier:
	@curl -X POST \
	--form "beagle_positive_examples=@beagle.zip" \
	--form "husky_positive_examples=@husky.zip" \
	--form "goldenretriever_positive_examples=@golden-retriever.zip" \
	--form "negative_examples=@cats.zip" \
	--form "name=dogs" \
	"https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers?api_key=$(API_KEY)&version=2016-05-20"

create_square_circle_classifier:
	@curl -X POST \
	--form "circle_positive_examples=@models/circle.zip" \
	--form "square_positive_examples=@models/square.zip" \
	--form "name=circle_or_square" \
	"https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers?api_key=$(API_KEY)&version=2016-05-20"	

training_status:
	@curl -X GET \
	"https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers/circle_or_square_138209706?api_key=$(API_KEY)&version=2016-05-20"