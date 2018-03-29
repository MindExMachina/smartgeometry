post:
	@echo "POST request"
	@curl \
	-H "Content-Type: application/json" \
	-X POST http://127.0.0.1:8080/numbers
	@echo ""

post_numbers:
	@echo "POST request"
	@curl \
	-H "Content-Type: application/json" \
	-d '{"i":"0","numbers":"[[-4, 0, 1, 0, 0],[-15, 9, 1, 0, 0],[-10, 17, 1, 0, 0],[-1, 28, 1, 0, 0],[14, 13, 1, 0, 0],[12, 4, 1, 0, 0],[22, 1, 1, 0, 0],[14, -11, 1, 0, 0],[5, -12, 1, 0, 0],[2, -19, 1, 0, 0],[-12, -23, 1, 0, 0],[-13, -7, 1, 0, 0],[-14, -1, 0, 1, 0]]"}' \
	-X POST http://127.0.0.1:8080/numbers
	@echo ""

get:
	@echo "GET request"
	@curl \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-X GET \
	http://127.0.0.1:8080/numbers
	@echo ""

get_numbers:
	@echo "GET request"
	@curl \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-X GET \
	-d numbers=[[1,2,3],[4,5,6]] \
	-d i=100 \
	http://127.0.0.1:8080/numbers
	@echo ""

get_color:
	@curl \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-X GET \
	http://127.0.0.1:8080/color/red
	@echo ""