var applescript = require('applescript');

var script = 'tell application "Messages" to send (POSIX file "/Users/nono/Desktop/image.png") to buddy "nonoesp@icloud.com" of service id (get id of first service)';

applescript.execString(script, function(err, rtn) {
    if (err) {
        // Something went wrong!
    }
});