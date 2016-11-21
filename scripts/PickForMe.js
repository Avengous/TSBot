/*
 * Copyright (C) 2016 Giovanni Schuoler <xxstryderxx@hotmail.com>
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
 *
 * @author Luigi Giovanni Schuoler <xxstryderxx@hotmail.com>
 *
 */
 
registerPlugin({
  name: 'Pick For Me LOL',
  version: '1.0',
  description: 'Picks a random League of Legends champion for you.',
  author: 'Avengous',
  vars: {
 		command: {
			title: 'Command String',
			type: 'string',
 		},
		apiKey: {
			title: 'Riot API Key',
			type: 'string',
		},
 		message: {
			title: 'The message that should be displayed. (%n = nick, %r = result)',
			type: 'string'
 		}
  }
 
 },	function (sinusbot, config)	{
		var get_champions_url = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key={api_key}'

		function getChampionList() {
			sinusbot.http({
				method: 'GET',
				url: get_champions_url.format({
					api_key: config.apiKey
				})
			}, function(err, res) {
            if (err) {
                send_msg(ev, "API Request error");
                sinusbot.log(err);
            }
			else {
                if (res.statusCode == 200) {
                    var data = JSON.parse(res.data);
				}
		}
		
 		sinusbot.on('chat', function(ev) {
			if(ev.msg == config.command){				
				var msg = config.message;
				
				for (champion in data['data']) {
					chatChannel(champion);
				}
				
				result = 'TestString';
				msg = msg.replace('%n', ev.clientNick);
				msg = msg.replace('%r', result);					
				chatChannel(msg);
			}
 		 });

 	 });