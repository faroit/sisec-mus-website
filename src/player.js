import * as WaveformPlaylist from 'waveform-playlist'
import headers from './heatmap/headers.js'

var playlist

function init() {
  playlist = WaveformPlaylist.init({
    samplesPerPixel: 1360,
    waveHeight: 100,
    container: document.getElementById("playlist"),
    timescale: true,
    mono: true,
    state: 'cursor',
    colors: {
      waveOutlineColor: '#E0EFF1'
    },
    controls: {
      show: true, //whether or not to include the track controls
      width: 140 //width of controls in pixels
    },
    zoomLevels: [1360]
  });
}

function loadTargets(trackid, method) {

  // Route to wav files:
  // "{track_id}_Reference_{target_name}.wav"

  playlist.getEventEmitter().emit('stop')
  playlist.tracks = []
  var tracksToLoad = []
  for (let target of headers.targets) {
    tracksToLoad.push(
      {
        "src": "/media/" + trackid + '_' + method + '_' + target + '.wav',
        "name": target, // should be {target_name}
        "muted": false,
        "soloed": false,
      }
    );
  }
  playlist.load(tracksToLoad);
}

export { init, loadTargets, playlist }
