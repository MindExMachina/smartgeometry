Fetches images from a web URL that returns a json array of strings
containing image web URLs.

Sample returned json
["http://nono.ma/image.jpg", "http://lourdes.ac/img/profile.jpg"]

## Downloading Images

```
fetch-images \
-url http://lourdes.ac/images/portrait-pencil \
-dir /Users/nono/Desktop/download
```

## Installing as a Command

```
go build && go install
```

Then you can run `fetch-images` anywhere.
