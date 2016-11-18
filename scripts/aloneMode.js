registerPlugin({
    name: 'AloneMode',
    version: '1.0',
    description: 'This script will save CPU and bandwidth by stopping or muting the bot when nobody is listening anyways.',
    author: 'Michael Friese <michael@sinusbot.com>',
    vars: {
        mode: {
            title: 'Mode',
            type: 'select',
            options: [
                'mute only',
                'stop playback'
            ]
        }
    }
}, function(sinusbot, config) {
    var muted = false;
    var pos = 0;
    sinusbot.setMute(false);
    sinusbot.on('clientCount', function(ev) {
        if (ev.count > 1 && muted) {
            muted = false;
            sinusbot.log('Ending AloneMode...');
            if (config.mode == 0) {
                sinusbot.setMute(false);
            } else {
                sinusbot.play();
                log('Seeking to ' + pos);
                sinusbot.seek(pos);
            }
            return;
        }
        if (ev.count <= 1 && sinusbot.playing()) {
            muted = true;
            sinusbot.log('Starting AloneMode...');
            if (config.mode == 0) {
                sinusbot.setMute(true);
            } else {
                pos = getPos();
                sinusbot.log('Pos is ' + pos);
                sinusbot.stop();
            }
        }
    });
});
