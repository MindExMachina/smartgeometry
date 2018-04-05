# pix2pix-http

pix2pix as an http service.

Feed and output image and generate an output image using different models over http requests.

## Requirements

- [TensorFlow](https://www.tensorflow.org/install/) (>= 1.4.1)
- [pix2pix](https://github.com/affinelayer/pix2pix-tensorflow)
- Set the `PIX2PIX_PROCESSLOCALPY` environment variable (in the `.env` file) path to your pix2pix `process-local.py` path (i.e., `pix2pix-tensorflow/server/tools/process-local.py`).

## Usage

Run the http server at `127.0.0.1`.

```
go run *.go
```

The server provides two POST routes.

- `/pix` · POST Route that gets an input `image_file` and a `model_path` and retrieves a generated pix2pix output image using the pix2pix model at `model_path` and the provided `image_file`.
  - @param `image_file` · a PNG input image file of 256x256 pixels.
  - @param `model_path` · the path to a pix2pix `model_export/` exported model.
  - @output `image` · bytes of the PNG output image (also 256x256 pixels).
- `/blur` · (Test) POST route that gets an input image and retrieves it blurred with the provided `sigma`.

## Sample POST curl command

```
make pix path=/path/to/models/170331_pix-08-edges2sunflowers-200e/model_export
```

## Makefile

```bash
# Generate an output image with a pix2pix model path (or with a model id and models root path).
# (a) providing the model_export path of your pix2pix model
# e.g., make pix path=3 path=/path/to/your/model_export
# (b) providing the name of the model and the root directory where your models live
# e.g., make pix model=3 dir=/path/to/your/models
# e.g., make pix model=3 name=tulips
pix:
	@curl -X POST --form "images_file=@flower.png" \
	--form "model_path=$(path)" \
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
```