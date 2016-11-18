registerPlugin({
    name: 'Follow Me',
    version: '1.0',
    description: 'The bot will follow the movements of any of the clients given',
    author: 'Michael Friese <michael@sinusbot.com>',
    vars: {
        clientUids: {
            title: 'Comma-separated list of client-ids that the bot should follow',
            type: 'string'
        }
    }
}, function(sinusbot, config) {
    if (!config.clientUids) {
        sinusbot.log('Invalid clientUids');
        return;
    }

    var uids = config.clientUids.split(',');
    sinusbot.on('clientMove', function(ev) {
        if (uids.indexOf(ev.clientUid) >= 0 && ev.newChannel > 0) {
            sinusbot.log('Following ' + ev.clientNick);
            sinusbot.join(ev.newChannel);
            return;
        }
    });

    sinusbot.log('Follow Me initialized...');
});
