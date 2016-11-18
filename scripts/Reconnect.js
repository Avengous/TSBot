registerPlugin({
 name: 'Reconnect',
 version: '1.0',
 description: 'Reconnect',
 author: 'TS3index.com <info@ts3index.com.com>',
    vars: {}
}, function(sinusbot, config) {
    
    var checkConnection = function() {
        if (!sinusbot.running()) {
            sinusbot.connect();
        }
    }

    sinusbot.on('disconnect', function() {
        checkConnection();
    });
    
    setInterval(function(){ checkConnection(); }, 60000);
});
