registerPlugin({
 name: 'WelcomeDong',
 version: '1.1',
 description: 'This script will let the bot greet the Dongers with a track and resume the last track or stream.',
 author: 'Shock',
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
    if (!config || !config.trackDoc || !config.trackShock || !config.trackAvengous) {
      sinusbot.log("Settings invalid.");
      return;
    }

    var resumePlayback = false;
    var resumeTrack = false;
    var resumePos = 0;

    var securejoin = true;

    var getUUID = function (url) {
        var match = url.match(/track:\/\/(\.)?(.[^/:]+)/i);
        if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
          return match[2];
        }
        else {
            return null;
        }
    }

    sinusbot.on('clientMove', function(ev) {
        var userName = ev.clientNick;
        
        if (ev.newChannel == sinusbot.getCurrentChannelId()) {
            if (userName.indexOf('Doc') >= 0) {
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
            if (userName.indexOf('Shock') >= 0 || userName.indexOf('Dabe') >= 0 ) {
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
            if (userName.indexOf('vengous') >= 0) {
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