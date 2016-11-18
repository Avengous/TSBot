registerPlugin({
    name: 'No Recording!',
    version: '1.0',
    description: 'This script will kick anyone who attempts to record.',
    author: 'Michael Friese <michael@sinusbot.com>',
    vars: {}
}, function(sinusbot, config) {
    sinusbot.on('record', function(ev) {
        sinusbot.kickServer(ev.clientId, 'No recording on our server!');
    });
});
