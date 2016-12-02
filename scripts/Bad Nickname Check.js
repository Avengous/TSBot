registerPlugin({
 name: 'BadNick Check',
 version: '1.1',
 description: 'Kicks or Messages People with a Bad Nickname!',
 author: 'Multivitamin <multivitamin.wtf>',
    vars: [
        {
            name: 'badnick',
            title: 'List of Banned Nicknames (Help Script: http://sinus.cat/helpers/badnick/)',
            type: 'multiline'
        },
        {
            name: 'action',
            title: 'What should happen when a Client with a Bad Nickname has been detected?',
            type: 'select',
            options: [
                'Kick',
                'Message'
            ]
        },
        {
            name: 'message',
            title: 'Kick / Warn DEFAULT Message',
            type: 'string',
        },
        {
            name: 'ignore',
            title: 'Comma Seperated List of Groups which should get ignored',
            type: 'string',
        },
        {
            name: 'timeout',
            title: 'Startup Timeout for Whitelist(for Servers with a huge amount of ServerGroups and Clients in them)',
            type: 'select',
            options: [
                '10 Seconds',
                '20 Seconds',
                '40 Seconds',
                '1 Minute',
                '2 Minutes',
                '4 Minutes',
            ]
        }
    ]
}, function(sinusbot, config) {

	var timeoutConvert = [10000, 20000, 40000, 60000, 120000, 2400000];

	var badnicks = [];
	var waitTimeout = false;

	//Load the badnick Multiline Variable into a List of Nicks
	if (config.badnick !== undefined) {
		for (var key in config.badnick.split('\n')) {
			//Check for Valid Regex String
			if (config.badnick.split('\n')[key].match(/^[ ]{0,}\/(.{1,})\/([gmixXsuUAJ]{0,10})[ ]{0,}(\->[ ]{0,}(.{1,})|)$/i)) {
				var capture = config.badnick.split('\n')[key].match(/^[ ]{0,}\/(.{1,})\/([gmixXsuUAJ]{0,10})[ ]{0,}(\->[ ]{0,}(.{1,})|)$/i);
				var re = new RegExp(capture[1], capture[2]);
                var msg = capture[4];
			//User Probably does not know Regex try to use it anyway
			} else {
                sinusbot.log('Invalid Regex Format detected! > '+config.badnick.split('\n')[key]);
				var re = new RegExp(config.badnick.split('\n')[key], 'i');
                var msg = undefined;
			}
			badnicks.push([re, msg]);
		}
	}

	//Validate for errors in the Config Input
	var action = config.action ? config.action : 0;
	var addcomplaint = config.addcomplaint ? config.addcomplaint : 0;
	var message = config.message ? config.message : 'Please do not use this Nickname!';
	var defaultTimeout = config.timeout ? config.timeout : 0;
	var ignore = config.ignore ? config.ignore.split(',') : [];
	//Parse Ignore List from String to Int
	for (var key in ignore) {
		if (!isNaN(parseInt(ignore[key]))) ignore[key] = parseInt(ignore[key]);
	}

	var timeout = setTimeout(fullCheck, timeoutConvert[defaultTimeout]);
	
    sinusbot.on('chat', function (ev) {
    	if (ev.clientId == sinusbot.getBotId()) return;
        if (ev.msg.indexOf('!help') == 0 || ev.msg.indexOf('!help') == 0) {
            sinusbot.chatPrivate(ev.clientId, '[b]BAD NICK CHECK[/b] This Bot uses [URL=https://multivitamin.wtf]Multivitamins[/URL] Bad Nick Check Plugin!');
        }
	});


	//Events
	//Event for Client Connect / Move
    sinusbot.on('clientMove', function(ev) {
    	//Filter all Client Connect Events 			and check against whitelist
    	if (waitTimeout && ev.oldChannel == 0 && ev.newChannel > 0 && !whitelist(ev.groups)) checkNick(ev.clientId, ev.clientNick);
    });

    //Do Initial FullCheck on all Clients connected to the Server
    sinusbot.on('connect', function(ev) {
    	//Timeout Fullcheck so the Sinusbot has time to get all Clients
    	clearTimeout(timeout);
    	timeout = setTimeout(fullCheck, timeoutConvert[defaultTimeout]);
    });

    //Do a check when Client changes its nickname
    sinusbot.on('nick', function(ev) {
    	//Check against whitelist
    	if (!waitTimeout || whitelist(ev.groups)) return;
    	//Since the new Nickname is not in the event var we need to get a new Client Object
    	var client = getClientById(ev.clientId);
    	//If a client has been found Check his Nickname
    	if (client !== false) checkNick(client.id, client.nick);
    });


    //Check if Nick is a Bad Nickname
    function checkNick(clid, nick){
    	for (var key in badnicks) {
    		if (nick.match(badnicks[key][0])) {
				sinusbot.log('BadNick detected: '+nick+' via entry \''+badnicks[key][0]+'\'');
				//Message
    			if (action === 1)
    				sinusbot.chatPrivate(
                        clid, 
                        badnicks[key][1] !== undefined ? badnicks[key][1] : message
                    );
    			//Kick
    			else
					sinusbot.kickServer(
                        clid, 
                        badnicks[key][1] !== undefined ? badnicks[key][1] : message
                    );
    		}
    	}
    }

    //Check all Nicknames on the Server 
    function fullCheck() {
    	sinusbot.log('Badnickname Script now active!');
    	waitTimeout = true;
    	//Get a List of all Clients connected to the Server
    	var clients = getClientList();
    	for (var key in clients) {
    		//Whitelist Check
    		if (whitelist(clients[key].g)) continue;
    		//Check Nickname for validity
    		checkNick(clients[key].id, clients[key].nick);
    	};
    }

    //Check if User is whitelisted via Ignore Settings
    function whitelist(grps) {
    	for (var key in grps) {
    		if (ignore.indexOf(grps[key].i) >= 0) return true;
    	}
    	return false;
    }



    function getClientById(id) {
        return getClientByParam('id', id);
    }

    function getClientByParam(search_key, search_value) {
        var channels = getChannels();
        for (var i = 0; i < channels.length; i++) {
            if (!channels[i].clients) continue;
            for (var key in channels[i]['clients']) {
                if (channels[i]['clients'][key][search_key] == search_value) {
                    return channels[i]['clients'][key];
                }
            }
        }
        return false;
    }

    function getClientList() {
        var channels = getChannels();
		var clients = [];
        for (var i = 0; i < channels.length; i++) {
            if (!channels[i].clients) continue;
            for (var key in channels[i]['clients']) {
                var client = channels[i]['clients'][key];
                client.cid = channels[i]['id'];
				clients.push(client);
            }
        }
        return clients;
    }




});
