registerPlugin({
    name: 'API Showcase',
    version: '1.0',
    description: 'This just demonstrated many of the available/exposed function calls.',
    author: 'Michael Friese <michael@sinusbot.com>',
    vars: {}
}, function(sinusbot, config) {
    sinusbot.on('chat', function(ev) {
        /**
         * ev.mode
         * ev.clientUid
         * ev.clientId
         * ev.clientNick
         * ev.clientServerGroups
         * ev.channel
         * ev.msg
         */
        switch (ev.msg) {
            case '.info':
                sinusbot.chatPrivate(ev.clientId, 'W00tW00t!');
                break;
            case '.channelCreate':
                sinusbot.channelCreate({ name: 'Demo-Channel', parent: 0, topic: 'Just for demonstration purposes', enc: 1, perm: 0, sperm: 0, order: 0, maxClients: 2 });
                // channelDelete(100);
                // channelMove(100, { parent: 102 });
                // channelUpdate(100, { topic: 'New Topic!' });
                break;
            case '.stop':
                sinusbot.stop();
                break;
            case '.next':
                sinusbot.next();
                break;
            case '.prev':
                sinusbot.prev();
                break;
            case '.desc':
                sinusbot.setDescription('Hooray, new client description!');
                break;
            case '.pokeme':
                sinusbot.poke(ev.clientId, 'Done that.');
                break;
            case '.playing':
                if (playing()) {
                    sinusbot.chatPrivate(ev.clientId, 'Yup, playing.');
                } else {
                    sinusbot.chatPrivate(ev.clientId, 'Nope, silent.');
                }
                break;
            case '.whoareyou':
                sinusbot.chatPrivate(ev.clientId, 'My private id is ' + getBotId());
                break;
        }
    });
    sinusbot.on('poke', function(ev) {
        /**
         * ev.clientUid
         * ev.clientId
         * ev.clientNick
         * ev.clientServerGroups
         * ev.msg
         */
        sinusbot.log('We got poked by ' + ev.clientNick + ': ' + ev.msg);
    });
    sinusbot.on('timer', function(stamp) {
        /**
         * stamp unix-timestamp in milliseconds
         */
    });
    sinusbot.on('clientServergroupAdd', function(ev) {
        /**
         * ev.serverGroupId
         * ev.clientUid
         * ev.clientId
         * ev.clientNick
         * ev.invokerUid
         * ev.invokerId
         * ev.invokerNick
         */
        sinusbot.chatPrivate(ev.invokerId, 'You just added ' + ev.clientNick + ' to group ' + ev.serverGroupId);
    });
    sinusbot.on('clientServergroupDel', function(ev) {
        /**
         * ev.serverGroupId
         * ev.clientUid
         * ev.clientId
         * ev.clientNick
         * ev.invokerUid
         * ev.invokerId
         * ev.invokerNick
         */
        sinusbot.chatPrivate(ev.invokerId, 'You just removed ' + ev.clientNick + ' from group ' + ev.serverGroupId);
    });
    sinusbot.on('talkerCount', function(ev) {
        /**
         * ev.newCount
         */
        sinusbot.log(ev.newCount + ' people are talking now');
    });
    sinusbot.on('botMove', function(ev) {
        /**
         * ev.newChannel
         */
        sinusbot.log('We got moved to channel #' + ev.newChannel);
    });
    sinusbot.on('connect', function() {
        sinusbot.log('Hooray, we are connected!');
        sinusbot.log('Server-Info: UID ' + sinusbot.getServerUid() + '; Name ' + sinusbot.getServerName() + '; Platform ' + sinusbot.getServerPlatform() + '; Version ' + sinusbot.getServerVersion());
    });
    sinusbot.on('disconnect', function() {
        log('Oh noes, we just got disconnected.');
    });
    sinusbot.on('clientMove', function(ev) {
        /**
         * ev.oldChannel
         * ev.newChannel
         * ev.msg
         * ev.visibility
         * ev.clientUid
         * ev.clientId
         * ev.clientNick
         * ev.clientServerGroups
         */
        if (ev.oldChannel == 0) {
            sinusbot.say(ev.clientNick + ' just came online.', 'en');
        } else {
            sinusbot.say(ev.clientNick + ' moved to another channel.', 'en');
        }
    });
    sinusbot.on('clientJoin', function(ev) {
        /**
         * ev.clientUid
         * ev.clientId
         * ev.clientNick
         */
        sinusbot.log('Someone joined our channel, how nice!');
    });
    sinusbot.on('nick', function(ev) {
        /**
         * ev.clientUid
         * ev.clientId
         * ev.clientNick
         */
        sinusbot.log('Hey, ' + ev.clientNick + '! I like your new name!', 'en');
    });
    sinusbot.on('track', function(ev) {
        /**
         * ev.title
         * ev.artist
         * ev.album
         * ev.albumArtist
         * ev.duration
         * ev.tempTitle   (radio only)
         * ev.tempArtist  (radio only)
         */
    });
    sinusbot.on('record', function(ev) {
        /**
         * ev.clientId
         */
        sinusbot.chatPrivate(ev.clientId, 'No recording, please!');
    });
    sinusbot.on('channelCreate', function(ev) {
        /**
         * ev.id
         * ev.parent
         * ev.name
         * ev.topic
         * ev.codec
         * ev.quality
         * ev.maxClients
         * ev.order
         * ev.perm
         * ev.sperm
         * ev.default
         * ev.pw
         * ev.enc
         * ev.invokerUid
         * ev.invokerId
         * ev.invokerNick
         */
        sinusbot.chatPrivate(ev.invokerId, 'Thanks for creating the room ' + ev.name + '. But let\'s change that to something more piratey!');
        var rand = getRand(2);
        switch (rand) {
            case 0:
                sinusbot.channelUpdate(ev.id, { name: ev.name + 'arrrgh', topic: 'Just got piratized!' });
                break;
            case 1:
                sinusbot.channelUpdate(ev.id, { name: ev.name + 'aye', topic: 'Just got piratized!' });
                break;
            case 2:
                sinusbot.channelUpdate(ev.id, { name: ev.name + 'tey', topic: 'Just got piratized!' });
                break;
        }
    });
    sinusbot.on('channelUpdate', function(ev) {
        /**
         * ev.id
         * ev.name
         * ev.topic
         * ev.codec
         * ev.quality
         * ev.maxClients
         * ev.order
         * ev.perm
         * ev.sperm
         * ev.default
         * ev.pw
         * ev.enc
         * ev.invokerUid
         * ev.invokerId
         * ev.invokerNick
         */
        sinusbot.chatPrivate(ev.invokerId, 'Channel ' + ev.name + ' has been updated.');
    });
    sinusbot.on('channelMove', function(ev) {
        /**
         * ev.id
         * ev.parent
         * ev.name
         * ev.topic
         * ev.codec
         * ev.quality
         * ev.maxClients
         * ev.order
         * ev.perm
         * ev.sperm
         * ev.default
         * ev.pw
         * ev.enc
         * ev.invokerUid
         * ev.invokerId
         * ev.invokerNick
         */
        sinusbot.chatPrivate(ev.invokerId, 'Channel ' + ev.name + ' has been moved.');
    });
    sinusbot.on('channelDelete', function(ev) {
        /**
         * ev.id
         * ev.invokerUid
         * ev.invokerId
         * ev.invokerNick
         */
        sinusbot.chatPrivate(ev.invokerId, 'Why did you delete that channel, ' + ev.invokerNick + '?');
    });
});
