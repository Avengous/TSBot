registerPlugin({
    name: 'Bookmarks!',
    version: '1.0',
    description: 'Enter .bookmark to save the current position, enter .resume to seek to the bookmarked position.',
    author: 'Michael Friese <michael@sinusbot.com>',
    vars: {}
}, function(sinusbot, config) {
    sinusbot.on('chat', function(ev) {
        if (ev.msg == '.bookmark') {
            var track = sinusbot.getCurrentTrack();
            if (!track) return;
            var pos = sinusbot.getPos();
            sinusbot.setVar(track.uuid, pos);
            sinusbot.chatChannel('Position saved for track ' + track.uuid + ' at ' + pos + 'ms.');
        }
        if (ev.msg == '.resume') {
            var track = sinusbot.getCurrentTrack();
            if (!track) return;
            var pos = sinusbot.getVar(track.uuid);
            if (!pos) {
                sinusbot.chatChannel('No position found, sorry.');
                return;
            }
            sinusbot.seek(pos);
            sinusbot.chatChannel('Resumed at ' + pos + 'ms.');
        }
    });
});
