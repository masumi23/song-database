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
    return { editable: false };
  },
  render: function() {
    var currentSong = this.props.currentSong;

    if (!currentSong) {
      return (<div/>);
    }

    var toggleEditMode = function() {
      this.setState({editable: !this.state.editable});
    }.bind(this);

    var createItem = function(data) {
      return (
        <SongProperty
          name={data.name}
          value={data.value}
          fbCurrentSongRef={this.props.fbCurrentSongRef}
          editable={this.state.editable} />
      )
    }.bind(this);

    var analysisProperties = [
      { name: 'gradeFloor', value: currentSong.gradeFloor },
      { name: 'gradeCeil', value: currentSong.gradeCeil },
      { name: 'toneSet', value: currentSong.toneSet },
      { name: 'range', value: currentSong.range },
      { name: 'startingPitch', value: currentSong.startingPitch },
      { name: 'scale', value: currentSong.scale },
      { name: 'formAnalysis', value: currentSong.formAnalysis },
      { name: 'rhythmSet', value: currentSong.rhythmSet },
      { name: 'tonalCenter', value: currentSong.tonalCenter },
      { name: 'formType', value: currentSong.formType },
    ];

    var otherProperties = [
      { name: 'informantPerformer', value: currentSong.informantPerformer },
      { name: 'origin', value: currentSong.origin },
      { name: 'region', value: currentSong.region },
      { name: 'songTypes', value: currentSong.songTypes },
      { name: 'source', value: currentSong.source },
      { name: 'state', value: currentSong.state },
      { name: 'subSubject', value: currentSong.subSubject },
      { name: 'subjects', value: currentSong.subjects },
    ];

    return (
      <div>
        <button onClick={toggleEditMode}>{this.state.editable ? 'Editing' : 'Click to Edit'}</button>
        <h4>{currentSong.title}</h4>
        <h5>{currentSong.alternateTitles}</h5>
        <h5>analysis</h5>
        {analysisProperties.map(createItem)}

        <h5>Other information</h5>
        {otherProperties.map(createItem)}
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
    //TODO: should we use Firebase instead, or is it kosher cause of the 1-way binding?
    var currentSong = _.find(this.state.items, function(song){
      return (song.id+'') === currentSongID;
    }.bind(this));

    return (
      <div>
        <Song currentSong={currentSong} fbCurrentSongRef={this.firebaseRefs.items.child(currentSongID)} />
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

