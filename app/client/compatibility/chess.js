  /* a shout-out to spaceKitty */
  window.spaceKitty = function(){ return "meow!"; };

  /* begin chess code */
  function Position(file,rank, fileidx,rankidx){
    if(fileidx >= 0 && rankidx >= 0){
        this.fileidx = fileidx;
        this.rankidx = rankidx;
        this.file = String.fromCharCode(fileidx + 97);
        this.rank = (rankidx+1).toString();
        return;
    }
    
    if(!rank){
      if(!file || file.length != 2) return null;
      this.file = file.substr(0,1);
      this.rank = file.substr(1,1);
    }
    
    this.fileidx = this.file.charCodeAt(0) - 97;
    this.rankidx = this.rank - 1;
  };
  Position.prototype.initialize = function(fileidx, rankidx){
    this.fileidx = fileidx;
    this.rankidx = rankidx;
    this.file = String.fromCharCode(fileidx + 97);
    this.rank = rankidx+1+"";
    
    return this;
  }
  Position.prototype.toString = function(){
    return this.file + this.rank;
  }
  Position.prototype.minus = function(other){
    return [this.fileidx-other.fileidx, this.rankidx-other.rankidx];
  }
  Position.prototype.plus = function(filerank_vector){
    var newpos = new Position('a1'); //ignored
    return newpos.initialize(this.fileidx + filerank_vector[0], this.rankidx + filerank_vector[1]);
  }
  Position.prototype.color = function(){
    return ((this.fileidx+this.rankidx) % 2 == 0 ) ? 'black' : 'white';
  }
  
  //see FEN
  function Board(pieceMap){ 
    this.nextToMove = 'white';
    this.castleAvailableWhiteKing = true;
    this.castleAvailableWhiteQueen = true;
    this.castleAvailableBlackKing = true;
    this.castleAvailableBlackQueen = true;
    
    this.lastMoveFrom = undefined;
    this.lastMoveTo = undefined;

    for(key in pieceMap){
      this[key] = pieceMap[key];
    }
  }
  
  Board.newChessBoard = function(){
    return new Board(
      {
        a8: new Rook('black'),
        b8: new Knight('black'),
        c8: new Bishop('black'),
        d8: new Queen('black'),
        e8: new King('black'),
        f8: new Bishop('black'),
        g8: new Knight('black'),
        h8: new Rook('black'), 
        a7: new Pawn('black'), b7: new Pawn('black'), c7: new Pawn('black'), d7: new Pawn('black'),
        e7: new Pawn('black'), f7: new Pawn('black'), g7: new Pawn('black'), h7: new Pawn('black'),
        a2: new Pawn('white'), b2: new Pawn('white'), c2: new Pawn('white'), d2: new Pawn('white'),
        e2: new Pawn('white'), f2: new Pawn('white'), g2: new Pawn('white'), h2: new Pawn('white'),
        a1: new Rook('white'),
        b1: new Knight('white'),
        c1: new Bishop('white'),
        d1: new Queen('white'),
        e1: new King('white'),
        f1: new Bishop('white'),
        g1: new Knight('white'),
        h1: new Rook('white')
      })
  }
  
  Board.xSize = 8;
  Board.ySize = 8;

  Board.validPosition = function(pos){
    p = new Position(pos);
    return p.fileidx >= 0 && p.fileidx < this.xSize &&
           p.rankidx >= 0 && p.rankidx < this.ySize ;
  }
  
  Board.advanceVector = function(side){
    if(side.indexOf('w') > -1)
      return [0,1];
    else
      return [0,-1];
  }

  //expects array of objects with from/to fields
  Board.fromMoves = function(moves){
    var newboard = Board.newChessBoard();
    
    var latest = newboard;
    _.each(moves, function(m){
      latest = latest.playMove(m);
    });
    
    return latest; //TODO would be useful to return interim states as well
  }
  
  Board.prototype.playMove = function(move){
    var newboard = _.clone(this);
    
    var p = newboard[move.from];
    delete newboard[move.from];
    newboard[move.to] = p;
    
    newboard.lastMoveFrom = move.from;
    newboard.lastMoveTo = move.to;
    
    return newboard;
  }
  
  Board.prototype.turnToMove = function(side){
    return (side==this.nextToMove);
  }
  
  Board.prototype.indexOf = function(p){
    for(var key in this){
      if(this[key]==p)
        return new Position(key);
    }        
    return undefined;
  }
  
  Board.prototype.keysFromSide = function(side){
    var ranks = (side=='white') ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7];
    var files = (side=='white') ? [0,1,2,3,4,5,6,7] : [7,6,5,4,3,2,1,0];
    var keys = [];
    for(var r=0; r<ranks.length; r++)
      for(var f=0; f<files.length; f++)
        keys.push(new Position(null,null,files[f],ranks[r]).toString());
    return keys;
  }
  
  function Piece(side){
    this.side = side;
    this.maxMoveLength = 1;
    this.isBlockedAlong = function(vector, blocker){
      return blocker && (blocker.side == this.side);
    }
  }
  
  function SlidingPiece(){
    this.maxMoveLength = Board.xSize;
  }
  
  function King(side){
    this.side = side;
    this.role = 'king';
  }
  function Queen(side){
    this.side = side;
    this.role = 'queen';
  }
  function Rook(side){
    this.side = side;
    this.role = 'rook';
    this.liberties = [[1,0],[-1,0],[0,1],[0,-1]];
  }
  function Bishop(side){
    this.side = side;
    this.role = 'bishop';
    this.liberties = [[1,1],[1,-1],[-1,1],[-1,-1]];
  }
  function Knight(side){
    this.side = side;
    this.role = 'knight';
    this.liberties = [[2,1],[2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
  }

  function Pawn(side){
    var fwd = Board.advanceVector(side)[1];
    
    this.side = side;
    this.role = 'pawn';
    this.liberties = [ [-1,fwd], [0,fwd], [1,fwd] ];

    // a pawn is blocked by:
    //   - in the reverse direction, anything
    //   - in the forward non-diagonal, any piece
    //   - in the forward diagonal, emptiness or his own piece
    this.isBlockedAlong = function(vector, blocker){
      var advancing = (vector[1] / Math.abs(vector[1]))==fwd;
      if(!advancing) return true;
      if(vector[0]==0)
        return !!blocker;
      else
        return !blocker || blocker.side==this.side;
    }
  }
  
  SlidingPiece.prototype = new Piece();

  Queen.prototype = new SlidingPiece();
  Rook.prototype = new SlidingPiece();
  Bishop.prototype = new SlidingPiece();
  
  King.prototype = new Piece();
  Knight.prototype = new Piece();
  Pawn.prototype = new Piece();
  
  function MoveJudge(ruleset){
    this.ruleset = ruleset;
  }
  
  function ChessJudge(){
    this.ruleset = [
      {one: 'two'}
    ]
  }
  
  ChessJudge.prototype = new MoveJudge();
  
  ChessJudge.prototype.openMoves = function(piece, board){
    var pos = board.indexOf(piece);
    var moves = [];
    piece.liberties.forEach(function(line){
      for(i=1; i<=piece.maxMoveLength; i++){
        var newpos = pos.plus(line.times(i)).toString();
        if( board[newpos] ) //occupied
          return;
        if( Board.validPosition(newpos) )
          moves.push( newpos );
      }
    });
    return moves;
  }
  // A subset of the 'openMoves' list, the 'unblockedMoves' list indicates
  // your possible moves, taking into account captures, and blocking of 
  // lines of attack, but not of castling or other exceptional moves. 
  ChessJudge.prototype.unblockedMoves = function(piece, board){
    var moves = []; 

    var pos = board.indexOf(piece);
    piece.liberties.forEach(function(line){
      for(i=1; i<=piece.maxMoveLength; i++){
        var newpos = pos.plus(line.times(i)).toString();
        if( ! Board.validPosition(newpos))
          return;

        var blocker = board[newpos];
        var vector = new Position(newpos).minus(pos);
        if( ! piece.isBlockedAlong(vector, blocker) ){
          moves.push( newpos );
        }
        if(blocker) return;
      }
    });
    return moves;
  }
  
  function PieceRenderer(piece){
    this.render = function(){
      var imgclass = 'img';
      var glyph = this.getGlyph(piece);
      return $("<div/>", {class: ['piece', 'img'].join(' ')})
         .append( $("<a/>", {href: '#'}).append(glyph) );
         
    }
    this.getGlyph = function(piece){
      // '♔' : '♚'  // '♕' : '♛' // '♖' : '♜'
      // '♗' : '♝'  // '♘' : '♞' // '♙' : '♟'
      if(piece.role=='king')
        return piece.side=='white' ? '&#9812;' : '&#9818;';
      if(piece.role=='queen')
        return piece.side=='white' ? '&#9813;' : '&#9819;';
      if(piece.role=='rook')
        return piece.side=='white' ? '&#9814;' : '&#9820;';
      if(piece.role=='bishop')
        return piece.side=='white' ? '&#9815;' : '&#9821;';
      if(piece.role=='knight')
        return piece.side=='white' ? '&#9816;' : '&#9822;';
      if(piece.role=='pawn')
        return piece.side=='white' ? '&#9817;' : '&#9823;';
    }
  }

  function BoardRenderer(board){
    //maybe this will use templates instead of code at one point
    this.render = function(){ 
      var b = board;
      var mover = b.nextToMove;
      var table=$("<table/>", {class:'chess-board'});
      
      keys = board.keysFromSide(mover)
      for(var r=0; r<Board.xSize; r++){
        var row = $("<tr/>");
        for(var f=0; f<Board.xSize; f++ ){
          var pos = keys[r*8+f];
          var sqcolor = (r*8+f) % 2 ? 'sq-w' : 'sq-b';
          var piece = board[pos];
          var classes = ['sq', sqcolor, pos];
          if(pos == board.lastMoveFrom)
            classes.push('last-move-from');
          if(pos == board.lastMoveTo)
            classes.push('last-move-to');
          var sq = $("<td/>", {id: pos, title: pos, class: classes.join(' ')});
          if(piece)
            sq.append( new PieceRenderer(piece).render() );
          else
            sq.append( "&nbsp;" );
          row.append(sq);
        }
        table.append(row);
      }
      return table;
    }
  }

  /* easy but dirty monkey-patches */
  String.prototype.opposite = function(){
    if (this.toString()=='white') return 'black';
    if (this.toString()=='black') return 'white';
    return null;
  }
  Array.prototype.times = function(factor){
    return [this[0]*factor, this[1]*factor];
  }
  /* end chess code */
  
  /* begin a little bit of js hackery */
  function submitNewMove(){
    var g = Games.findOne( Session.get("now-playing-game") );
    var newmove = {
      from: $("#new-move-from").val(),
      to: $("#new-move-to").val(),
      notation: $("#new-move-notation").val()
    }
    Games.update( g._id, {$push: {moves: newmove}});
    return false;
  }
  
  /* end a little bit of js hackery */

