# Generate an output image with a pix2pix model path (or with a model id and models root path).
# (a) providing the model_export path of your pix2pix model
# e.g., make pix path=3 path=/path/to/your/model_export
# (b) providing the name of the model and the root directory where your models live
# e.g., make pix model=3 dir=/path/to/your/models
# e.g., make pix model=3 name=tulips
pix:
	@curl -X POST \
	--form "image_file=@flower.png" \
	--form "model_path=$(path)" \
	--form "model=$(model)" \
	--form "dir=$(dir)" \
    "http://localhost:8000/pix2pix" > "flower-pix2pix-$(name).png"
	@echo ""

# Blur an image.
# e.g., make blur sigma=10
blur:
	@curl -X POST --form \
	"image_file=@flower.png" \
	--form "sigma=$(sigma)" \
	"http://localhost:8000/blur" > "flower-blur.png"
	@echo ""