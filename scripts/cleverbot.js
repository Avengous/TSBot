registerPlugin({
    name: 'Cleverbot',
    version: '1.0',
    description: 'Chat with a bot about anything and everything. Cleverbot is a web application that uses an artificial intelligence algorithm to have conversations with humans.',
    author: 'Codebucket <david@codebucket.de>',
    vars: {
        apiuser: {
            title: 'Cleverbot.io API User',
            type: 'string'
        },
        apikey: {
            title: 'Cleverbot.io API Key',
            type: 'string'
        },
        lang: {
            title: 'Language', 
            type: 'string'
        }
    }
}, function(sinusbot, config, info) {
    function logDebug(message) {
        if (config.debug) {
            sinusbot.log(message)
        }
    }

    logDebug('Loading...');
    
    var author = info.author.split(',');
    if (author.length == 1){
        author = author[0];
        author = author.replace(/<.*>/gi, '').trim();
    } 
    else {
        author = author.map(function(e){
            return e.replace(/<.*>/gi, '').trim();
        });
        author = author.join(' & ');
    }
    
    var apiuser = config.apiuser;
    var apikey = config.apikey;
    var lang = config.lang;

    logDebug(info.name + ' v' + info.version + ' by ' + author + ' for SinusBot v0.9.9-50e8ba1 (and above)');
    
    sinusbot.on('connect', function(ev) {
        sinusbot.http({
            "method": "POST", 
            "url": "https://cleverbot.io/1.0/create", 
            "timeout": 60000,
            "body": "user=" + apiuser + "&key=" + apikey +
                "&nick=" + sinusbot.getBotId(),
            "headers": {"Content-Type": "application/x-www-form-urlencoded"}
        }, function (error, response) {
            if (error) {
                sinusbot.log(error);
                return;
            }
            
            var data = JSON.parse(response.data);                
            if (response.statusCode != 200) {
                sinusbot.chatChannel(data.status);
                return;
            }
        });
    });
    
    sinusbot.on('chat', function(ev) {
        var client = ev.clientId;        
        var mode = ev.mode;
        
        if (ev.mode == 0 || ev.mode == 3) return;
        if (ev.msg.indexOf("Cleverbot,") === 0 || ev.msg.indexOf("@docsdonger") === 0) {
            var question = ev.msg.substring(11, ev.msg.length);
            sinusbot.http({
                "method": "POST", 
                "url": "https://cleverbot.io/1.0/ask", 
                "timeout": 60000,
                "body": "user=" + apiuser + "&key=" + apikey +
                    "&nick=" + sinusbot.getBotId() + "&text=" + encodeURI(question),
                "headers": {"Content-Type": "application/x-www-form-urlencoded"}
            }, function (error, response) {
                if (error) {
                    sinusbot.log(error);
                    return;
                }
                
                var data = JSON.parse(response.data);                
                if (response.statusCode != 200) {
                    sinusbot.chatChannel(data.status);
                    return;
                }
                
                var response = data.response;
                if (mode == 1) {
                    sinusbot.chatPrivate(client, response);
                } 
                else if (mode == 2) {
                    sinusbot.say(response, lang);
					sinusbot.chatChannel(response);
                }
            });
        }
    });
});