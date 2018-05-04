BASE_URL=https://gateway.watsonplatform.net/tone-analyzer/api
USERNAME=6f924834-52fd-47be-8593-317bf2386a27
PASSWORD=G6yAzq0Jck84

# POST sample 1
analyze:
	@curl -X POST --user "$(USERNAME)":"$(PASSWORD)" \
	--header "Content-Type: application/json" \
	--data-binary @tone.json \
	"$(BASE_URL)/v3/tone?version=2017-09-21"
	@echo ""

# POST sample 2
analyze2:
	@curl -X POST --user "$(USERNAME)":"$(PASSWORD)" \
	--header "Content-Type: application/json" \
	--data-binary @tone2.json \
	"$(BASE_URL)/v3/tone?version=2017-09-21"
	@echo ""

# GET sample
get:
	@curl -X GET --user "$(USERNAME)":"$(PASSWORD)" \
	"$(BASE_URL)/v3/tone?version=2017-09-21\
	&text=I%20think%20I%20am%20going%20to%20%20like%20this."
	@echo ""

# POST user engagement
engagement:
	@curl -X POST --user "$(USERNAME)":"$(PASSWORD)" \
	--header "Content-Type: application/json" \
	--data-binary @tone-chat.json \
	"$(BASE_URL)/v3/tone_chat?version=2017-09-21"
	@echo ""