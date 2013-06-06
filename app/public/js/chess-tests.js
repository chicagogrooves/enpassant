describe("Positions Vectors and Sides, oh my", function(){
  it("are indexed a1-h8", function(){
    var p = new Position('a1');
    expect(p.file).toEqual('a');
    expect(p.rank).toEqual('1');
    expect(p.fileidx).toEqual( 0 );
    expect(p.rankidx).toEqual( 0 );
    expect(p.toString()).toEqual('a1');

    var p = new Position('h8');
    expect(p.file).toEqual('h');
    expect(p.rank).toEqual('8');
    expect(p.fileidx).toEqual( 7 );
    expect(p.rankidx).toEqual( 7 );
    expect(p.toString()).toEqual('h8');
  });
  it("Can be created from indices", function(){
    var p = new Position(null,null,0,0);
    expect(p.file).toEqual('a');
    expect(p.rank).toEqual('1');
    expect(p.fileidx).toEqual( 0 );
    expect(p.rankidx).toEqual( 0 );
    expect(p.toString()).toEqual('a1');

    var p = new Position(null,null,7,7);
    expect(p.file).toEqual('h');
    expect(p.rank).toEqual('8');
    expect(p.fileidx).toEqual( 7 );
    expect(p.rankidx).toEqual( 7 );
    expect(p.toString()).toEqual('h8');
  })
  
  it("calls the vector from d2 to d4 [0,2]", function(){
    var d2 = new Position('d2'), d4 = new Position('d4');
    expect(d4.minus(d2)).toEqual([0,2]);
  });
  it("Asserts that d2 + [0,2] is d4", function(){
    var d2 = new Position('d2'), d4 = new Position('d4');
    expect(d2.plus([0,2])).toEqual( d4 );
  });
  it("Asserts that d2 + [1,1] is e3", function(){
    var d2 = new Position('d2'), e3 = new Position('e3');
    expect(d2.plus([1,1])).toEqual( e3 );
  });
  it("Asserts that a8 is colored white (aka 'white on right' rule)", function(){
    var a8 = new Position('a8');
    var a1 = new Position('a1');
    expect(a8.color()).toEqual('white');
    expect(a1.color()).toEqual('black');
  });
  it("Asserts that black is the opposite of white", function(){
    expect('white'.opposite()).toEqual('black');
    expect('black'.opposite()).toEqual('white');
  });
});

describe("The Board", function(){
  it("calls the advance direction of white [0,1]", function(){
    expect(Board.advanceVector('white')).toEqual([0,1]);
  });
  it("calls the advance direction of black [0,-1]", function(){
    expect(Board.advanceVector('black')).toEqual([0, -1]);
  });
  it("has a configurable size, set to 8 for chess", function(){
    expect(Board.xSize).toEqual(8);
    expect(Board.ySize).toEqual(8);
  });
  it("detects invalid positions", function(){
    expect(Board.validPosition('a1')).toEqual(true);
    expect(Board.validPosition('d2')).toEqual(true);
    expect(Board.validPosition('h8')).toEqual(true);

    expect(Board.validPosition('B8')).toEqual(false);
    expect(Board.validPosition('a9')).toEqual(false);
    expect(Board.validPosition('Q11')).toEqual(false);
    expect(Board.validPosition('')).toEqual(false);
    expect(Board.validPosition(null)).toEqual(false);
    expect(Board.validPosition(undefined)).toEqual(false);
  });

  it("knows either black or white is next to move", function(){
    var b = new Board();
    expect(b.turnToMove('white')).toEqual(true);
  });
  
  it("knows whether white/black king/queenside castling is available", function(){
    var b = new Board();
    //initially true, until a move makes it so (to be implemented later, just a field now)
    expect(b.castleAvailableWhiteKing).toEqual(true);
    expect(b.castleAvailableWhiteQueen).toEqual(true);
    expect(b.castleAvailableBlackKing).toEqual(true);
    expect(b.castleAvailableBlackQueen).toEqual(true);
    //can change any of them
    b.castleAvailableWhiteKing = false;
    expect( b.castleAvailableWhiteKing ).toEqual(false);
  });
  it("has or does not have an enpassant square", function(){
    var b = new Board();
    expect(b.enPassantSquare).toBeUndefined();
    b.enPassantSquare = 'e4';
    expect(b.enPassantSquare).toEqual('e4');
  });
  it("can be initialized with an index-piece map", function(){
    var r = new Rook('white');
    var b = new Board({a1: r});
    expect(b.a1).toEqual(r)
  });
  it("can return the position of a piece on it", function(){
    var r = new Rook('white');
    var b = new Board({a1: r});
    var p = b.indexOf(r);
    expect(p.toString()).toEqual('a1');
    expect(b.indexOf(new Rook('black'))).toBeUndefined();
  });
  it("can return the keys in whites rendering order", function(){
    var b = new Board();
    var keys = b.keysFromSide('white');
    expect(keys).toEqual([
      'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
      'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
      'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
      'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
      'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
      'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
      'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
      'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1' ]);
  });
  it("can return the keys in blacks rendering order", function(){
    var b = new Board();
    var keys = b.keysFromSide('black');
    expect(keys).toEqual([
      'h1', 'g1', 'f1', 'e1', 'd1', 'c1', 'b1', 'a1',
      'h2', 'g2', 'f2', 'e2', 'd2', 'c2', 'b2', 'a2',
      'h3', 'g3', 'f3', 'e3', 'd3', 'c3', 'b3', 'a3',
      'h4', 'g4', 'f4', 'e4', 'd4', 'c4', 'b4', 'a4',
      'h5', 'g5', 'f5', 'e5', 'd5', 'c5', 'b5', 'a5',
      'h6', 'g6', 'f6', 'e6', 'd6', 'c6', 'b6', 'a6',
      'h7', 'g7', 'f7', 'e7', 'd7', 'c7', 'b7', 'a7',
      'h8', 'g8', 'f8', 'e8', 'd8', 'c8', 'b8', 'a8' ]);
  });
});

describe("Pieces - Any", function(){
  it("has a side", function(){
    var p = new Piece();
    p.side = 'white';
    expect(p.side).toEqual('white');
  });
});

describe("Pieces - Rook", function(){
  it("has a side", function(){
    var r = new Rook('white');
    expect(r.side).toEqual('white');
  });
  it("has the liberties [+/-1, 0], [0, +-1]", function(){
    var r = new Rook();
    expect(r.liberties).toEqual( [[1,0],[-1,0],[0,1],[0,-1]] );
  });
  it("has the board length as its maximum move length", function(){
    var r = new Rook();
    expect(r.maxMoveLength).toEqual(Board.xSize);
  });
});

describe("Pieces - Pawn", function(){
  it("has a side", function(){
    var p = new Pawn('white');
    expect(p.side).toEqual('white');
  });
  it("can advance by 1 in 3 directions (the ChessJudge later refines this)", function(){
    var p = new Pawn('white');
    expect(p.liberties).toEqual([[ -1, 1 ], [ 0, 1 ], [ 1, 1 ]] );
    var p = new Pawn('black');
    expect(p.liberties).toEqual([[ -1, -1 ], [ 0, -1 ], [ 1, -1 ]]);
    expect(p.maxMoveLength).toEqual(1);
  });
});    

describe("The Chess Judge", function(){
  it("has a ruleset", function(){
    //todo
  });
  
  it("knows a piece's open moves on an open board", function(){
    var r = new Rook();
    var b = new Board({a1: r});
    var j = new ChessJudge();

    var moves = j.openMoves(r, b);
    expect(moves).toEqual([ 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8' ]);
  });
  
  it("subtracts occupied extrema from the open moves list", function(){
    var r = new Rook();
    var b = new Board({a1: r, a8: new Rook()});
    var j = new ChessJudge();

    var moves = j.openMoves(r, b);
    expect(moves).toEqual([ 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7']);
  });
  
  it("subtracts occupied, and positions beyond them from the open moves list", function(){
    var r = new Rook();
    var b = new Board({a1: r, a3: new Rook()});
    var j = new ChessJudge();

    var moves = j.openMoves(r, b);
    expect(moves).toEqual([ 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', 'a2']);
  });

  it("implements same-color blocking", function(){
    var r = new Rook('white');
    var b = new Board({a1: r, a7: new Rook('white')});
    var j = new ChessJudge();

    var moves = j.unblockedMoves(r, b);
    expect(moves).toEqual([ 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', 'a2', 'a3', 'a4', 'a5', 'a6']);
  });

  it("allows opposite-color capture", function(){
    var r = new Rook('white');
    var b = new Board({a1: r, a7: new Rook('black')});
    var j = new ChessJudge();

    var moves = j.unblockedMoves(r, b);
    expect(moves).toEqual([ 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7']);
  });
  
  it("denies a pawn forward-capture (he must move off his file to capture)", function(){
    var pw = new Pawn('white');
    var pb = new Pawn('black');
    var b = new Board({
      d2: pw,
      d3: pb
    });
    var j = new ChessJudge();

    var moves = j.unblockedMoves(pw, b);
    expect(moves).toEqual([]);
  });

  it("allows a pawn its forward-diagonal capture", function(){
    var pw = new Pawn('white');
    var pb = new Pawn('black');
    var b = new Board({
      d2: pw,
      e3: pb
    });
    var j = new ChessJudge();

    var moves = j.unblockedMoves(pw, b);
    expect(moves).toEqual(['d3', 'e3']);
  });
  
  it("denies a pawn a diagonal move (unless capturing)", function(){
    var pw = new Pawn('white');
    var b = new Board({
      d2: pw
    });
    var j = new ChessJudge();

    var moves = j.unblockedMoves(pw, b);
    expect(moves).toEqual(['d3']);
  });
});

/*
   Board state
     - See FEN - the following fields define the complete state of a game, for resume purposes
     - Pieces positions, who to move, castling avail w/b k/q, ep target, 1/2 move clock, 1 move clock
     
   Liberties 
     - piece.liberties(board): those moves a piece is capable of regardless of game state
       - board.positionOf(piece) must be defined
       - passing board allows answer to be relative to a forward direction / the boards edges
     - example: for a pawn, only the three forward single-steps are liberties
     
   Blocking/Capturing rules
     - piece.blocked?(board, from, to)
     - eg. a piece's 'to' is blocked by its own color, can capture if the other color
     - except a pawn, whose diagonal liberties are 'blocked' by emptiness also, and whose forward liberty is blocked by anything
     - intervening pieces of any color matter, except for knights whose crooked liberties define no intervening pieces
     
   Special cases
     - for a pawn, moving double is an option if on its home rank, but it must set EP on the board
     - 
*/

/*
  describe("", function(){
    it("", function(){
      expect(hugPanda()).toEqual("");
    });
  });
*/  

describe("Space Kitty", function(){
  it("meows, of course", function(){
    expect( spaceKitty()).toEqual("meow!");
  });
});

