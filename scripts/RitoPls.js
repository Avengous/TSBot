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
  description: 'Collection of League of Legends related commands.',
  author: 'Avengous',
  vars: {
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
				
				// Constants
				var msg_random_champion = "Doc's Donger has chosen [B][COLOR=#ff0000]%r[/COLOR][/B] for %n!"
				
				// SinusBot
				function sendRequest(req, url) {
					sinusbot.http({
						method: req,
						url: url.replace('{api_key}', config.apiKey),
						timeout: 10000,
						headers: [{"Content-Type": "application/json"}]
					}, function (error, response) {
						   if (error) {
							   sinusbot.log(error)
						   } else {
								return JSON.parse(response.data);
						   }
					   });
				}
				
				// Riot API
				function getSummonerByName(name, region) {
					var url = get_summoner_by_name.replace('{region}', config.region);
				}
				
				// RitoPls
				function getHelp(ev) {
					var msg_help = "\n" +
					"Command					Description \n" +
					"!ritopls					Displays this message \n" +
					"!pickforme					Selects a random champion for you \n" +
					"!summoner <name>			N/A Displays summoner information. \n";
					sinusbot.chatPrivate(ev.clientId, msg_help);
				}		
				
				function getRandomChampion(ev) {
					var data = sendRequest('GET', get_champions_url)
					var rand_int = Math.floor(Math.random() * Object.keys(data).length);
					var champions = [];
					var i = 0;
					for (var champion in data.data) {
						champions[i] = champion;
						i += 1; 
					}
					result = champions[rand_int];
					msg = msg_random_champion.replace('%n', ev.clientNick);
					msg = msg.replace('%r', result);
					sinusbot.chatChannel(msg);
				}
				
				// Command Reciever
                sinusbot.on('chat', function(ev) {
					switch (ev.msg) {
						case '!ritopls':
							getHelp(ev);
							break;
						case '!pickforme':
							getRandomChampion(ev);
							break;
					}
                 });

         });