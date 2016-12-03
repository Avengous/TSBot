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
 * @author Giovanni Schuoler <xxstryderxx@hotmail.com>
 *
 */

registerPlugin({
  name: 'RitoPls',
  version: '1.0',
  description: 'Placeholder',
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
				region: {
					title: 'Client Region',
					type: 'string'
				}
  }

 },     function (sinusbot, config){
				// API URLs
                var get_champions_url = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key={api_key}';
				var get_summoner_by_name = 'https://na.api.pvp.net/api/lol/{region}/v1.4/summoner/by-name/{name}?api_key={api_key}';
				
				// SinusBot
				function sendRequest(method, url) {
					sinusbot.http({
						"method": method,
						"url": url.replace.('{api_key}', config.apiKey),
						"timeout": 10000,
						"headers": [{"Content-Type": "application/json"}]
					}, function (error, response) {
						   return JSON.parse(response.data);
					   });
				}
				
				// Riot API
				function getSummonerByName(name, region) {
					var url = get_summoner_by_name.replace('{region}', config.region);
					
				}
				
				// RitoPls
				function getRandomChampion() {
					var data = sendRequest('GET', get_champions_url)
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
				}
				
				// Command Reciever
                sinusbot.on('chat', function(ev) {
                        if(ev.msg == config.command){
                                getChampion(config.message, ev);
                        }
                 });

         });