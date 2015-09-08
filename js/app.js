var Song = React.createClass({
  render: function() {
    var currentSong = this.props.currentSong;

    if (!currentSong) {
      return (<div/>);
    }

    return (
      <div>{currentSong.title}</div>
    );
  }
});

var SongListItem = React.createClass({
  render: function() {
    var song = this.props.items;
    return (
      <div>
        <a href={'#' + song.id}>{song.title}</a>
      </div>
    );
  }
});

var SongList = React.createClass({
  render: function() {
    var createItem = function(song, index) {
      return (
        <li key={index + song.id}>
          <SongListItem items={song}/>
        </li>
      );
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});

var SongApp = React.createClass({
  getInitialState: function() {
    return {items: [], text: ''};
  },
  componentWillMount: function() {
    this.firebaseRef = new Firebase("https://songdatabase.firebaseio.com/songList/");
    this.firebaseRef.on("child_added", function(dataSnapshot) {
      this.state.items.push(dataSnapshot.val());
      this.setState({
        items: this.state.items
      });
    }.bind(this));
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var nextItems = this.state.items.concat([this.state.text]);
    var nextText = '';
    this.setState({items: nextItems, text: nextText});
  },
  render: function() {
    var currentSongID = this.props.songID;
    var currentSong = _.find(this.state.items, function(song){
      return (song.id+'') === currentSongID;
    }.bind(this));

    return (
      <div>
        <Song currentSong={currentSong} />
        <h3>Songs</h3>
        <SongList items={this.state.items} />
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChange} value={this.state.text} />
          <button>{'Add #' + (this.state.items.length + 1)}</button>
        </form>
      </div>
    );
  }
});

function render() {
  var route = window.location.hash.substr(1);
  React.render(<SongApp songID={route} />, document.getElementById('container'));
}

window.addEventListener('hashchange', render);
render()

