var applescript = require('applescript');

// Very basic AppleScript command. Returns the song name of each
// currently selected track in iTunes as an 'Array' of 'String's.
var file = 'send_message.scpt';

applescript.execFile(file, function(err, rtn) {
  if (err) {
    // Something went wrong!
  }
  if (Array.isArray(rtn)) {
    console.log(rtn);
    // rtn.forEach(function(songName) {
      // console.log(songName);
    // });
  }
});
