import * as WaveformPlaylist from 'waveform-playlist'

var playlist
var ee

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
      width: 200 //width of controls in pixels
    },
    zoomLevels: [1360]
  });
  ee = playlist.getEventEmitter();
}

function load() {

  // TODO: clear playlist
  // playlist.tracks = []

  // Route to wav files:
  // "{track_id}_{estimate_name}_{target_name}.wav"
  playlist.load([
    {
      "src": "media/audio/1_GRA2_vocals.wav",
      "name": "vocals", // should be {target_name}
      "muted": true,
      "soloed": true,
    },
    {
      "src": "/media/audio/1_GRA2_accompaniment.wav",
      "name": "Accompaniment",
      "muted": true,
    }
  ]);
}

export default { init, load }
