# Generate an output image with a pix2pix model.
# e.g., make pix model=3
# e.g., make pix model=3 name=tulips
pix:
	@curl -X POST --form "images_file=@flower.png" \
	--form "model=$(model)" \
	--form "dir=$(dir)" \
    "http://localhost:8000/pix2pix" > "flower-pix2pix-$(name).png"
	@echo ""

# Blur an image.
# e.g., make blur sigma=10
blur:
	@curl -X POST --form "images_file=@flower.png" \
	--form "sigma=$(sigma)" \
	"http://localhost:8000/blur" > "flower-blur.png"
	@echo ""