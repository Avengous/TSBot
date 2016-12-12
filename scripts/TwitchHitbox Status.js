registerPlugin({ // jshint ignore:line
	name: 'Twitch/Hitbox Status!',
	version: '1.2.7',
	description: 'Check periodicly your favorit streamers status!',
	author: 'Julian Huebenthal (Xuxe) <julian@julian-huebenthal.de> | Filtik <filtik@gmx.de>',
	vars: {
		twitch_apikey: {
			title: 'Twitch Client ID: (Create under https://www.twitch.tv/settings/connections)',
			type: 'string'
		},
		interval: {
			title: 'Check Interval in Minutes. (Set it not to low you may get banned by the API Provider!)',
			type: 'number',
			value: 10,
		},
		configuration: {
			title: 'Config',
            type: 'array',
			vars: [
				{
					name: 'Platform',
					title: 'Streaming site:',
					type: 'select',
					options: [
					  "twitch",
					  "hitbox"
					]
				},
				{
					name: 'Streamername',
					title: 'Streamer Name:',
					type: 'string'
				},
				{
					name: 'OutputMode',
					title: 'OutputMode:',
					type: 'select',
					options: [
					  "Server Chat",
					  "Channel Chat",
					  "Channel Name"
					]
				},
				{
					name: 'SpecialInfo',
					title: 'More Infomation to the streamer in channel description?:',
					type: 'select',
					options: [
					  "No",
					  "Yes"
					]
				},
				{
					name: 'description',
					title: 'Description text when More Infomation on Yes is',
					type: 'multiline',
					placeholder: '[center][b][size=+2]%name[/size][/b]\n%pic[/center]\n[b]Status:[/b] %status\n[b]Game:[/b] %game\n\n%link\n\n[b]Followers:[/b] %follower\n\n[b]Partner:[/b] %partner\n[b]Emotes:[/b] %emotes',
				},
				{
					name: 'OutputChannel',
					title: 'Channel for Status Update (only when OutputMode "Channel Name" is) or SpecialInfo: ',
					type: 'channel'
				},
				{
					name: 'OfflineText',
					title: 'Offline Text: (%n - Streamer Name)',
					type: 'string',
					placeholder: '%n is offline.',
					value: '%n is offline.',
				},
				{
					name: 'OnlineText',
					title: 'Online Text: (%n - Streamer Name | %g - Game)',
					type: 'string',
					placeholder: '%n (%g) is online!',
					value: '%n is online!',
				},
			]
		},
	}
}, function(sinusbot, config, pluginInfo) {
	var LastResponse;
	var http_opts;
	var http_opts_special;
	var http_opts_img;
	var http_opts_emotes;
	var http_opts_emotesbetter;
	var TwitchRegExp = new RegExp('^(http|https):\/\/api.twitch.tv\/.*');
	var ParseTwitchNameRegExp = new RegExp('^(http|https)(:\/\/api.twitch.tv\/kraken\/streams\/)(.*)');
	
	var TwitchIMGResize;
	var datacheck;
	var imgshow = '';
	var subemotes = 'no emotes';
	var Betteremotes = 'no emotes';
	var BetterStreamerRow = 0;

	if (typeof config.interval === undefined || config.interval < 1) {
		sinusbot.log("Interval is to low or not defined.");
		return;
	}


	sinusbot.on('api:ths_lastresponse', function(ev) {
		return LastResponse;
	});

	sinusbot.on('api:ths_run', function(ev) {
		Run();
		return 'Called';
	});

	// Create the Storage keys for each object where we store the lastState
	var init = config.configuration;
	for (var i = 0; i < init.length; i++) {
		var newStream = 1;
		if (typeof config.configuration[i].Platform == "undefined" || typeof config.configuration[i].Streamername == "undefined" || typeof config.configuration[i].OutputMode == "undefined" || config.configuration[i].Streamername == "") {
			sinusbot.log("ERROR: not all fields writet");
			newStream = 0;
		}
		if (config.configuration[i].OutputMode == 2 && typeof config.configuration[i].OutputChannel === undefined) {
			sinusbot.log("ERROR: for channel name please select a channel");
			newStream = 0;
		}
		if (typeof config.configuration[i].OfflineText == "undefined") {
			config.configuration[i].OfflineText = '%n is offline.';
		}
		if (typeof config.configuration[i].OnlineText == "undefined") {
			config.configuration[i].OnlineText = '%n is online!';
		}
		if (typeof config.configuration[i].description == "undefined" || config.configuration[i].description == "") {
			config.configuration[i].description = '[center][b][size=+2]%name[/size][/b]\n%pic[/center]\n[b]Status:[/b] %status\n[b]Game:[/b] %game\n\n%link\n\n[b]Followers:[/b] %follower\n\n[b]Partner:[/b] %partner\n[b]Emotes:[/b] %emotes \n[b]Better Emotes:[/b] %Betteremotes';
		}
		
		if (config.configuration[i].SpecialInfo == 1 && typeof config.configuration[i].OutputChannel === undefined) {
			sinusbot.log("ERROR: for streamer info please select a channel");
			config.configuration[i].SpecialInfo = 0;
		}
		
		if (newStream == 1) {
			var sname = config.configuration[i].Streamername.toLowerCase();
			sinusbot.setVar(sname, {
				lastState: 0,
				SpecialInfo: parseInt(config.configuration[i].SpecialInfo),
				mode: parseInt(config.configuration[i].OutputMode),
				channelId: parseInt(config.configuration[i].OutputChannel),
				OfflineText: config.configuration[i].OfflineText,
				OnlineText: config.configuration[i].OnlineText,
				description: config.configuration[i].description,
				descriptionsetet: config.configuration[i].description,
				imgshow: '',
				subemotes: 'no SUB emotes',
				Betteremotes: 'no BTTV emotes',
			});
			sinusbot.log("Created storage key for: " + config.configuration[i].Streamername);
		}
	}
	
	
	var Run = function() {
		BetterStreamerRow = 0;
		var toDo = config.configuration;
		for (var i = 0; i < toDo.length; i++) {

			var newStream = 1;
			if (typeof config.configuration[i].Platform == "undefined" || typeof config.configuration[i].Streamername == "undefined" || typeof config.configuration[i].OutputMode == "undefined" || config.configuration[i].Streamername == "") {
				newStream = 0;
			}
			if (newStream == 1) {
				var streamer = config.configuration[i].Streamername.toLowerCase();
				switch (config.configuration[i].Platform) {
					case "0":
						//  TWITCH
						http_opts = {
							"method": "GET",
							"url": "https://api.twitch.tv/kraken/streams/" + streamer + "?response_type=token&client_id=" + config.twitch_apikey,
							"timeout": 60000,
							"headers": [{
								"Content-Type": "application/json"
							}, {
									"Accept": "application/vnd.twitchtv.v3+json"
								}]
						};
						sinusbot.http(http_opts, HTTPCallback);
						
						TwitchSpecialEmotesResp(streamer);
						
						TwitchSpecialEmotesBetterResp(streamer);
						
						sinusbot.log("[T] Fired call " + i);
						continue;
						
					case "1":
						// HITBOX
						http_opts = {
							"method": "GET",
							"url": "https://api.hitbox.tv/user/" + streamer,
							"timeout": 60000,
							"headers": [{
								"Content-Type": "application/json"
							}]
						};
						sinusbot.http(http_opts, HTTPCallback);
						sinusbot.log("[H] Fired call " + i);
						continue;
				}
			}
		}
	}
	
	setInterval(Run, 60000 * config.interval);
	Run();
	
	
	function HTTPCallback(error, response) {
		LastResponse = response;
		if (response.statusCode != 200) {
			sinusbot.log(JSON.parse(response.data));
			return;
		}

		var json_data = JSON.parse(response.data);
		if (typeof json_data._links != 'undefined' && json_data._links.self.match(TwitchRegExp)) {
			//sinusbot.log("Probe: detected Twitch Response. -> " + json_data._links.self);
			UseUpdatesTwitch(json_data);
		} else {
			//sinusbot.log("Probe: detected Hitbox Response. -> ");
			UseUpdatesHitBox(json_data);
		}
	}
	
	function TwitchSpecialEmotesResp(name) {
		sinusbot.http({
			"method": "GET", 
			"url":"https://api.twitch.tv/kraken/chat/"+name+"/emoticons" + "?response_type=token&client_id=" + config.twitch_apikey, 
			"timeout": 60000, 
			"headers":[{"Content-Type": "application/json","Client-ID": config.twitch_apikey}, {"Accept":"application/vnd.twitchtv.v3+json"}]
		}, function (error, response) {
			if (response.statusCode != 200) {
				sinusbot.log(error);
				return;
			}
			
			var data = JSON.parse(response.data);
			subemotes = 'no SUB emotes';
			var emotes = '';
			for (var i = 0; i < data.emoticons.length; i++) {
				if (data.emoticons[i].subscriber_only == true) {
					emotes = emotes + '\n[img]'+data.emoticons[i].url+'[/img] '+data.emoticons[i].regex;
				}
			}
			if (emotes != '') {
				subemotes = emotes;
			}
			
			key = sinusbot.getVar(name);
			
			sinusbot.setVar(name, {
				lastState: key.lastState,
				SpecialInfo: parseInt(key.SpecialInfo),
				mode: parseInt(key.mode),
				channelId: parseInt(key.channelId),
				OfflineText: key.OfflineText,
				OnlineText: key.OnlineText,
				description: key.description,
				descriptionsetet: key.descriptionsetet,
				imgshow: key.imgshow,
				subemotes: subemotes,
				Betteremotes: key.Betteremotes
			});
		});
	}
	
	
	function TwitchSpecialEmotesBetterResp(name) {
		sinusbot.http({
			"method": "GET", 
			"url":"https://api.betterttv.net/2/channels/"+name,
			"timeout": 60000, 
			"headers":[{"Content-Type": "application/json"}]
		}, function (error, response) {
			var data = JSON.parse(response.data);
			if (data.status != 200)
			{
				sinusbot.log(error);
				return;
			} else {
				Betteremotes = 'no BTTV emotes';
				var emotesBetter = '\n';

				for (var i = 0; i < data.emotes.length; i++) {
					emotesBetter = emotesBetter + '[img]https://cdn.betterttv.net/emote/'+data.emotes[i].id+'/1x[/img] '+data.emotes[i].code+'\n';
				}
				
				if (emotesBetter != '') {
					Betteremotes = emotesBetter;
				}
				
				key = sinusbot.getVar(name);
				
				sinusbot.setVar(name, {
					lastState: key.lastState,
					SpecialInfo: parseInt(key.SpecialInfo),
					mode: parseInt(key.mode),
					channelId: parseInt(key.channelId),
					OfflineText: key.OfflineText,
					OnlineText: key.OnlineText,
					description: key.description,
					descriptionsetet: key.descriptionsetet,
					imgshow: key.imgshow,
					subemotes: key.subemotes,
					Betteremotes: Betteremotes
				});
			}
		});
	}

	function UseUpdatesTwitch(data) {
		var result;
		var name;
		var key;
		var match;
		imgshow = '';
		
		match = ParseTwitchNameRegExp.exec(data._links.self);
		name = match[3];
		key = sinusbot.getVar(name);
		//sinusbot.log(key);
		
		if (data.stream == null) {
			result = key.OfflineText.replace('%n', name);
			if (result.length >= 40) {
				result = result.substring(0,37)+"...";
				sinusbot.log("WARNING DATA TO LONG > 40. May you have problems while using as channel name.");
			}
		} else {
			imgshow = '[img]'+data.stream.preview.template.replace('{width}', '200').replace('{height}', '120')+'[/img]';
			result = key.OnlineText.replace('%n', data.stream.channel.display_name).replace('%g', data.stream.game);
			if (result.length >= 40) {
				result = result.substring(0,37)+"...";
				sinusbot.log("WARNING DATA TO LONG > 40. May you have problems while using as channel name.");
			}
		}
		
		if (data.stream != null) {
			datacheck = data.stream.created_at;
		} else {
			datacheck = data.stream;
		}
		
		result += " <https://www.twitch.tv/" + name + ">";
		
		switch (key.mode) {
			case 0: //Server
				if (datacheck != key.lastState) {
					sinusbot.chatServer(result);
					key.lastState = datacheck;
					sinusbot.log('send a chatServer ' + result);
				}
				break;

			case 1: //Channel
				if (datacheck != key.lastState) {
					sinusbot.chatChannel(result);
					key.lastState = datacheck;
					sinusbot.log('send a chatChannel ' + result);
				}
				break;

			case 2: //Channel Name
				if (datacheck != key.lastState) {
					sinusbot.channelUpdate(key.channelId, {
						"name": result
					});
					key.lastState = datacheck;
					sinusbot.log('send a channelUpdate ' + result);
				}
				break;
		}

		sinusbot.setVar(name, {
			lastState: key.lastState,
			SpecialInfo: parseInt(key.SpecialInfo),
			mode: parseInt(key.mode),
			channelId: parseInt(key.channelId),
			OfflineText: key.OfflineText,
			OnlineText: key.OnlineText,
			description: key.description,
			imgshow: imgshow,
			descriptionsetet: key.descriptionsetet,
			subemotes: key.subemotes,
			Betteremotes: key.Betteremotes,
		});
		
		if (key.SpecialInfo == 1) {
			UseUpdatesTwitchSpecial(name);
		}
	}

	
	function UseUpdatesHitBox(data) {
		var result;
		var key;
		key = sinusbot.getVar(data.user_name.toLowerCase());
		if (data.is_live === 0) {
			key.lastState = 0;
			result = config.offline_txt.replace('%n', data.display_name);
			if (result.length >= 40) {
				result = result.substring(0,37)+"...";
				sinusbot.log("WARNING DATA TO LONG > 40. May you have problems while using as channel name.");
			}
		} else {
			key.lastState = 1;
			result = config.online_txt.replace('%n', data.display_name);
			if (result.length >= 40) {
				result = result.substring(0,37)+"...";
				sinusbot.log("WARNING DATA TO LONG > 40. May you have problems while using as channel name.");
			}
		}
		
		switch (key.mode) {
			case 0: //Server
				if (data.is_live != key.lastState) {
					sinusbot.chatServer(result);
					key.lastState = data.is_live;
				}
				break;

			case 1: //Channel
				if (data.is_live != key.lastState) {
					sinusbot.chatChannel(result);
					key.lastState = data.is_live;
				}
				break;

			case 2: //Channel Name
				if (data.is_live != key.lastState) {
					sinusbot.channelUpdate(key.channelId, {
						"name": result
					});
					key.lastState = data.is_live;
				}
				break;
		}
		
		sinusbot.setVar(name, {
			lastState: key.lastState,
			SpecialInfo: parseInt(key.SpecialInfo),
			mode: parseInt(key.mode),
			channelId: parseInt(key.channelId),
			OfflineText: key.OfflineText,
			OnlineText: key.OnlineText,
			description: key.description,
			descriptionsetet: key.descriptionsetet,
			imgshow: key.imgshow,
			subemotes: key.subemotes,
			Betteremotes: key.Betteremotes,
		});
	}
	
	function UseUpdatesTwitchSpecial(name) {
		sinusbot.http({
			"method": "GET", 
			"url":"https://api.twitch.tv/kraken/channels/"+name + "?response_type=token&client_id=" + config.twitch_apikey, 
			"timeout": 10000, 
			"headers":[{"Content-Type": "application/json",'Client-ID': config.twitch_apikey}]
		}, function (error, response) {
			var data = JSON.parse(response.data);
			var resultdesk;
			
			name = data.name;
			key = sinusbot.getVar(name);
			
			if (data.partner != true) {
				subemotes = '';
			}
			
			resultdesk = key.description.replace('%name', data.display_name).replace('%pic', key.imgshow).replace('%status', data.status).replace('%game', data.game).replace('%link', '[url]https://twitch.tv/'+name+'[/url]').replace('%follower', data.followers).replace('%partner', data.partner).replace('%emotes', key.subemotes).replace('%Betteremotes', key.Betteremotes);
			
			if (resultdesk != key.descriptionsetet) {
				sinusbot.channelUpdate(key.channelId, {
					"description": resultdesk
				});
				key.descriptionsetet = resultdesk;
			}
			
			sinusbot.setVar(name, {
				lastState: key.lastState,
				SpecialInfo: parseInt(key.SpecialInfo),
				mode: parseInt(key.mode),
				channelId: parseInt(key.channelId),
				OfflineText: key.OfflineText,
				OnlineText: key.OnlineText,
				description: key.description,
				descriptionsetet: key.descriptionsetet,
				imgshow: key.imgshow,
				subemotes: key.subemotes,
				Betteremotes: key.Betteremotes,
			});
		});
	}

});