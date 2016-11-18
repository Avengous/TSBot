registerPlugin({
    name: 'Advertising (Text)',
    version: '1.0',
    description: 'This script will announce one of the configured lines every x seconds.',
    author: 'Michael Friese <michael@sinusbot.com>',
    vars: {
        ads: {
            title: 'Ads (supports bbcode)',
            type: 'multiline',
            placeholder: 'Welcome to the best TS3-Server!'
        },
        interval: {
            title: 'Interval (in seconds)',
            type: 'number'
            placeholder: '5'
        },
        order: {
            title: 'Order',
            type: 'select',
            options: [
                'default (line by line)',
                'random'
            ]
        },
        type: {
            title: 'Broadcast-Type',
            type: 'select',
            options: [
                'Channel',
                'Server'
            ]
        }
    }
}, function(sinusbot, config) {
    var ads = (config && config.ads) ? config.ads.split('\n').map(function(e) { return e.trim().replace(/\r/g, ''); }) : [];
    var ctr = -1;
    sinusbot.on('timer', function(ev) {
        ctr++;
        if (ads.length == 0 || config.Interval < 5) return;
        if (ctr % config.interval != 0) return;
        var ad = ctr % ads.length;
        if (config.order == 1 && ads.length > 1) {
            ad = sinusbot.getRand(ads.length - 1);
        }
        if (config.type == 0) {
            sinusbot.chatChannel(ads[ad]);
        } else {
            sinusbot.chatServer(ads[ad]);
        }
    });
});
