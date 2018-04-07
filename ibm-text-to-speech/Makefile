BASE_URL=https://stream.watsonplatform.net/text-to-speech/api
USERNAME=22f40419-b213-4167-91b1-7360998d8cb7
PASSWORD=aswk4dlOxhiY

# Synthesize text in US English (saving as .wav)
synthesize:
	@curl -X POST -u "$(USERNAME)":"$(PASSWORD)" \
	--header "Content-Type: application/json" \
	--data "{\"text\":\"hello world\"}" \
	--output hello_world.wav \
	"$(BASE_URL)/v1/synthesize"

# Synthesize text in US English (saving as .ogg)
synthesize_ogg:
	@curl -X POST -u "$(USERNAME)":"$(PASSWORD)" \
	--header "Content-Type: application/json" \
	--data "{\"text\":\"hello world\"}" \
	--output hello_world.ogg \
	"$(BASE_URL)/v1/synthesize"

# Synthesize text in Spanish (saving as .wav)
synthesize_spanish:
	@curl -X POST --user "$(USERNAME)":"$(PASSWORD)" \
	--output hola_mundo.wav \
	"$(BASE_URL)/v1/synthesize?accept=audio/wav&text=hola%20mundo&voice=es-ES_EnriqueVoice"