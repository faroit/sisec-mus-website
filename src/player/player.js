import * as WaveformPlaylist from 'waveform-playlist'
import headers from '../headers.js'

var Player = function() {
  this.playlist = WaveformPlaylist.init({
    samplesPerPixel: 1260,
    waveHeight: 80,
    container: document.getElementById("playlist"),
    timescale: true,
    mono: true,
    exclSolo: true,
    state: 'cursor',
    colors: {
      waveOutlineColor: '#F0F0F0'
    },
    controls: {
      show: true, //whether or not to include the track controls
      width: 160 //width of controls in pixels
    },
    zoomLevels: [1260]
  });
}

Player.prototype.loadTargets = function(trackurls) {
  this.playlist.getEventEmitter().emit('stop')
  this.playlist.tracks = []
  var tracksToLoad = []
  for (let track of trackurls) {
    tracksToLoad.push(
      {
        "src": '/media/SISEC/' + track.file,
        "name": track.name,
        "muted": track.mute,
        "customClass": track.customClass,
        "soloed": track.solo,
      }
    );
  }
  this.playlist.load(tracksToLoad);
}

export default Player
