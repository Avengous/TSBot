registerPlugin({
    name: 'Idle Mover',
    version: '1.0',
    description: 'The bot will move all clients that are idle longer than the time given (in seconds) to a separate channel',
    author: 'Michael Friese <michael@sinusbot.com>',
    vars: {
        idleTime: {
            title: 'Number of seconds idle',
            type: 'number'
        },
        idleChannel: {
            title: 'Name of the channel to move the client into',
            type: 'string'
        }
    }
}, function(sinusbot, config) {
    var counter = 0;
    var idleChannel = 0;

    if (config.idleTime < 60) {
        sinusbot.log('Idle time must be at least 60 seconds.');
        return;
    }

    sinusbot.on('timer', function() {
        counter++;
        if ((counter % 10) == 0) {
            log('Starting idle check');
            // Idle-check once in 60 seconds
            var channel, client;
            var channels = sinusbot.getChannels();
            var self = sinusbot.getBotId();
            for (var i = 0; i < channels.length; i++) {
                if (!channels[i].clients) continue;
                if (channels[i].id == idleChannel) continue;
                channel = channels[i];
                for (var j = 0; j < channel.clients.length; j++) {
                    client = channel.clients[j];
                    if (client.id == self) continue;
                    if (client.idle > config.idleTime * 1000) {
                        sinusbot.log('Client ' + client.nick + ' is idle, moving');
                        sinusbot.move(client.id, idleChannel);
                    }
                }
            }
        }
    });

    var updateChannels = function() {
        sinusbot.log('Connected, getting channels');
        var channels = getChannels();
        for (var i = 0; i < channels.length; i++) {
            if (channels[i].name == config.idleChannel) {
                idleChannel = channels[i].id;
                sinusbot.log('Idle-Channel will be ' + idleChannel);
                break;
            }
        }
    };
    updateChannels();
    sinusbot.on('connect', updateChannels);

    sinusbot.log('Idle Mover initialized...');
});
