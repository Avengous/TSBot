registerPlugin({
    name: 'Bad Channel Names',
    version: '1.0',
    description: 'This script will remove all channels matching some userdefined names.',
    author: 'Michael Friese <michael@sinusbot.com>',
    vars: {
        names: {
            title: 'Comma-separated list of forbidden names',
            type: 'string'
        }
    }
}, function(sinusbot, config) {
    var names = config.names.split(',').map(function(e) { return e.trim() });
    sinusbot.on('channelCreate', function(ev) {
        if (!ev.name) return; // should not happen
        for (var i = 0; i < names.length; i++) {
            if (ev.name.indexOf(names[i]) >= 0) {
                sinusbot.log('Deleting channel ' + ev.name);
                sinusbot.channelDelete(ev.id, true);
                return;
            }
        }
    });
});
