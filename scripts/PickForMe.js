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

 },     function (sinusbot, config){
                var get_champions_url = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key={api_key}'
				function getChampion(msg, ev) {
					sinusbot.http({
						"method": "GET", 
						"url": get_champions_url.replace('{api_key}', config.apiKey)
						"timeout": 10000, 
						"headers":[{"Content-Type": "application/json"}]
					}, function (error, response) {
						var data = JSON.parse(response.data);
						var rand_int = Math.floor(Math.random() * Object.keys(data.data).length);
						var champions = [];
						var i = 0;
						for (var champion in data.data) {
							champions[i] = champion;
							i += 1; 
						}
						result = champions[rand_int];
						msg = msg.replace('%n', ev.clientNick);
						msg = msg.replace('%r', result);
						sinusbot.chatChannel(msg);
					});
				}

                sinusbot.on('chat', function(ev) {
                        if(ev.msg == '!pickforme'){
                                getChampion(config.message, ev);
                        }
                 });

         });
