Downloads files from a `-url=http://path.com/to/json` that contains a JSON array of string URLs
to the provided folder `-dir=path/to/folder`.

Sample returned json
["http://nono.ma/image.jpg", "http://lourdes.ac/img/profile.jpg"]

## Downloading Images

```
fetch-images \
-url http://lourdes.ac/api/tag/portrait \
-dir /Users/nono/Desktop/download
```

## Installing as a Command

To install as a global command you need to place this file inside your go path.

```
go build && go install
```

Then you can run `fetch-files` anywhere.
