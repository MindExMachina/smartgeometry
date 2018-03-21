A minimal node http server using Express.

Start the Express server.

```bash
node server.js
```

You should see the URL at which the server is running (e.g., `http://localhost:8080`).

You can try that the routes are working with the following `make` commands defined on the `Makefile`. (And you can also try the GET requests on your browser — POST requests won't work in the browser.)

```bash
make post
// returns
// POST request
// [0,1,2]
```

```bash
make post_numbers
// returns
// POST request
// [[-4, 0, 1, 0, 0], [-15, 9, 1, 0, 0], […]]
```

```bash
make get
// returns
// GET request
// {}
```

```bash
make get_numbers
// returns
// GET request
// [[101,102,103],[104,105,106]]
```

```bash
make get_color
// returns
// {"method":"color-change","params":{"color":"red"}}
```