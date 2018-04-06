# Tone Analyzer (IBM Cloud · Watson)

A sample use of Watson Tone Analyzer.

## Requirements

- Create an account on IBM Cloud.
- Create a Lite (free) Tony Analyzer service.
- Get your credentials (username and password) and replace them in the Makefile.

## Analyzing the tone of a Sentence

```
analyze:
	@echo ""
	@curl -X POST --user "$(USERNAME)":"$(PASSWORD)" \
	--header "Content-Type: application/json" \
	--data-binary @tone.json \
	"$(BASE_URL)/v3/tone?version=2017-09-21"
	@echo ""
	@echo ""
```

This request uses `tone.json`.

```json
{
  "text": "Team, I know that times are tough! Product sales have been disappointing for the past three quarters. We have a competitive product, but we need to do a better job of selling it!"
}
```

```
analyze2:
	@echo ""
	@curl -X POST --user "$(USERNAME)":"$(PASSWORD)" \
	--header "Content-Type: application/json" \
	--data-binary @tone2.json \
	"$(BASE_URL)/v3/tone?version=2017-09-21"
	@echo ""
	@echo ""
```

This request uses `tone.json`.

```json
{
    "text": "Wow guys, our cluster just got accepted to SmartGeometry!"
}
```