registerPlugin({
 name: 'ShowPlaylists',
 version: '1.0',
 description: 'Shows all playlists with !playlists',
 author: 'MrJoki007',
	vars: {
		cmd: {
			title: 'Command',
			type: 'string',
			placeholder: '!playlists'
		},
		splitstring: {
			title: 'Splitstring',
			type: 'string',
			placeholder: '", " (" before and after Splitstring when String)'
		}
	}

},	function (sinusbot, config)	{
	sinusbot.on('chat', function(ev) {
		if(config.cmd != undefined){
			if(config.cmd != ev.msg){
				return;
			}
		}else{
			if(ev.msg != "!playlists"){
				return;
			}
		}
		var playlists = sinusbot.playlists();
		var sendstring = "";
		for (var key in playlists) {
			if(config.splitstring != undefined){
				if(config.splitstring.split('"')[1] != undefined){
					sendstring = sendstring + sinusbot.playlistGet(key).name + config.splitstring.split('"')[1];
				}else{
					sendstring = sendstring + sinusbot.playlistGet(key).name + config.splitstring;
				}
			}else{
				sendstring = sendstring + sinusbot.playlistGet(key).name + ", ";
			}
		}
		if(config.substring != undefined){
			if(config.splitstring.split('"')[1] != undefined){
				sinusbot.chatPrivate(ev.clientId, sendstring.slice(0,0 -(config.splitstring.split('"')[1].length)));
			}else{
				sinusbot.chatPrivate(ev.clientId, sendstring.slice(0,0 -(config.splitstring.length)));
			}
		}else{
			sinusbot.chatPrivate(ev.clientId, sendstring.slice(0,-2));
		}
	});
});