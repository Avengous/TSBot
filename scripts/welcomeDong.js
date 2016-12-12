registerPlugin({
 name: 'WelcomeDong',
 version: '2.0',
 description: 'This script will let the bot greet the Dongers with a track and resume the last track or stream.',
 author: 'Shock, Avengous',
    vars: {
        resume: {
            title: 'Resume last track or stream after it dongs doc:',
            type: 'select',
            options: [
                'Disabled',
                'Enabled'
            ]
        },
		users: {
			title: 'Users',
            type: 'array',
			vars: [
				{
					name: 'User',
					title: 'User Name',
					type: 'string'
				},
				{
					name: 'UUID',
					title: 'Teamspeak UUID',
					type: 'string'
				},
				{
					name: 'Track',
					type: 'track',
					placeholder: 'Search for track...'
				}
			]
		}
    }
}, function(sinusbot, config) {
    var resumePlayback = false;
    var resumeTrack = false;
    var resumePos = 0;
    var securejoin = true;
	var users = config.users;
	
    var getUUID = function (url) {
        var match = url.match(/track:\/\/(\.)?(.[^/:]+)/i);
        if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
          return match[2];
        }
        else {
            return null;
        }
    }

	function welcomeDong(track) {
		if (config.resume && sinusbot.playing() && (sinusbot.getCurrentTrack().uuid != "" || sinusbot.getCurrentTrack().type == 'url') && (sinusbot.getCurrentTrack().uuid != getUUID(track))) {
			resumePlayback = true;
			resumeTrack = sinusbot.getCurrentTrack();
			resumePos = sinusbot.getPos();
			sinusbot.play(track + '&callback=welcomesound&copy=true');
		} else if (resumePlayback) {
			securejoin = false;
			sinusbot.play(track + '&callback=welcomesound&copy=true');
		} else {
			sinusbot.play(track);
		}
	}

    sinusbot.on('clientMove', function(ev) {
        if (ev.newChannel == sinusbot.getCurrentChannelId()) {
			for (var i = 0; i < users.length; i++) {
				sinusbot.log(config.users[i].UUID + ' == ' + ev.clientUid)
				if (config.users[i].UUID == ev.clientUid) {
					welcomeDong(config.users[i].Track.url);
				}
			}
        }
    });

    sinusbot.on('trackEnd', function(cb) {
        if (cb == 'welcomesound' && resumePlayback) {
            if (securejoin) {
                sinusbot.log("Resume last track: " + resumeTrack.title);
                resumePlayback = false;
                if (resumeTrack.type == 'url') {
                  sinusbot.play(resumeTrack.filename);
                } else {
                  sinusbot.setMute(true);
                  sinusbot.play("track://" + resumeTrack.uuid);
                  sinusbot.seek(resumePos);
                  sinusbot.setMute(false);
                }
            }
            securejoin = true;
        }
    });
});
