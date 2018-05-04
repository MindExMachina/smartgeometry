BASE_URL=https://stream.watsonplatform.net/speech-to-text/api
USERNAME=94d887db-3590-4f59-a306-e6a0d480e9f4
PASSWORD=A5qOBFds7tDw

# ffmpeg -i audio.xxx -c:a flac audio.flac

# Transcribe audio with no options
transcribe:
	@curl -X POST --user "$(USERNAME)":"$(PASSWORD)" \
	--header "Content-Type: audio/flac" \
	--data-binary @assets/audio-file.flac \
	"$(BASE_URL)/v1/recognize"

# Transcribe audio with additional options
transcribe_options:
	@curl -X POST --user "$(USERNAME)":"$(PASSWORD)" \
	--header "Content-Type: audio/flac" \
	--data-binary @assets/audio-file.flac \
	"$(BASE_URL)/v1/recognize?timestamps=true&max_alternatives=3"

# 
pizza:
	@curl -X POST --user "$(USERNAME)":"$(PASSWORD)" \
	--header "Content-Type: audio/flac" \
	--data-binary @assets/pizza.flac \
	"$(BASE_URL)/v1/recognize"

mind:
	@curl -X POST --user "$(USERNAME)":"$(PASSWORD)" \
	--header "Content-Type: audio/flac" \
	--data-binary @assets/mind.flac \
	"$(BASE_URL)/v1/recognize?timestamps=true&max_alternatives=3"