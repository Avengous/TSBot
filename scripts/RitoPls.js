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
				var last_request;
				// API URLs
                var get_champions_url = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key={api_key}';
				var get_summoner_by_name = 'https://na.api.pvp.net/api/lol/{region}/v1.4/summoner/by-name/{name}?api_key={api_key}';
				var get_league = 'https://na.api.pvp.net/api/lol/{region}/v2.5/league/by-summoner/{summoner_id}?api_key={api_key}'
				
				// Constants
				var msg_random_champion = "Doc's Donger has chosen [B][COLOR=#ff0000]%r[/COLOR][/B] for %n!"
				
				// SinusBot
				function httpOps(req, url) {
					console.log('httpOps: ' + url.replace('{api_key}', config.apiKey));
					return {
						method: req,
						url: url.replace('{api_key}', config.apiKey),
						timeout: 10000,
						headers: [{"Content-Type": "application/json"}]
					};
				}
				
				function sendRequest(method, url) {
					console.log('sendRequest: ' + url);
					var status_code;
					var data;
//					do {
						sinusbot.http(httpOps(method, url),
							function callback(err, res) {
								console.log('Error: \n' + err);
								console.log('Res: \n' + res);
								console.log('ResData: \n' + res.data);
								status_code = res.statusCode;
								data = res.data;
							}
						);
//					} while (status_code != 200);
					return data;
				}
				
				// Riot API
				function getSummonerIdByName(name) {
					var url = get_summoner_by_name.replace('{region}', config.region);
					url = url.replace('{name}', name);
					data = sendRequest('GET', url);
					console.log('getSummonerIdByName: ' + data);
					return data[Object.keys(data)[0]]['id'];
				}
/*					var url = get_summoner_by_name.replace('{region}', config.region);
					url = url.replace('{name}', name);
					sinusbot.http(httpOps('GET', url),
						function (err, res) {
							data = JSON.parse(res.data);
							last_request = data[Object.keys(data)[0]]['id'];
						}
					);
					return last_request;
				}*/
				
				function xxxgetLeaguesById(id) {
					var url = get_league.replace().replace('{region}', config.region);
					url = url.replace('{summoner_id}', id);
					sinusbot.http(httpOps('GET', url),
						function (err, res) {
							data = res.data;
							last_request = data;
						}
					)
					return last_request;
				}
				
				function getLeaguesById(id) {
					var url = get_league.replace().replace('{region}', config.region);
					url = url.replace('{summoner_id}', id);
					console.log('getLeaguesById: ' + url); //REMOVE
					data = sendRequest('GET', url);
					console.log(data);
				}
				
				// RitoPls
				function getHelp(ev) {
					var msg_help = "\n" +
					"Command    Description \n" +
					"!ritopls    Displays this message \n" +
					"!pickforme    Selects a random champion for you \n" +
					"!rank <name>    N/A Displays summoner information. \n";
					sinusbot.chatPrivate(ev.clientId, msg_help);
				}		
				
				function getRandomChampion(ev) {
					sinusbot.http(httpOps('GET', get_champions_url),
						function (err, res) {
							var data = JSON.parse(res.data);
							var rand_int = Math.floor(Math.random() * Object.keys(data.data).length);
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
					);
				}
				
				function getSummonerRank(ev, name) {
					var id = getSummonerIdByName(name);
					data = getLeaguesById(id);
					data = data;
					for (var key in data) {
						if (data.hasOwnProperty(key)) {
							sinusbot.log(data[key]);
						}
					}
					sinusbot.chatPrivate(ev.clientId, id);
				}
				
				// Command Reciever
                sinusbot.on('chat', function(ev) {
					msg = ev.msg.split(' ')
					switch (msg[0]) {
						case '!ritopls':
							getHelp(ev);
							break;
						case '!pickforme':
							getRandomChampion(ev);
							break;
						case '!rank':
							getSummonerRank(ev, msg[1]);
							break;
					}
                 });

         });