# Speech to Text (IBM Cloud · Watson)

## Setup

- Go to the [IBM Dashboard](https://console.bluemix.net/dashboard/apps).
- Click on `Create Resource`.
- Go to the `Watson` category and select `Speech to Text`.
- The `Lite` plan should be selected by default.
- Click `Create`. (This will create a resource for you to make API calls to the IBM Watson service, and you will see the tutorial with the calls that we have summarized inside the `Makefile`.)
- You can [Browse your existing services](https://console.bluemix.net/developer/watson/existing-services) and select `Speech to Text` to grab your service credentials.

## Usage

### Transcribe audio with no options

```
make transcribe
```

### Transcribe audio with additional options

```
make transcribe_options
```