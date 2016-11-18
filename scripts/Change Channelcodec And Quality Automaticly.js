//
//Copyright (C) 2016 Mareczin <mareczinpl@gmail.com>
//

registerPlugin({
    name: 'Change Channelcodec and Quality automaticly',
    version: '1.3.1',
    description: 'Change Channelcodec and Quality automaticly',
    author: 'Mareczin <mareczinpl@gmail.com>',
    vars: [
		{
			name: 'ChannelQuality',
			title: 'Channel Quality',
			type: 'select',
			options: [1,2,3,4,5,6,7,8,9,10]
		},
		{
			name: 'ChannelCodec',
			title: 'Channel Codec',
			type: 'select',
			options: [
				'Speex Schmalband',
				'Speex Breitband',
				'Speex Ultra-Breitband',
				'CELT Mono',
				'Opus Voice',
				'Opus Music'
			]
		},
		{
			name: 'changeold',
            title: 'Change the codec on this before the change when the bot goes to a new channel?',
            type: 'select',
            options: [
				'no',
                'yes'
            ]
        },
	]

}, function(sinusbot, config) {

	sinusbot.on('botMove', function(ev) {
		var cid = getCurrentChannelId();
		var chan = getChannel(cid);
		var ChannelCodec = config.ChannelCodec;	
		var ChannelQuality = config.ChannelQuality;


		
		channelUpdate(getCurrentChannelId(), { codec: Number(ChannelCodec), quality: Number(ChannelQuality) + 1 });
		
	if(config.changeold == 1 || typeof config.changeold == 'undefined') {
		if(ev.oldChannel != 0) {
                        channelUpdate(ev.oldChannel, { codec: sinusbot.getVarInstance("code"), quality: sinusbot.getVarInstance("qual") });
	                sinusbot.setVarInstance("code", chan.codec);
	                sinusbot.setVarInstance("qual", chan.quality);
                }
	}


    });
	
    sinusbot.log('Change Codec Load');

});
