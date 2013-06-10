TestData = {
  games: [
    {
      name: 'Dean vs Paul (Public)',
      whiteUserName: 'chicagogrooves',
      blackUserName: 'paulfletter',
      public: true,
      moves: [
        {from: 'e2', to: 'e4', notation: 'e4'},
        {from: 'e7', to: 'e5', notation: 'e5'}
      ]
    },
    {
      name: 'Paul vs Dean (Private)',
      whiteUserName: 'paulfletter',
      blackUserName: 'chicagogrooves',
      moves: [
        {from: 'b1', to: 'c3', notation: 'Nc3'},
        {from: 'g8', to: 'f6', notation: 'Nf6'}
      ]
    },
    {
      name: 'Miles vs Vincent (Private)',
      whiteUserName: 'miles',
      blackUserName: 'alytus',
      moves: [
        {from: 'b1', to: 'c3', notation: 'Nc3'},
        {from: 'b8', to: 'c6', notation: 'Nc6'}
      ]
    }
    
  ],
  
  moves: {
    ePawnWhite: {from: 'e2', to: 'e4', notation:'e4'},
    ePawnBlack: {from: 'e7', to: 'e5', notation:'e5'},
    Nc3: {from: 'b1', to: 'c3', notation:'Nc3'}
  },
  
  users: {
    dean: { 
      username: 'chicagogrooves',
      email: 'deanmisc@yahoo.com',
      password: 'bongo1',
      profile : {
        name : 'Dean Radcliffe'
      }
    },
    paul: { //pfunk1
      username: 'paulfletter',
      email: 'paulfletter@gmail.com',
      password: 'pfunk1',
      profile : {
        name : 'Paul Fletter'
      }
    },
    vincent: {
      username: 'alytus',
      email: 'alytus@gmail.com',
      password: 'alytus',
      profile: {
        name: 'Vincent Rozanskas'
      }
    },
    miles: {
      username: 'miles',
      email: 'miles@thegalfers.com',
      password: 'm1les',
      profile: {
        name: 'Miles Galfer'
      }
    }    
  }
}
















