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
        if (ev.newChannel == sinusbot.getCurrentChannelId()) {
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
            if (ev.clientUid == 'iHkPTzEw+WI5dBr9esCXS+Z8Yoo=' || ev.clientUid == 'mZkDMgo9bSDAegu1rUZcKhcVZVo=') {
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