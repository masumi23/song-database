var SongProperty = React.createClass({
  render: function() {
    var editable = this.props.editable;

    if (!this.props.value) {
      return <div />;
    }

    return (
      <div>
        <span className="song-property-name">{this.props.name}</span>
        <span className="song-property-divider">: </span>
        <span className="song-property-value" contentEditable={editable}>{this.props.value}</span>
      </div>
    );
  }
});

var Song = React.createClass({
  getInitialState: function() {
    return {editable: false};
  },
  render: function() {
    var currentSong = this.props.currentSong;

    if (!currentSong) {
      return (<div/>);
    }

    var toggleEditMode = function() {
      this.setState({editable: !this.state.editable});
    }.bind(this);

    return (
      <div>
        <button onClick={toggleEditMode}>{this.state.editable ? 'Editing' : 'Click to Edit'}</button>
        <h4>{currentSong.title}</h4>
        <h5>{currentSong.alternateTitles}</h5>
        <h5>analysis</h5>
        <SongProperty name={"gradeFloor"} value={currentSong.gradeFloor} editable={this.state.editable}/>
        <SongProperty name={"gradeCeil"} value={currentSong.gradeCeil} editable={this.state.editable}/>
        <SongProperty name={"toneSet"} value={currentSong.toneSet} editable={this.state.editable}/>
        <SongProperty name={"range"} value={currentSong.range} editable={this.state.editable}/>
        <SongProperty name={"startingPitch"} value={currentSong.startingPitch} editable={this.state.editable}/>
        <SongProperty name={"scale"} value={currentSong.scale} editable={this.state.editable}/>
        <SongProperty name={"formAnalysis"} value={currentSong.formAnalysis} editable={this.state.editable}/>
        <SongProperty name={"rhythmSet"} value={currentSong.rhythmSet} editable={this.state.editable}/>
        <SongProperty name={"tonalCenter"} value={currentSong.tonalCenter} editable={this.state.editable}/>
        <SongProperty name={"formType"} value={currentSong.formType} editable={this.state.editable}/>
        <h5>Other information</h5>
        <SongProperty name={"informantPerformer"} value={currentSong.informantPerformer} editable={this.state.editable}/>
        <SongProperty name={"origin"} value={currentSong.origin} editable={this.state.editable}/>
        <SongProperty name={"region"} value={currentSong.region} editable={this.state.editable}/>
        <SongProperty name={"songTypes"} value={currentSong.songTypes} editable={this.state.editable}/>
        <SongProperty name={"source"} value={currentSong.source} editable={this.state.editable}/>
        <SongProperty name={"state"} value={currentSong.state} editable={this.state.editable}/>
        <SongProperty name={"subSubject"} value={currentSong.subSubject} editable={this.state.editable}/>
        <SongProperty name={"subjects"} value={currentSong.subjects} editable={this.state.editable}/>
      </div>
    )
  }
});

// Make the change to Firebase, not this.state.items
// this.firebaseRefs['items'].push({
//   text: this.state.text
// })

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
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {items: [], text: ''};
  },
  componentWillMount: function() {
    this.bindAsArray(new Firebase('https://songdatabase.firebaseio.com/songList/'), 'items')
    // this.firebaseRef = new Firebase("https://songdatabase.firebaseio.com/songList/");
    // this.firebaseRef.on("child_added", function(dataSnapshot) {
    //   this.state.items.push(dataSnapshot.val());
    //   this.setState({
    //     items: this.state.items
    //   });
    // }.bind(this));
  },
  componentWillUnmount: function() {
    this.firebaseRef.off();
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
        <Song currentSong={currentSong} firebaseRefs={this.firebaseRefs} />
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

