registerPlugin({
    name: 'Remember Last Channel',
    version: '1.0',
    description: 'This script will remember, which channel the bot was last moved to and will set it as default channel on join.',
    author: 'Michael Friese <michael@sinusbot.com>',
    vars: {
    }
}, function(sinusbot, config) {
    sinusbot.on('botMove', function(ev) {
        sinusbot.setDefaultChannel(ev.newChannel);
    });
});
