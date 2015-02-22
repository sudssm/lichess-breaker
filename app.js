var Browser = require("zombie");
var Chess = require("chess.js");
var fs = require('fs');

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 16; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

browser = new Browser()
browser.visit("http://en.lichess.org/signup", function () {

  var board = browser.query(".mini_board")
  var fen = board.getAttribute('data-fen')
  var toPlay = board.getAttribute('data-color')[0]
  fen = fen + " " + toPlay + " - - 0 1"

  var chess = new Chess.Chess(fen);

  var moves = JSON.parse(board.getAttribute('data-moves'))

  var keys = Object.keys(moves)

  var solved = false;
  for (var i = 0; i < keys.length; i++){
    var from = keys[i]
    var options = moves[from].match(/.{1,2}/g);
    for (var j = 0; !solved && j < options.length; j++){
	var to = options[j]
	chess.move({from: from, to: to})
	if (chess.in_checkmate()){
	    solved = true;
	    var user = makeid()
	    browser.fill("username", user).
            fill("password", "pwned").
	    fill("move", from + " " + to).
            pressButton("Register", function(){
	      console.log("success!")
	      fs.appendFile("users.txt", user + "\n", function(){
		  process.exit()
	      })
	    })
	}
	else {
	    chess.undo();
	}

    }
  }

  if (!solved){
      console.log("failed")
      process.exit()
  }
  
});
