post:
	@echo "POST request"
	@curl \
	-H "Content-Type: application/json" \
	-d '{"strokes":"[[1,2,0],[3,4,0]]", "i":"1000"}' \
	-X POST http://127.0.0.1:8080/post
	@echo ""

get:
	@echo "GET request"
	@curl \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-X POST \
	-d strokes=[[1,2,3],[4,5,6]] \
	-d i=100 \
	http://127.0.0.1:8080/get \
	@echo ""