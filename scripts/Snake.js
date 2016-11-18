registerPlugin({
 name: 'Snake',
 version: '0.9.1',
 description: 'This Plugin let you play Snake in the Client Chat! Just for fun :)',
 author: 'Multivitamin <david@multivitamin.ovh>',
    vars: [
        {
            name: 'snakeMoveAction',
            title: 'How should the Snake switch its direction?',
            type: 'select',
            options: [
                'Keyboard',
                'Channel Join'
            ]
        },
        {
            name: 'keyUp',
            indent: 1,
            title: 'Keyboard Input to tell snake to go UP',
            type: 'string',
            conditions: [
                { field: 'snakeMoveAction', value: 0 }
            ]
        },
        {
            name: 'keyRight',
            indent: 1,
            title: 'Keyboard Input to tell snake to go RIGHT',
            type: 'string',
            conditions: [
                { field: 'snakeMoveAction', value: 0 }
            ]
        },
        {
            name: 'keyDown',
            indent: 1,
            title: 'Keyboard Input to tell snake to go DOWN',
            type: 'string',
            conditions: [
                { field: 'snakeMoveAction', value: 0 }
            ]
        },
        {
            name: 'keyLeft',
            indent: 1,
            title: 'Keyboard Input to tell snake to go LEFT',
            type: 'string',
            conditions: [
                { field: 'snakeMoveAction', value: 0 }
            ]
        },
        {
            name: 'channelUp',
            indent: 1,
            title: 'Channel to join to tell snake to go UP',
            type: 'channel',
            conditions: [
                { field: 'snakeMoveAction', value: 1}
            ]
        },
        {
            name: 'channelRight',
            indent: 1,
            title: 'Channel to join to tell snake to go RIGHT',
            type: 'channel',
            conditions: [
                { field: 'snakeMoveAction', value: 1}
            ]
        },
        {
            name: 'channelDown',
            indent: 1,
            title: 'Channel to join to tell snake to go DOWN',
            type: 'channel',
            conditions: [
                { field: 'snakeMoveAction', value: 1}
            ]
        },
        {
            name: 'channelLeft',
            indent: 1,
            title: 'Channel to join to tell snake to go LEFT',
            type: 'channel',
            conditions: [
                { field: 'snakeMoveAction', value: 1}
            ]
        },
        {
            name: 'reporting0',
            title: 'Snake Game Reporting Channel',
            type: 'channel'
        },
        {
            name: 'reporting1',
            title: 'Snake Game Reporting Channel',
            type: 'channel'
        },
        {
            name: 'reporting2',
            title: 'Snake Game Reporting Channel',
            type: 'channel'
        },
        {
            name: 'tick',
            title: 'How fast should Snake go? Number in Milliseconds!',
            type: 'number'
        },
        {
            name: 'height',
            title: 'Height of Play Ground',
            type: 'number'
        },
        {
            name: 'width',
            title: 'Width of Play Ground',
            type: 'number'
        }
    ]
}, function(sinusbot, config) {
    
    if (config.snakeMoveAction == 1) {
        var reportingChannels = [
            parseInt(config.channelUp),
            parseInt(config.channelRight),
            parseInt(config.channelDown),
            parseInt(config.channelLeft)
        ];
    } else {
        var reportingChannels = [];
    }
    if (config.reporting0 !== undefined) reportingChannels.push(parseInt(config.reporting0));
    if (config.reporting1 !== undefined) reportingChannels.push(parseInt(config.reporting1));
    if (config.reporting2 !== undefined) reportingChannels.push(parseInt(config.reporting1));

    if (config.snakeMoveAction == 0) {
        var keyBoard = [
            config.keyUp.charAt(0),
            config.keyRight.charAt(0),
            config.keyDown.charAt(0),
            config.keyLeft.charAt(0),
        ];
    }

    var newSnakeBlock = false;
    var direction = 1; //0 TOP | 1 RIGHT | 2 DOWN | 3 LEFT
    var directionLock = 1;

    var clock;
    var clientCheck = 0;

    var display = {
        'void': '─',
        'snakehead': '[color=red]█[/color]',
        'snakebody': '[color=orange]█[/color]',
        'food': '[color=green][b]O[/b][/color]'
    }

    if (config.height == undefined) {
        var height = 10;
    } else {
        var height = config.height;
    }

    if (config.width == undefined) {
        var width = 20;
    } else {
        var width = config.width;
    }

    var running = false;
    var score = 0;
    var gameOver = false;
    
    var foodpos = {
        'w': 0,
        'h': 0
    };

    var board = [];
    for (var w = 0; w <= width; w++) {
        board[w] = [];
        for (var h = 0; h <= height; h++) {
            board[w][h] = {
                'type': 'void',
                'prev_w': 0,
                'prev_h': 0,
                'last': false
            };
        }
    }
    board[0][Math.floor(height/2)].type = 'snakehead';
    var snakehead = {
        'w': 0,
        'h': Math.floor(height/2)
    };

    sinusbot.on('clientMove', function (ev) {
        if (config.snakeMoveAction == 0) return;
        if (ev.newChannel == config.channelUp) switchDirection(0);
        if (ev.newChannel == config.channelRight) switchDirection(1);
        if (ev.newChannel == config.channelDown) switchDirection(2);
        if (ev.newChannel == config.channelLeft) switchDirection(3);
    });

    sinusbot.on('chat', function (ev) {
        if (ev.clientId == sinusbot.getBotId()) return;
        sinusbot.log(reportingChannels);
        sinusbot.log(ev);
        try {
            if (ev.msg == '!snake') {
                if (reportingChannels.indexOf(parseInt(ev.channel)) === -1) {
                    sinusbot.chatPrivate(ev.clientId, 'You need to be in one of the Reporting Channels in Order to start Snake!');
                    return;
                }
                if (running) {
                    sinusbot.chatPrivate(ev.clientId, 'Snake is already Running!');
                } else if (!clientPlaying()) {
                    sinusbot.chatPrivate(ev.clientId, 'No one is in one of the Channels for the Snake Game!');
                } else {
                    sendMsg('Snake will start in 10 Seconds!');
                    reinit();
                }
            } else if (
                reportingChannels.indexOf(parseInt(ev.channel)) !== -1
                && config.snakeMoveAction == 0 
                && keyBoard.indexOf(ev.msg.match('(['+keyBoard.join('|')+']){1}[^'+keyBoard.join('')+']{0,}$')[1]) !== -1
            ) {
                switchDirection(keyBoard.indexOf(ev.msg.match('(['+keyBoard.join('|')+']){1}[^'+keyBoard.join('')+']{0,}$')[1]));
            }
        } catch(err) {

        }
    });

    function reinit() {
        score = 0;
        running = true;
        for (var w = 0; w <= width; w++) {
            board[w] = [];
            for (var h = 0; h <= height; h++) {
                board[w][h] = {
                    'type': 'void',
                    'prev_w': 0,
                    'prev_h': 0,
                    'last': false
                };
            }
        }
        board[0][Math.floor(height/2)].type = 'snakehead';
        snakehead = {
            'w': 0,
            'h': Math.floor(height/2)
        };
        clock = setTimeout(init, 10000);
    }


    function init() {
        getNewFoodPos();
        gameOver = false;
        clearInterval(clock);
        if (config.tick == undefined) {
            clock = setInterval(runSnake, 1000);
        } else {
            clock = setInterval(runSnake, config.tick);
        }
        running = true;
    }

    function switchDirection(dir) {
        sinusbot.log('New Direction Command: '+dir);
        sinusbot.log('Direction Lock on: '+directionLock);
        if (dir == 0 && directionLock != 2) direction = 0;
        if (dir == 1 && directionLock != 3) direction = 1;
        if (dir == 2 && directionLock != 0) direction = 2;
        if (dir == 3 && directionLock != 1) direction = 3;

        sinusbot.log('New Direction is: '+direction);
    }

    function runSnake() {
        doStep();
        if (!gameOver) sendMsg(drawField());
        if (clientCheck > 10) {
            if (!clientPlaying()) {
                clearInterval(clock);
                running = false;
            }
            clientCheck = 0;
        }
        clientCheck += 1;
    }

    function sendMsg(msg) {
        var channels = sinusbot.getChannels();
        for (var i = 0; i < channels.length; i++) {
            if (reportingChannels.indexOf(channels[i]['id']) == -1 || !channels[i].clients) continue;
            for (var key in channels[i]['clients']) {
                sinusbot.chatPrivate(channels[i]['clients'][key]['id'], msg);
            }
        }
    }

    function doStep() {
        switch (direction) {
            case 0:     //UP
                if (snakehead.h <= 0) {
                    moveSnake(snakehead.w, height);
                } else {
                    moveSnake(snakehead.w, snakehead.h - 1);
                }
                break;
            case 1:     //RIGHT
                if (width > snakehead.w) {
                    moveSnake(snakehead.w + 1, snakehead.h);
                } else {
                    moveSnake(0, snakehead.h);
                }
                break;
            case 2:     //DOWN
                if (height > snakehead.h) {
                    moveSnake(snakehead.w, snakehead.h + 1);
                } else {
                    moveSnake(snakehead.w, 0);
                }
                break;
            case 3:     //LEFT
                if (snakehead.w <= 0) {
                    moveSnake(width, snakehead.h);
                } else {
                    moveSnake(snakehead.w - 1, snakehead.h);
                }
                break;
        }
        if (snakehead.w == foodpos.w && snakehead.h == foodpos.h) {
            getNewFoodPos();
            newSnakeBlock = true;
            score += 10;
        }
        directionLock = direction;
    }

    function moveSnake(newX, newY) {
        if (board[newX][newY].type == 'snakebody' && !board[newX][newY].last) {
            deadSnake();
            return;
        }
        temp = clone(board[snakehead.w][snakehead.h]);
        moveBlock(snakehead.w, snakehead.h, newX, newY);
        moveBody(temp.prev_w, temp.prev_h, snakehead.w, snakehead.h);
        snakehead.w = newX;
        snakehead.h = newY;
        board[newX][newY].type = 'snakehead';
    }

    function moveBody(x, y, newX, newY) {
        move = clone(board[x][y]);
        if (board[x][y].type == 'snakebody' && !board[x][y].last) {
            moveBlock(x, y, newX, newY);
        } else if (board[x][y].type == 'snakebody' && newSnakeBlock && board[x][y].last) {
            moveBlock(x, y, newX, newY);
            board[newX][newY].last = false;
        } else if (board[x][y].type == 'snakebody' && !newSnakeBlock && board[x][y].last) { 
            moveBlock(x, y, newX, newY);
            return;
        } else if (board[x][y].type == 'void' && newSnakeBlock) {       
            board[newX][newY].type = 'snakebody';
            board[newX][newY].last = true;
            board[newX][newY].prev_w = -1;
            board[newX][newY].prev_h = -1;
            newSnakeBlock = false;
            return;
        } else {
            return;
        }
        moveBody(move.prev_w, move.prev_h, x, y);
    }

    function moveBlock(oldX, oldY, newX, newY) {
        board[newX][newY] = clone(board[oldX][oldY]);
        board[newX][newY].prev_w = oldX;
        board[newX][newY].prev_h = oldY;
        setVoid(oldX, oldY);
    }

    function setVoid(x,y) {
        board[x][y] = {
            'type': 'void',
            'prev_w': 0,
            'prev_h': 0,
            'last': false
        }
    }

    function deadSnake() {
        gameOver = true;
        clearInterval(clock);
        sendMsg('\nYou are [b]dead[/b]!\nScore:'+score+'\nGet Ready! New Game Starts in 10 Seconds!');
        reinit();
    }

    function drawField() {
        var field = "\nScore: "+score+"\n";
        for (var h = 0; h <= height; h++) {
            for (var w = 0; w <= width; w++) {
                field = field + display[board[w][h].type];
            }
            field = field +"\n";
        }
        return field;
    }

    function getNewFoodPos() {
        foodpos.w = getRandomInt(0, width);
        foodpos.h = getRandomInt(0, height);
        if (board[foodpos.w][foodpos.h].type == 'void') {
            board[foodpos.w][foodpos.h].type = 'food';
        } else {
            getNewFoodPos();
        }
    }

    function clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function clientPlaying() {
        var channels = sinusbot.getChannels();
        for (var i = 0; i < channels.length; i++) {
            if (
                reportingChannels.indexOf(channels[i].id) !== -1 
                && channels[i].clients.length > 0
            ) return true; 
        }
        return false;
    }
});