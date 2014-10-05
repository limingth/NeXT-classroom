window.MediaStream =
	window.MediaStream ||
	window.webkitMediaStream;

window.URL =
    window.URL ||
    window.webkitURL ||
    window.mozURL ||
    window.msURL;

window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame;

window.cancelAnimationFrame =
    window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    window.oCancelAnimationFrame;

navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
	
var audioContext = new AudioContext;
var audioRecorder;
var audio_url;
var audio_stream;
	
function recordAudio() {
	console.log("recordAudio");
	var audioConstraints = { audio: true };
	navigator.getUserMedia(audioConstraints, _onAudioSuccessCallback, _onErrorCallback);
}

function stopRecordAudio(callback) {
	console.log("stopRecordAudio");
    audioRecorder.stop();
	audioRecorder.exportWAV(function(blob) {
        audio_url = URL.createObjectURL(blob);
		audio_stream.stop();
		callback(audio_url);
    });
}

function _onAudioSuccessCallback(stream) {
	console.log("getUserMedia ok.");
	audio_stream = stream;
	var audioInput = audioContext.createMediaStreamSource(stream);
	audioInput.connect(audioContext.destination);
	audioRecorder = new Recorder(audioInput);
	audioRecorder.clear();
    audioRecorder.record();
}

function _onErrorCallback(error) {
	console.log("getUserMedia error. " + error)
	alert('getUserMedia error!');
}
