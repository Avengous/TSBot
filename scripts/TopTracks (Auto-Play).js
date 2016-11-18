/* 
 * Copyright (C) 2016 Raphael Touet <raphraph@raphraph.de>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
 * 
 * @author Raphael Touet <raphraph@raphraph.de>
 * 
 */
registerPlugin({
    name: 'TopTracks',
    version: '1.4.1',
    description: 'Choose a playlist, vote for your favorite songs and the playlist will reorder by itself!',
    author: 'Raphael Touet <raphraph@raphraph.de>',
    vars: {
        playlist: {
            title: 'Your playlist (UID)',
            type: 'string',
            placeholder: 'The UID of your playlist, should have this format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
        },
        resetVotes: {
            title: 'Reset vote delay (in seconds)',
            type: 'number',
            placeholder: 'The amount of time before reseting the votes. -1 means no reset.'
        },
        admins: {
            title: 'Admin Uids, Group IDs',
            type: 'string',
            placeholder: '15, HSHL06oo000o00o6O+qj8MCX1PY=, 21, ...'
        },
        API_username: {
            title: 'API username',
            type: 'string',
            placeholder: 'any sinusbot user which has the required rights'
        },
        API_password: {
            title: 'API password',
            type: 'string',
            placeholder: 'the password to use with the given API username'
        },
        API_url: {
            title: 'API url',
            type: 'string',
            placeholder: 'the API url, f.e.: http://yourdomain:port/api/v1'
        },
        language: {
            title: 'Message language',
            type: 'select',
            options: [
                "English",
                "German",
                "French"
            ]
        }
    }
}, function(sinusbot, config, info) {
    
        // -- Some settings, which can be adjusted manually... --
        
        /*
         * !! DO NOT ADD ANY PARAMETER OR MESSAGE. IT COULD BREAK THIS SCRIPT AND YOU WON'T GET SUPPORTED ANYMORE. !!
         * Just edit the messages inbetween the " .
         * 
         * Possible placeholders: (Are not available every time)
         * - %clientNick%
         * - %clientId%
         * - %trackVotes%
         * - %trackArtist%
         * - %trackAlbum%
         * - %trackUuid%
         * - %trackTitle%
         * - %trackAlbumArtist%
         * - %trackGenre%
         * - %toptracks%
         */
        
    var commands = {
        vote: {
            cmd: "!vote",
            usage: "!vote"
        },
        toptracks: {
            cmd: "!toptracks",
            usage: "!toptracks [reset]",
            reset: {
                cmd: "reset",
                usage: "!toptracks reset"
            }
        },
        song: {
            cmd: "!song",
            usage: "!song"
        }
    };
    var commandsMsg = {
        vote: {
            chat: 2,
            msg: {
                en: "[b]%clientNick%[/b] has voted for the current track{{trackTitle}} ([u]%trackTitle%[/u] {{trackArtist}}by %trackArtist%{{/trackArtist}}){{/trackTitle}}! [b]Current votes: %trackVotes%[/b]",
                de: "[b]%clientNick%[/b] hat für diesen Song{{trackTitle}} ([u]%trackTitle%[/u] {{trackArtist}}von %trackArtist%{{/trackArtist}}){{/trackTitle}} abgestimmt! [b]Neue Stimmanzahl: %trackVotes%[/b]",
                fr: "[b]%clientNick%[/b] a voté pour cette chanson{{trackTitle}} ([u]%trackTitle%[/u] {{trackArtist}}de %trackArtist%{{/trackArtist}}){{/trackTitle}}! [b]Nouveau nombre de vote: %trackVotes%[/b]"
            },
            already_voted: {
                chat: 1,
                msg: {
                    en: "[b]You cannot vote multiple times for the same song![/b]",
                    de: "[b]Du kannst nicht mehrmals für den gleichen Song abstimmen![/b]",
                    fr: "[b]Tu ne peux pas voter plusieurs fois pour la même chanson![/b]"
                }
            }
        },
        toptracks: {
            chat: 1,
            msg: {
                en: "%toptracks%",
                de: "%toptracks%",
                fr: "%toptracks%"
            },
            reset: {
                chat: 1,
                msg: {
                    en: "The votes have been reset.",
                    de: "Die Stimmen wurden zurückgesetzt.",
                    fr: "Les voix ont été réinitialisés."
                }
            },
            noTracks: {
                chat: 1, // Currently even if you change this number, it will be sent to the same chat as the default "toptracks" command!
                msg: { // You currently cannot use any of the placeholders listed above in this message!
                    en: "There are currently no votes to display.",
                    de: "Es wurde noch keine Stimme abgegeben.",
                    fr: "Aucun vote n'as été enregistré pour le moment."
                } 
            }
        },
        song: {
            chat: 1,
            msg: {
                en: "[u]%trackTitle%[/u] {{trackArtist}}by %trackArtist%{{/trackArtist}} {{trackAlbum}}(Album: %trackAlbum%){{/trackAlbum}}",
                de: "[u]%trackTitle%[/u] {{trackArtist}}von %trackArtist%{{/trackArtist}} {{trackAlbum}}(Album: %trackAlbum%){{/trackAlbum}}",
                fr: "[u]%trackTitle%[/u] {{trackArtist}}de %trackArtist%{{/trackArtist}} {{trackAlbum}}(Album: %trackAlbum%){{/trackAlbum}}"
            },
            noTrack: {
                chat: 1,
                msg: {
                    en: "[b]Currently no track is being played![/b]",
                    de: "[b]Es wird derzeit kein Song abgespielt![/b]",
                    fr: "[b]Aucune chanson n'est en train d'être jouée![/b]"
                }
            }
        }
    };
    var msgFormat = {
        toptracks: {
            en: "[b]%trackVotes%[/b] : [u]%trackTitle%[/u] {{trackArtist}}by %trackArtist%{{/trackArtist}} {{trackAlbum}}(Album: %trackAlbum%){{/trackAlbum}}",
            de: "[b]%trackVotes%[/b] : [u]%trackTitle%[/u] {{trackArtist}}von %trackArtist%{{/trackArtist}} {{trackAlbum}}(Album: %trackAlbum%){{/trackAlbum}}",
            fr: "[b]%trackVotes%[/b] : [u]%trackTitle%[/u] {{trackArtist}}de %trackArtist%{{/trackArtist}} {{trackAlbum}}(Album: %trackAlbum%){{/trackAlbum}}"
        }
    };
    var max_toptracks_listed = 20;
    var debug = false;
    
    /* 
                !! DO NOT EDIT SOMETHING BENEATH THIS LINE !!
    */
      
        // -- Setting additional informations --
    info.testversion = "0.9.11-ee30ef7";
    
        // -- Load messages --
    sinusbot.log(''); sinusbot.log('Loading...'); sinusbot.log('');
    var author = info.author.split(',');
    if(author.length == 1){
        author = author[0];
        author = author.replace(/<.*>/gi, '').trim();
    } else {
        author = author.map(function(e){
            return e.replace(/<.*>/gi, '').trim();
        });
        author = author.join(' & ');
    }
    sinusbot.log(info.name + ' v' + info.version + ' by ' + author + ' for SinusBot v' + info.testversion + ' (and above)');
    
        // -- Additional variables --
    var errors = {
        configErr: "configErr",
        configUndef: "configUndef",
        undefined: "undefined",
        notFound: "notFound",
        apiErr: "apiErr",
        apiCustomErr: "apiCustomErr"
    };
    var errorsPre = {
        configErr: "[CONFIG] ",
        configUndef: "[CONFIG] ",
        undefined: "[UNDEF.] ",
        notFound: "[NOT FOUND] ",
        apiErr: "[HTTP-API] ",
        apiCustomErr: "[HTTP-API] "
    };
    var errorsMsg = {
        configUndef: "Please check your configuration. There is an undefined setting named '%name%'.",
        configErr: "Please check your configuration. %message%",
        apiErr: "There was an error with the http-api. Error-response: %error%",
        apiCustomErr: "There was an error with the http-api. %message%"
    };
    var logs = {
        custom: "custom",
        scriptStart: "scriptStart"
    };
    var logsMsg = {
        custom: "%message%",
        scriptStart: "The script is now starting itself..."
    };
    var self = getBotId();
    
        // -- Basic functions --
    // -> logErr(type, options)
    logErr = function(type, options, cancelScript) {
        type = type || undefined;
        cancelScript = cancelScript || false;
        var pre = "[ERROR]";
        for (var errtype in errors) {
            if (errtype == type) {
                sinusbot.log(pre + errorsPre[errtype] + errorsMsg[errtype]
                        .replace("%message%", (typeof options.message == "undefined" || !options.message ? "" : options.message))
                        .replace("%name%", (typeof options.name == "undefined" || !options.name ? "" : options.name))
                        .replace("%error%", (typeof options.error == "undefined" || !options.error ? "" : options.error))
                );
            }
        }
        if (cancelScript) {
            sinusbot.log(''); sinusbot.log('Exit script...'); sinusbot.log('');
            return true;
        }
    };
    // -> logIt(type, options)
    logIt = function(type, options, onlyDebugging) {
        type = type || undefined;
        onlyDebugging = onlyDebugging || false;
        if (onlyDebugging && debug == false) return;
        var pre = "[INFO] ";
        for (var logtype in logs) {
            if (logtype == type) {
                sinusbot.log(pre + logsMsg[logtype]
                        .replace("%message%", (typeof options.message == "undefined" || !options.message ? "" : options.message))
                );
            }
        }
    };
    // -> startsWith(searchString, position)
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(searchString, position) {
            position = position || 0;
            return this.indexOf(searchString, position) === position;
        };
    }
    // -> jsonToObject() converts a json-string into an object
    if (!String.prototype.jsonToObject) {
        String.prototype.jsonToObject = function() {
            return JSON.parse(this);
        };
    }
    // -> cleanArray() cleans an array of unwanted entries
    function cleanArray(array, deleteValue) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == deleteValue) {         
                array.splice(i, 1);
                i--;
            }
        }
        return array;
    };
    // -> isUndefined(variable)
    isUndefined = function(variable) {return typeof variable == "undefined";};
    // -> generate a random integer (min and max are included !)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
        // -- Check config --    
    var exit = false;
    if (isUndefined(config.playlist)) exit = logErr(errors.configUndef, {name: info.vars.playlist.title}, true);
    else if (sinusbot.playlistGet(config.playlist) == null) exit = logErr(errors.configErr, {message: "You have to enter a valid playlist uid!"}, true);
    if (isUndefined(config.resetVotes)) exit = logErr(errors.configUndef, {name: info.vars.resetVotes.title}, true);
    else if (config.resetVotes > 0 && config.resetVotes < 60) exit = logErr(errors.configErr, {message: "The reset time has to be greater (or euqal) than 60!"}, true);
    if (isUndefined(config.admins)) exit = logErr(errors.configUndef, {name: info.vars.admins.title}, true);
    if (isUndefined(config.API_username)) exit = logErr(errors.configUndef, {name: info.vars.API_username.title}, true);
    if (isUndefined(config.API_password)) exit = logErr(errors.configUndef, {name: info.vars.API_password.title}, true);
    if (isUndefined(config.API_url)) exit = logErr(errors.configUndef, {name: info.vars.API_url.title}, true);
    var api_username = config.API_username, api_password = config.API_password, api_url = config.API_url;
    
    if (exit) {
        return false;
    }
    
        // -- Additional variables --
    var admins = config.admins.split(',').map(function(e) {
        var numb = parseInt(e.trim().replace(/\r/g, ''));
        if(isNaN(numb)) {
            return e.trim().replace(/\r/g, '');
        } else {
            return numb;
        }
    });
    var lang;
    switch (config.language) {
        case 1:
            lang = "de";
            break;
        case 2:
            lang = "fr";
            break;
        default:
            lang = "en";
            break;
    }
    var api_botId, api_token, api_token_time = 86100000; // 1 day minus 5 minutes
    var toptracks = {}, hasvoted = {}, current_track_uuid = "";
    var stopPlayback = false;
    
        // -- Additional functions --
    // -> APIgetDefaultBotId(callback) gets the default bot id
    function APIgetDefaultBotId(api_url, callback) {
        var botId;
        sinusbot.http({
            method: "GET",
            url: api_url + "/botId"
        }, function(error, response) {
            if (error) {
                logErr(errors.apiErr, {error: JSON.stringify(error)}, false);
                botId = undefined;
            } else {
                botId = response.data.jsonToObject().defaultBotId;
            }
            callback(botId);
        });
    }
    // -> APIlogin(api_url, username, password, botId, callback) logs into the api
    function APIlogin(api_url, username, password, botId, callback) {
        var token;
        sinusbot.http({
            method: "POST",
            url: api_url + "/bot/login",
            headers: {
                "Content-Type": "application/json"
            },
            body: '{"username": "'+username+'", "password": "'+password+'", "botId": "'+botId+'"}'
        }, function(error, response) {
            if (error) {
                logErr(errors.apiErr, {error: JSON.stringify(error)}, false);
                token = undefined;
            } else {
                token = response.data.jsonToObject().token;
            }
            callback(token);
        });
    }
    // -> APIautoLogin(api_url, api_username, api_password, token_time) auto renew login
    function APIautoLogin(api_url, username, password, token_time, callback) {
        APIgetDefaultBotId(api_url, function(botId){
            api_botId = botId;
            APIlogin(api_url, username, password, botId, function(token){
                api_token = token;
                callback();
            });
        });
        setInterval(function(){
            APIgetDefaultBotId(api_url, function(botId){
                api_botId = botId;
                APIlogin(api_url, username, password, botId, function(token){
                    api_token = token;
                });
            });
        }, token_time);
    }
    function APIreorderTrack(api_url, api_token, list_uid, index, target, callback) {
        sinusbot.http({
            method: "POST",
            url: api_url + "/bot/playlists/" + list_uid + "/move",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + api_token
            },
            body: '{"index": ' + index + ', "target": ' + target + '}'
        }, function(error, response){
            if (error) {
                logErr(errors.apiErr, {error: JSON.stringify(error)}, false);
                callback(false, error);
                return;
            }
            callback(true, response);
        });
    }
    // -> toptracksVoteAdd(uuid) adds a vote to the given track
    function toptracksVoteAdd(uuid) {
        toptracks = (sinusbot.getVarInstance("toptracks_toptracks") == "undefined" || !sinusbot.getVarInstance("toptracks_toptracks") ? toptracks : sinusbot.getVarInstance("toptracks_toptracks"));
        if (toptracks.hasOwnProperty(uuid)) {
            toptracks[uuid] = toptracks[uuid] + 1;
        } else {
            toptracks[uuid] = 1;
        }
        var list = sinusbot.playlistGet(config.playlist), votes = toptracks[uuid];
        var e;
        for (var entry in list.entries) {
            if (list.entries[entry].file == uuid){
                e = parseInt(entry);
                break;
            }
        }
        var i = 0;
        for (var entry in list.entries) {
            if (!toptracks.hasOwnProperty(list.entries[entry].file)) {
                i = parseInt(entry);
                break;
            }
            if (votes > toptracks[list.entries[entry].file]) {
                i = parseInt(entry);
                break;
            }
        }
        sinusbot.setVarInstance("toptracks_toptracks", toptracks);
        if (typeof i == "undefined" || i == e) return {votes: toptracks[uuid], index: e};
        APIreorderTrack(api_url, api_token, config.playlist, e, i, function(success, data){
            if (!success) {
                logErr(errors.apiCustomErr, {message: "Could not update the playlist!"}, false);
                logErr(errors.apiErr, {error: JSON.stringify(data)}, false);
            }
        });
        return {votes: toptracks[uuid], index: i};
    }
    // -> toptracksReset() resets all votes
    function toptracksReset() {
        toptracks = {};
        sinusbot.setVarInstance("toptracks_toptracks", toptracks);
        hasvoted = {};
        sinusbot.setVarInstance("toptracks_hasvoted", hasvoted);
    }
    // -> send command messages
    function sendCmdMessage(cmdMsg, ev) {
        var track = sinusbot.getCurrentTrack();
        var m = cmdMsg.msg[lang]
                .replace(/%clientNick%/gi, ev.client.nick)
                .replace(/%clientId%/gi, ev.client.id)
                .replace(/%trackVotes%/gi, sinusbot.getVarInstance("toptracks_toptracks")[track.uuid])
                .replace(/%trackArtist%/gi, (typeof track.artist == "undefined" || track.artist == null || track.artist == "" ? (typeof track.tempArtist == "undefined" || track.tempArtist == null || track.tempArtist == "" ? "%trackArtist%" : track.tempArtist) : track.artist))
                .replace(/%trackUuid%/gi, track.uuid)
                .replace(/%trackTitle%/gi, (typeof track.title == "undefined" || track.title == null || track.title == "" ? (typeof track.tempTitle == "undefined" || track.tempTitle == null || track.tempTitle == "" ? "%trackTitle%" : track.tempTitle) : track.title))
                .replace(/%trackAlbum%/gi, (typeof track.album == "undefined" || track.album == null || track.album == "" ? "%trackAlbum%" : track.album))
                .replace(/%trackAlbumArtist%/gi, (typeof track.albumArtist == "undefined" || track.albumArtist == null || track.albumArtist == "" ? "%trackAlbumArtist%" : track.albumArtist))
                .replace(/%trackGenre%/gi, (typeof track.genre == "undefined" || track.genre == null || track.genre == "" ? "%trackGenre%" : track.genre))
            ;
        var opts = ["clientNick","clientId","trackVotes", "trackArtist", "trackUuid", "trackTitle", "trackAlbum", "trackAlbumArtist", "trackGenre"];
        for (var opt in opts) {
            if (m.match(new RegExp("{{" + opts[opt] + "}}.*%" + opts[opt] + "%.*{{/" + opts[opt] + "}}", "gi")) != null) m = m.replace(new RegExp("{{" + opts[opt] + "}}.*%" + opts[opt] + "%.*{{/" + opts[opt] + "}}", "gi"), "");
            else m = m.replace(new RegExp("{{" + opts[opt] + "}}(.*){{/" + opts[opt] + "}}", "gi"), "$1");
        }
        if (m.match(/%toptracks%/gi) != null) {
            m = m.replace(/%toptracks%/gi, getFormatedToptracks());
            if (m.match(/{{toptracks}}.*%toptracks%.*{{\/toptracks}}/gi) != null) m = m.replace(/{{toptracks}}.*%toptracks%.*{{\/toptracks}}/gi, "");
            else m = m.replace(/{{toptracks}}(.*){{\/toptracks}}/gi, "$1");
        }
        if (cmdMsg.chat == 1) {
            chatPrivate(ev.client.id, m);
        } else if (cmdMsg.chat == 2) {
            chatChannel(m);
        }
    }
    function getFormatedToptracks() {
        var toptracks = sinusbot.getVarInstance("toptracks_toptracks"), sortable = [];
        for (var track in toptracks) {
            sortable.push([track, toptracks[track]]);
        };
        sortable.sort(function(a,b) {
            return (a[1] - b[1])*(-1);
        });
        if (sortable.length == 0) {
            return commandsMsg.toptracks.noTracks.msg[lang];
        }
        var ttmsg = (lang == "de" ? "Stimmen : Song" : (lang == "fr" ? "Voix : Nom de la chanson" : "Votes : Track name"));
        var i = 0;
        for (var track in sortable) {
            if (i >= max_toptracks_listed) break;
            var t = sinusbot.getTrack(sortable[track][0]);
            var t_msg = "\n" + msgFormat.toptracks[lang]
                    .replace(/%trackVotes%/gi, sortable[track][1])
                    .replace(/%trackArtist%/gi, (typeof t.artist == "undefined" || t.artist == null || t.artist == "" ? (typeof t.tempArtist == "undefined" || t.tempArtist == null || t.tempArtist == "" ? "%trackArtist%" : t.tempArtist) : t.artist))
                    .replace(/%trackUuid%/gi, t.uuid)
                    .replace(/%trackTitle%/gi, (typeof t.title == "undefined" || t.title == null || t.title == "" ? (typeof t.tempTitle == "undefined" || t.tempTitle == null || t.tempTitle == "" ? "%trackTitle%" : t.tempTitle) : t.title))
                    .replace(/%trackAlbum%/gi, (typeof t.album == "undefined" || t.album == null || t.album == "" ? "%trackAlbum%" : t.album))
                    .replace(/%trackAlbumArtist%/gi, (typeof t.albumArtist == "undefined" || t.albumArtist == null || t.albumArtist == "" ? "%trackAlbumArtist%" : t.albumArtist))
                    .replace(/%trackGenre%/gi, (typeof t.genre == "undefined" || t.genre == null || t.genre == "" ? "%trackGenre%" : t.genre))
                ;
            var opts = ["trackVotes", "trackArtist", "trackUuid", "trackTitle", "trackAlbum", "trackAlbumArtist", "trackGenre"];
            for (var opt in opts) {
                if (t_msg.match(new RegExp("{{" + opts[opt] + "}}.*%" + opts[opt] + "%.*{{/" + opts[opt] + "}}", "gi")) != null) t_msg = t_msg.replace(new RegExp("{{" + opts[opt] + "}}.*%" + opts[opt] + "%.*{{/" + opts[opt] + "}}", "gi"), "");
                else t_msg = t_msg.replace(new RegExp("{{" + opts[opt] + "}}(.*){{/" + opts[opt] + "}}", "gi"), "$1");
            }
            ttmsg += t_msg;
            i+=1;
        }
        return ttmsg;
    }
    // -> shuffleArray(array) shuffles an array
    function shuffleArray(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    // -> leadedRandomTrack() get a random track counting in the votes
    function leadedRandomTrack(callback) {
        var list = sinusbot.playlistGet(config.playlist);
        var nlist = [], toptracks = sinusbot.getVarInstance("toptracks_toptracks");
        for (var entry in list.entries) {
            nlist.push(list.entries[entry].file);
            if (toptracks.hasOwnProperty(list.entries[entry].file)) {
                var i = toptracks[list.entries[entry].file];
                while (i--) {
                    nlist.push(list.entries[entry].file);
                }
            }
        }
        nlist = cleanArray(nlist, null);
        nlist = shuffleArray(nlist);
        var rand = getRandomInt(0, nlist.length-1);
        var track = nlist[rand], track_nb;
        for (var entry in list.entries) {
            if (list.entries[entry].file == track) track_nb = parseInt(entry);
        }
        callback({uid: track, index: track_nb});
        return {uid: track, index: track_nb};
    }
    // -> stopScriptPlayback() stops the entire script playback until !play is used
    function stopScriptPlayback() {
        if (current_track_uuid != "undefined" && typeof current_track_uuid != "undefined") {
            stopPlayback = true;
        }
    }
    // -> stopScriptPlayback() stops the entire script playback until !play is used
    function startScriptPlayback() {
        if (current_track_uuid != "undefined" && typeof current_track_uuid != "undefined") {
            return;
        }
        if (sinusbot.playing()) {
            sinusbot.stop();
        } else {
            leadedRandomTrack(function(data) {
                sinusbot.play("track://" + data.uid);
                current_track_uuid = sinusbot.getCurrentTrack()["uuid"];
            });
        }
    }
    
        // -- Script start --
    logIt(logs.scriptStart, {}, true);
    var script_block = true;
    APIautoLogin(api_url, api_username, api_password, api_token_time, function(){
        //sinusbot.play(playlist_url);
        script_block = false;
        startScriptPlayback();
        if (config.resetVotes != -1) {
            setInterval(function(){
                toptracksReset();
            }, config.resetVotes * 1000);
        }
    });
        
        // -- Events --
    
    sinusbot.on('chat', function(ev) {
        if (script_block) return;
        if (self == ev.client.id) return;
        if (ev.mode == 3) return;
        
        var args = cleanArray(ev.msg.split(" ").map(function(e){ return e.trim().replace(/\r/g, '');}), "");
        if (args.length == 0) return;
        
        switch (args[0].toLowerCase()) {
            case commands.vote.cmd.toLowerCase():
                if (current_track_uuid == "undefined") {
                    sendCmdMessage(commandsMsg.song.noTrack, ev);
                    break;
                }
                hasvoted = (sinusbot.getVarInstance("toptracks_hasvoted") == "undefined" || !sinusbot.getVarInstance("toptracks_hasvoted") ? hasvoted : sinusbot.getVarInstance("toptracks_hasvoted"));
                if (typeof hasvoted[current_track_uuid] != "undefined" && hasvoted[current_track_uuid].indexOf(ev.client.id) != -1) {
                    sendCmdMessage(commandsMsg.vote.already_voted, ev);
                    break;
                }
                if (typeof hasvoted[current_track_uuid] == "undefined") {
                    hasvoted[current_track_uuid] = [ev.client.id];
                } else {
                    hasvoted[current_track_uuid].push(ev.client.id);
                }
                sinusbot.setVarInstance("toptracks_hasvoted", hasvoted);
                toptracksVoteAdd(sinusbot.getCurrentTrack().uuid);
                sendCmdMessage(commandsMsg.vote, ev);
                break;
            case commands.toptracks.cmd.toLowerCase():
                if (args.length == 1) {
                    sendCmdMessage(commandsMsg.toptracks, ev);
                    break;
                }
                switch (args[1]) {
                    case commands.toptracks.reset.cmd:
                        if (admins.indexOf(ev.clientUid) == -1) {
                            var is = false;
                            for (var sg in ev.clientServerGroups) {
                                if (admins.indexOf(ev.clientServerGroups[sg].i) != -1) is = true;
                            }
                            if (!is) {
                                sendCmdMessage(commandsMsg.toptracks, ev);
                                break;
                            }
                        }
                        toptracksReset();
                        sendCmdMessage(commandsMsg.toptracks.reset, ev);
                        break;
                    default:
                        break;
                }
                break;
            case commands.song.cmd.toLowerCase():
                if (sinusbot.getCurrentTrack() == "undefined" && !sinusbot.playing()) {
                    sendCmdMessage(commandsMsg.song.noTrack, ev);
                    break;
                }
                sendCmdMessage(commandsMsg.song, ev);
                break;
            case "!stop":
                stopScriptPlayback();
                break;
            case "!next":
                sinusbot.stop();
                break;
            case "!play":
                startScriptPlayback();
                break;
            default:
                break;
        }
    });
    
    sinusbot.on('trackEnd', function() {
        if (script_block) return;
        if (stopPlayback) {
            stopPlayback = false;
            current_track_uuid = "undefined";
            return;
        }
        leadedRandomTrack(function(data) {
            sinusbot.play("track://" + data.uid);
            current_track_uuid = sinusbot.getCurrentTrack()["uuid"];
        });
    });
    
        // -- Information --
    sinusbot.log(''); sinusbot.log('Loaded !'); sinusbot.log('');
    
});

