registerPlugin({
    name: 'Welcome!',
    version: '1.0',
    description: 'This plugin will let the bot greet everyone.',
    author: 'Michael Friese <michael@sinusbot.com>',
    vars: {
        message: {
            title: 'The message that should be displayed. (%n = nickname)',
            type: 'string'
        },
        type: {
            title: 'Message-Type',
            type: 'select',
            options: [
                'Private chat',
                'Poke'
            ]
        }
    }
}, function(sinusbot, config) {
    sinusbot.on('clientMove', function(ev) {
        var msg = config.message;
        msg = msg.replace(/%n/g, ev.clientNick);
        if (ev.oldChannel == 0) {
            if (config.type == 0) {
                sinusbot.chatPrivate(ev.clientId, msg);
            } else {
                sinusbot.poke(ev.clientId, msg);
            }
            return;
        }
    });
});
