registerPlugin({
 name: 'Connect Four',
 version: '1.0.1',
 description: 'Connect Four Game',
 author: 'Luchs',
 vars: {
 auids: {
 title: "Comma-seperated list of UIDs that are allowed to administrate games",
 type: "string",
 },
 timeout: {
 title: "Time till the game gets closed when there is no user input",
 type: "number", 
 },
 }
}, function(sinusbot, config){
 sinusbot.log("Connect Four Plugin loaded");
 
 var spacer = "[COLOR=#0000ff]|[/COLOR]";
 var playerOneColor = "[COLOR=#ff0000]⚫[/COLOR]";
 var playerTwoColor = "[COLOR=#00ff00]⚫[/COLOR]";
 
 var timeout = config.timeout;
 var uids = [];
 if(config.auids) {uids = config.auids.replace(/ /g, "").split(",");}
 

		var board = [[9,9,9,9,9,9,9], [9,9,9,9,9,9,9], [9,9,9,9,9,9,9], [9,9,9,9,9,9,9], [9,9,9,9,9,9,9], [9,9,9,9,9,9,9]];
		var playing = false;
		var joinable = false;
 var inactive = 0;
 var joined = 0;
		var num = 0;
		var turn = "";
		var symbol = -1;
		var playerOneId = "";
 var playerOneNick = "";
		var playerTwoId = "";
		var playerTwoNick = "";
		
 setInterval(function() {
 if(playing)
 {
 inactive++;
 if(inactive > timeout)
 {
 resetGame();
 sinusbot.chatChannel("[B][COLOR=#1e7f39]Game was closed because nobody is playing![/COLOR][/B]");
 }
 } 
 }, 1000);
 
		function resetGame() {
			for (var i=0; i<6; i++)
			{
				for (var j=0; j<7; j++)
				{
					board[i][j] = 9;
				}
			}
			playing = false;
			joinable = false;
            inactive = 0;
            joined = 0;
			num = 0;
			turn = "";
			symbol = -1;
			playerOneId = "";
            playerOneNick = "";
		    playerTwoId = "";
		    playerTwoNick = "";
		};
		
		function placeMark(y) {
			if (y<0 || y>6)
			{
				sinusbot.chatChannel("[B][COLOR=#1e7f39]Coordinates are out of bounds![/COLOR][/B]");	
				return -1;
			}
            
            for(var i=5; i>=0; i--)
            {
                if(board[i][y] == 9)
                {
                    board[i][y] = symbol;
                    printBoard();
                    
                    return i;
                }
            }

			sinusbot.chatChannel("[B][COLOR=#1e7f39]There is no more space![/COLOR][/B]");
			return -1;
		};
        
        function hMatch(x) {
            var count = 0;

	        for(var i=0; i<7; i++)
	        {
        		if(board[x][i] == symbol)
	        		count++;
	        	else
		        	count = 0;
                    
                if(count==4)
	        		return true;
	        }
	        return false;
        };

        function vMatch(y) {
	        var count = 0;

	        for(var i=0; i<6; i++)
	        {
		        if(board[i][y] == symbol)
			        count++;
		        else
			        count = 0;
                    
                if(count==4)
			        return true;
	        }
	        return false;
        };

        function dMatch1(x,y){
	        var count = 0;

	        if(x>y)
	        {
		        x = x-y;
		        y = 0;
	        }
	        else
	        {
		        y = y-x;
		        x = 0;
	        }

	        for(var i=0; i<6; i++)
	        {
		        if(x+i>5 || y+i>6)
			        return false;

		        if(board[x+i][y+i] == symbol)
			        count++;
		        else
			        count = 0;
                    
                if(count==4)
			        return true;
	        }

	        return false;
        };

        function dMatch2(x,y){
	        var count = 0;
            var x2 = x;    
                
		    x = x+y;
            if(x>5) {x=5;}
	        y = y-(5-x2);
            if(y<0) {y=0;}


	        for(var i=0; i<7; i++)
	        {
		        if(x-i<0 || y+i>6)
			        return false;

		        if(board[x-i][y+i] == symbol)
		        	count++;
		        else
		        	count = 0;
                    
                if(count==4)
			        return true;
	        }

	        return false;
        };
        
		function checkWin(x, y) {
			if(num >=42)
			{
				sinusbot.chatChannel("[B][COLOR=#1e7f39]It's a draw![/COLOR][/B]");
				return true;
			}
            
			if(!(hMatch(x) || vMatch(y) || dMatch1(x,y) || dMatch2(x,y)))
				return false;
				
			if (turn == playerOneId)
				sinusbot.chatChannel("[B][COLOR=#1e7f39]" + playerOneNick + " wins the Game![/COLOR][/B]");
			else
				sinusbot.chatChannel("[B][COLOR=#1e7f39]" + playerTwoNick + " wins the Game![/COLOR][/B]");
				
			return true;
		};
		
		function playGame(ev, y) {
			if (playing)
			{
				if (turn == ev.clientUid)
				{     
                    var x = placeMark(y-1)
					if(x == -1)
						return;
					
					num++
					if(checkWin(x, y-1))
						resetGame();
					else
					{
						if (turn == playerOneId)
						{
							turn = playerTwoId;
							symbol = 1;
							sinusbot.chatChannel("[B][COLOR=#1e7f39]" + playerTwoNick + " is next![/COLOR][/B]");
						}
						else
						{
							turn = playerOneId;
							symbol = 0;
							sinusbot.chatChannel("[B][COLOR=#1e7f39]" + playerOneNick + " is next![/COLOR][/B]");
						}
					}
					
				}
				else
					sinusbot.chatChannel("[B][COLOR=#1e7f39]It's not your turn![/COLOR][/B]");
			}
			else 
				sinusbot.chatChannel("[B][COLOR=#1e7f39]There is no game running![/COLOR][/B]");
		};
		
		function createGame() {
			if (playing)
			{
				sinusbot.chatChannel("[B][COLOR=#1e7f39]Game already running![/COLOR][/B]");
				return;
			}
			
			playing = true;
			joinable = true;
			sinusbot.chatChannel("[B][COLOR=#1e7f39]Game created! Use '!c4 join' to join![/COLOR][/B]");
		};	
		
		function joinGame(ev) {
			if (playing)
			{
				if (joinable)
				{
                    joined++;
                    if(joined==1)
                    {
					    playerOneId = ev.clientUid;
					    playerOneNick = ev.clientNick;
                        sinusbot.chatChannel("[B][COLOR=#1e7f39]" + playerOneNick + " joined the game! One more is needed![/COLOR][/B]");
                    }
                    else
                    {
					    joinable = false;
                        playerTwoId = ev.clientUid;
                        playerTwoNick = ev.clientNick;
                        
                        sinusbot.chatChannel("[B][COLOR=#1e7f39]" + playerTwoNick + " joined the game![/COLOR][/B]");
					    sinusbot.chatChannel("[B][COLOR=#1e7f39]Game is startig now! Randomly choosing who starts![/COLOR][/B]");
					
					    printBoard();
					
					    if (Math.floor(Math.random()*2) == 0)
					    {
						    turn = playerOneId;
						    symbol = 0;
					    	sinusbot.chatChannel("[B][COLOR=#1e7f39]" + playerOneNick + " starts![/COLOR][/B]");
					    }
					    else
					    {
					    	turn = playerTwoId;
					    	symbol = 1;
					    	sinusbot.chatChannel("[B][COLOR=#1e7f39]" + playerTwoNick + " starts![/COLOR][/B]");
					    }
										
					    sinusbot.chatChannel("[B][COLOR=#1e7f39]Write '!c4 place y' to make your turn![/COLOR][/B]");
                    }  
				}
				else
					sinusbot.chatChannel("[B][COLOR=#1e7f39]It's not possible to join the game at this time![/COLOR][/B]");
			}
			else
				sinusbot.chatChannel("[B][COLOR=#1e7f39]There is no game running![/COLOR][/B]");
		};
		
		function printBoard() {
            var msg = spacer;    
            
            inactive = 0;
            
			for(var i=0; i<6; i++)
            {
                for(var j=0; j<7; j++)
                {
                    switch(board[i][j])
                    {
                        case 9:
                            msg = msg + "   " + spacer;
                            break;
                        case 0:
                            msg = msg + playerOneColor + spacer;
                            break;
                        case 1:
                            msg = msg + playerTwoColor + spacer;
                            break;
                    }
                    
                }
                sinusbot.chatChannel(msg);
                msg = spacer;                
            }
            sinusbot.chatChannel("[COLOR=#0000ff]|1 |2 |3 |4 |5 |6 |7 |[/COLOR]");
		};

		
		sinusbot.on('chat', function(ev) {
			var parts = ev.msg.split(" ");
			var cmd = parts.shift() + " " + parts.shift();
			
    		switch (cmd)
			{					
				case "!c4 create":
					if (uids.indexOf(ev.clientUid) < 0) 
						sinusbot.chatPrivate(ev.clientId, "You have no permission to use this command!");
					else
						createGame();
					break;
					
				case "!c4 join":
					joinGame(ev);
					break;
					
				case "!c4 place":
					if (parts.length < 1)
						sinusbot.chatChannel("[B][COLOR=#1e7f39]You entered something wrong! Usage: !c4 place y[/COLOR][/B]");
					else
						playGame(ev, parts.shift());
					break;
						
				case "!c4 close":
					if (uids.indexOf(ev.clientUid) < 0) 
						sinusbot.chatPrivate(ev.clientId, "You have no permission to use this command!");
					else
					{
                        if(playing)
                        {
                            resetGame();
						    sinusbot.chatChannel("[B][COLOR=#1e7f39]Closing the Game![/COLOR][/B]");
                        }
                        else
                            sinusbot.chatChannel("[B][COLOR=#1e7f39]There is no game running![/COLOR][/B]");
                    }
					break;
			}
		});
});