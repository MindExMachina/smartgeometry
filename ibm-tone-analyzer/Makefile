BASE_URL=https://gateway.watsonplatform.net/tone-analyzer/api
USERNAME=6f924834-52fd-47be-8593-317bf2386a27
PASSWORD=G6yAzq0Jck84

analyze:
	@echo ""
	@curl -X POST --user "$(USERNAME)":"$(PASSWORD)" \
	--header "Content-Type: application/json" \
	--data-binary @tone.json \
	"$(BASE_URL)/v3/tone?version=2017-09-21"
	@echo ""
	@echo ""

analyze2:
	@echo ""
	@curl -X POST --user "$(USERNAME)":"$(PASSWORD)" \
	--header "Content-Type: application/json" \
	--data-binary @tone2.json \
	"$(BASE_URL)/v3/tone?version=2017-09-21"
	@echo ""
	@echo ""