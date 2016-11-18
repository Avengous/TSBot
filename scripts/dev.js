registerPlugin({
    name: 'DevTools',
    version: '1.0',
    description: 'Development tools that will assist you in writing plugins.',
    author: 'Michael Friese <michael@sinusbot.com>',
    vars: {
        adminUids: {
            title: 'Comma-separated list of client-uids that the bot should accept commands from',
            type: 'string'
        },
        logEvents: {
            title: 'Log all events',
            type: 'select',
            options: [
                'off',
                'on'
            ]
        }
    }
}, function(sinusbot, config, pluginInfo) {
    if (config.logEvents) {
        sinusbot.log('DEV/Logging enabled');
        sinusbot.setDebug(true);
    } else {
        sinusbot.log('DEV/Logging disabled');
        sinusbot.setDebug(false);
    }
    var uids = [];
    if (config && config.adminUids) uids = config.adminUids.split(',');
    sinusbot.on('chat', function(ev) {
        if (uids.indexOf(ev.clientUid) < 0) return;
        switch (ev.msg) {
            case '.reload':
                sinusbot.reloadScripts();
                break;
            case '.debug on':
                sinusbot.setDebug(true);
                break;
            case '.debug off':
                sinusbot.setDebug(false);
                break;
        }
    });
    sinusbot.on('api:reload', function(ev) {
        if (!ev.user || !ev.user.privileges || (ev.user.privileges & 0x00010000) == 0) {
            return 'Denied.';
        }
        if (sinusbot.reloadScripts()) {
            return 'Scripts reloaded.';
        }
        return 'Script-Reload deactivated.';
    });
});
