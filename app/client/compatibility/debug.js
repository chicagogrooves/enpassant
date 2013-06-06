Debug = {
  make_test_board: function(){
    $('.chess-board').append( 
      new BoardRenderer(
        new Board(
          {
            a8: new Rook('black'),
            b8: new Knight('black'),
            c8: new Bishop('black'),
            d8: new Queen('black'),
            e8: new King('black'),
            f8: new Bishop('black'),
            g8: new Knight('black'),
            h8: new Rook('black'),
            a7: new Pawn('black'),
            b7: new Pawn('black'),
            c7: new Pawn('black'),
            d7: new Pawn('black'),
            e7: new Pawn('black'),
            f7: new Pawn('black'),
            g7: new Pawn('black'),
            h7: new Pawn('black'),
            a2: new Pawn('white'),
            b2: new Pawn('white'),
            c2: new Pawn('white'),
            d2: new Pawn('white'),
            e2: new Pawn('white'),
            f2: new Pawn('white'),
            g2: new Pawn('white'),
            h2: new Pawn('white'),
            a1: new Rook('white'),
            b1: new Knight('white'),
            c1: new Bishop('white'),
            d1: new Queen('white'),
            e1: new King('white'),
            f1: new Bishop('white'),
            g1: new Knight('white'),
            h1: new Rook('white')
          })).render() );
  }
};
