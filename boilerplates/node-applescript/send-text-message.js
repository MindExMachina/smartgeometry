var applescript = require('applescript');

// Very basic AppleScript command. Returns the song name of each
// currently selected track in iTunes as an 'Array' of 'String's.
var script = 'tell application "Messages" to send "Hello" to buddy "nonoesp@icloud.com" of service id (get id of first service)';

applescript.execString(script, function(err, rtn) {
    if (err) {
        // Something went wrong!
    }
    if (Array.isArray(rtn)) {
        rtn.forEach(function(songName) {
            console.log(songName);
        });
    }
});