// ---- mic.js ----
navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
	
window.AudioContext =
    window.AudioContext ||
    window.webkitAudioContext;
	
window.MediaStream =
	window.MediaStream ||
	window.webkitMediaStream;

window.URL =
    window.URL ||
    window.webkitURL ||
    window.mozURL ||
    window.msURL;
	
var audioContext = new AudioContext;
var audioRecorder;
var audio_url, video_url;
var audio_stream;
var ex_id = "xxxxxxxxxxxxxxxxxxxxxxxxxx";
var record_btn, stop_btn;

function init() {
	record_btn = document.getElementById("recordMedia");
	stop_btn = document.getElementById("stopRecordMedia");
	if (record_btn)  record_btn.onclick = recordMedia;
	if (stop_btn) stop_btn.onclick = stopRecordMedia;
}
	
function recordMedia() {
	console.log("recordMedia");
	record_btn.disable = true;
	stop_btn.disable = false;
	var vwidth = document.getElementById("mywidth").value || 1024;
	var vheight = document.getElementById("myheight").value || 768;
	chrome.runtime.sendMessage("", "start|" + vwidth + "|" + vheight, {}, startResponse);
}

function stopRecordMedia() {
	console.log("stopRecordMedia");
	record_btn.disable = false;
	stop_btn.disable = true;
    audioRecorder.stop();
	audioRecorder.exportWAV(function(blob) {
        audio_url = URL.createObjectURL(blob);
		chrome.runtime.sendMessage("", audio_url, {}, stopResponse);
    });
}

function startResponse(response) {
	if (response) {
		var audioConstraints = { audio: true };
		navigator.getUserMedia(audioConstraints, _onAudioSuccessCallback, _onErrorCallback);
	}
}

function _onAudioSuccessCallback(stream) {
	console.log("_onAudioSuccessCallback");
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

function stopResponse(response) {
	console.log("stopResponse");
	audio_stream.stop();
	video_url = response;
	
	var video_link = document.getElementById("download_video");
	var audio_link = document.getElementById("download_audio");
	
    audio_link.href = audio_url;
    audio_link.download = 'audio.wav';
	audio_link.style.display = '';
	
    video_link.href = video_url;
    video_link.download = 'video.webm';
	video_link.style.display = '';
}

init();
