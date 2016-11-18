registerPlugin({
 name: '!dice',
 version: '1.0',
 description: 'roll a dice!',
 author: 'GetMeOutOfHere',
 vars: {
		diceSides: {
		 title: 'number of sides',
		 type: 'select',
	 options: ['4', '6', '8', '10', '12', '20']
		},

		message: {
		 title: 'The message that should be displayed. (%n = nick, %d = dice, %r = result)',
		 type: 'string'
		}
 }


},	function (sinusbot, config)	{
					
		 sinusbot.on('chat', function(ev) {
						
						var dice = 4;						
						switch (config.diceSides) {
							case 1:
								dice = 6;
								break;
							case 2:
								dice = 8;
								break;
							case 3:
								dice = 10;
								break;
							case 4:
								dice = 12;
								break;
							case 5:
								dice = 20;
								break;
						}

					if(ev.msg == '!dice')
					{
												
						var min = 1;
						var result = Math.round(Math.random() * (dice - min)) + min;
						var msg = config.message;
						msg = msg.replace('%n', ev.clientNick);
						msg = msg.replace('%d', dice);
						msg = msg.replace('%r', result);					
						chatChannel(msg);
						
					}
		 });
	 });
