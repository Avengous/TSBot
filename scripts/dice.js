registerPlugin({
 name: 'Magic Dice',
 version: '1.1',
 description: 'Rolls a die',
 author: 'GetMeOutOfHere, Avengous',
 vars: {
		diceMax: {
		 title: 'Max value of die',
		 type: 'string'
		},

		message: {
		 title: 'The message that should be displayed. (%n = nick, %d = dice, %r = result)',
		 type: 'string'
		}
 }


},	function (sinusbot, config)	{
					
		 sinusbot.on('chat', function(ev) {

					if(ev.msg == '!dice')
					{
						var max = config.diceMax;
						var min = 1;
						var result = Math.floor(Math.random() * (max - min) + min);
						var msg = config.message;
						
						msg = msg.replace('%n', ev.clientNick);
						msg = msg.replace('%d', max);
						msg = msg.replace('%r', result);	
						
						chatChannel(msg);
						
					}
		 });
	 });
