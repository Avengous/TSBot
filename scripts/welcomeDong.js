registerPlugin({
 name: 'WelcomeDong',
 version: '1.2',
 description: 'This script will let the bot greet the Dongers with a track and resume the last track or stream.',
 author: 'Shock, Avengous',
    vars: {
        trackDoc: {
            title: 'Sound File for Doc:',
            type: 'track',
            placeholder: 'Search for track...'
        },
        trackShock: {
            title: 'Sound File for Shock:',
            type: 'track',
            placeholder: 'Search for track...'
        },
        trackAvengous: {
            title: 'Sound File for Avengous:',
            type: 'track',
            placeholder: 'Search for track...'
        },
        trackNeda: {
            title: 'Sound File for Neda:',
            type: 'track',
            placeholder: 'Search for track...'
        },
        trackStephen: {
            title: 'Sound File for Stephen:',
            type: 'track',
            placeholder: 'Search for track...'
        },
        trackJohnny: {
            title: 'Sound File for Johnny:',
            type: 'track',
            placeholder: 'Search for track...'
        },
        trackRyan: {
            title: 'Sound File for Ryan:',
            type: 'track',
            placeholder: 'Search for track...'
        },
        resume: {
            title: 'Resume last track or stream after it dongs doc:',
            type: 'select',
            options: [
                'Disabled',
                'Enabled'
            ]
        }
    }
}, function(sinusbot, config) {
    var resumePlayback = false;
    var resumeTrack = false;
    var resumePos = 0;
    var securejoin = true;

	var uuids = {
		'Doc': 'wD8quZdUyGOBCONc7/FBcKve+3U=',
		'Shock-Work': 'jtwX1kZSG4CnD2BRpnrlhaMNSk4=',
		'Shock': 'jbta7xGs0Q3Q2B+1G388MCmPaXo=',
		'Avengous-Work': 'iHkPTzEw+WI5dBr9esCXS+Z8Yoo=',
		'Avengous': 'mZkDMgo9bSDAegu1rUZcKhcVZVo=',
		'Neda': 'hs7mtyhEWfPybOSYkr2lpocC6xI=',
		'Stephen': '5VrnNFtWvpcWRQadUBGqpMYZ0rI=',
		'Johnny': 'ulmt1EwtK2zYtszdxADKSqKfmt4=',
		'Ryan': '3WbX91stVo4dCcI6nXUnCJ4seaw='
	}
	
    var getUUID = function (url) {
        var match = url.match(/track:\/\/(\.)?(.[^/:]+)/i);
        if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
          return match[2];
        }
        else {
            return null;
        }
    }

	function welcomeDong(uuid) {
		sinusbot.log("Welcome-Sound starting...");
		if (config.resume && sinusbot.playing() && (sinusbot.getCurrentTrack().uuid != "" || sinusbot.getCurrentTrack().type == 'url') && (sinusbot.getCurrentTrack().uuid != getUUID(getTrack(uuid)))) {
			resumePlayback = true;
			resumeTrack = sinusbot.getCurrentTrack();
			resumePos = sinusbot.getPos();
			sinusbot.play(getTrack(uuid) + '&callback=welcomesound&copy=true');
		} else if (resumePlayback) {
			securejoin = false;
			sinusbot.play(getTrack(uuid) + '&callback=welcomesound&copy=true');
		} else {
			sinusbot.play(getTrack(uuid));
		}	
	}
	
	function getTrack(uuid) {		
		switch (uuid) {
			case uuids['Doc']:
				return config.trackDoc.url;
			case uuids['Shock-Work']:
				return config.trackShock.url;
			case uuids['Shock']:
				return config.trackShock.url;
			case uuids['Avengous-Work']:
				return config.trackAvengous.url;
			case uuids['Avengous']:
				return config.trackAvengous.url;
			case uuids['Neda']:
				return config.trackNeda.url;
			case uuids['Stephen']:
				return config.trackStephen.url;
			case uuids['Johnny']:
				return config.trackJohnny.url;
			case uuids['Ryan']:
				return config.trackRyan.url;
			default:
				return config.trackDoc.url;
		}
	}
	
    sinusbot.on('clientMove', function(ev) {
        if (ev.newChannel == sinusbot.getCurrentChannelId()) {
<<<<<<< HEAD
            if (ev.clientUid == 'wD8quZdUyGOBCONc7/FBcKve+3U=') {
                sinusbot.log("Welcome-Sound starting...");
                if (config.resume && sinusbot.playing() && (sinusbot.getCurrentTrack().uuid != "" || sinusbot.getCurrentTrack().type == 'url') && (sinusbot.getCurrentTrack().uuid != getUUID(config.trackDoc.url))) {
                    resumePlayback = true;
                    resumeTrack = sinusbot.getCurrentTrack();
                    resumePos = sinusbot.getPos();
                    sinusbot.play(config.trackDoc.url + '&callback=welcomesound&copy=true');
                } else if (resumePlayback) {
                    securejoin = false;
                    sinusbot.play(config.trackDoc.url + '&callback=welcomesound&copy=true');
                } else {
                    sinusbot.play(config.trackDoc.url);
                }
            }
            if (ev.clientUid == 'jtwX1kZSG4CnD2BRpnrlhaMNSk4=' || ev.clientUid == 'jbta7xGs0Q3Q2B+1G388MCmPaXo=') {
                sinusbot.log("Welcome-Sound starting...");
                if (config.resume && sinusbot.playing() && (sinusbot.getCurrentTrack().uuid != "" || sinusbot.getCurrentTrack().type == 'url') && (sinusbot.getCurrentTrack().uuid != getUUID(config.trackShock.url))) {
                    resumePlayback = true;
                    resumeTrack = sinusbot.getCurrentTrack();
                    resumePos = sinusbot.getPos();
                    sinusbot.play(config.trackShock.url + '&callback=welcomesound&copy=true');
                } else if (resumePlayback) {
                    securejoin = false;
                    sinusbot.play(config.trackShock.url + '&callback=welcomesound&copy=true');
                } else {
                    sinusbot.play(config.trackShock.url);
                }
            }
            if (ev.clientUid == 'iHkPTzEw+WI5dBr9esCXS+Z8Yoo=' || ev.clientUid == 'mZkDMgo9bSDAegu1rUZcKhcVZVo=' || ev.clientUid == 'P8SJ9N2mOB95ea28VTemp6R+fTM=' || ev.clientUid == 'MEi5ikPXFX9pbn8i1ljNrZexrH4=') {
                sinusbot.log("Welcome-Sound starting...");
                if (config.resume && sinusbot.playing() && (sinusbot.getCurrentTrack().uuid != "" || sinusbot.getCurrentTrack().type == 'url') && (sinusbot.getCurrentTrack().uuid != getUUID(config.trackAvengous.url))) {
                    resumePlayback = true;
                    resumeTrack = sinusbot.getCurrentTrack();
                    resumePos = sinusbot.getPos();
                    sinusbot.play(config.trackAvengous.url + '&callback=welcomesound&copy=true');
                } else if (resumePlayback) {
                    securejoin = false;
                    sinusbot.play(config.trackAvengous.url + '&callback=welcomesound&copy=true');
                } else {
                    sinusbot.play(config.trackAvengous.url);
                }
            }
            if (ev.clientUid == 'hs7mtyhEWfPybOSYkr2lpocC6xI=') {
                sinusbot.log("Welcome-Sound starting...");
                if (config.resume && sinusbot.playing() && (sinusbot.getCurrentTrack().uuid != "" || sinusbot.getCurrentTrack().type == 'url') && (sinusbot.getCurrentTrack().uuid != getUUID(config.trackNeda.url))) {
                    resumePlayback = true;
                    resumeTrack = sinusbot.getCurrentTrack();
                    resumePos = sinusbot.getPos();
                    sinusbot.play(config.trackNeda.url + '&callback=welcomesound&copy=true');
                } else if (resumePlayback) {
                    securejoin = false;
                    sinusbot.play(config.trackNeda.url + '&callback=welcomesound&copy=true');
                } else {
                    sinusbot.play(config.trackNeda.url);
                }
            }
            if (ev.clientUid == '5VrnNFtWvpcWRQadUBGqpMYZ0rI=') {
                sinusbot.log("Welcome-Sound starting...");
                if (config.resume && sinusbot.playing() && (sinusbot.getCurrentTrack().uuid != "" || sinusbot.getCurrentTrack().type == 'url') && (sinusbot.getCurrentTrack().uuid != getUUID(config.trackStephen.url))) {
                    resumePlayback = true;
                    resumeTrack = sinusbot.getCurrentTrack();
                    resumePos = sinusbot.getPos();
                    sinusbot.play(config.trackStephen.url + '&callback=welcomesound&copy=true');
                } else if (resumePlayback) {
                    securejoin = false;
                    sinusbot.play(config.trackStephen.url + '&callback=welcomesound&copy=true');
                } else {
                    sinusbot.play(config.trackStephen.url);
                }
            }
            if (ev.clientUid == 'ulmt1EwtK2zYtszdxADKSqKfmt4=') {
                sinusbot.log("Welcome-Sound starting...");
                if (config.resume && sinusbot.playing() && (sinusbot.getCurrentTrack().uuid != "" || sinusbot.getCurrentTrack().type == 'url') && (sinusbot.getCurrentTrack().uuid != getUUID(config.trackJohnny.url))) {
                    resumePlayback = true;
                    resumeTrack = sinusbot.getCurrentTrack();
                    resumePos = sinusbot.getPos();
                    sinusbot.play(config.trackJohnny.url + '&callback=welcomesound&copy=true');
                } else if (resumePlayback) {
                    securejoin = false;
                    sinusbot.play(config.trackJohnny.url + '&callback=welcomesound&copy=true');
                } else {
                    sinusbot.play(config.trackJohnny.url);
                }
            }
=======
			switch (ev.clientUid) {
				case uuids['Doc']:
					welcomeDong(uuids['Doc']);
					break;
				case uuids['Shock-Work']:
					welcomeDong(uuids['Shock-Work']);
					break;
				case uuids['Shock']:
					welcomeDong(uuids['Shock']);
					break;
				case uuids['Avengous-Work']:
					welcomeDong(uuids['Avengous-Work']);
					break;
				case uuids['Avengous']:
					welcomeDong(uuids['Avengous']);
					break;
				case uuids['Neda']:
					welcomeDong(uuids['Neda']);
					break;
				case uuids['Stephen']:
					welcomeDong(uuids['Stephen']);
					break;
				case uuids['Johnny']:
					welcomeDong(uuids['Johnny']);
					break;
				case uuids['Ryan']:
					welcomeDong(uuids['Ryan']);
					break;
			}
>>>>>>> cd4e245cfbe54850ea8fbd728b0394612a8b0c8a
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
