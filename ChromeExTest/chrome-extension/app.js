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
	
var video = document.getElementById("video");
var canvas = document.createElement("canvas");
var context;
var lastTime = 0;
var sharing = false;
var whammyVideo = new Whammy.Video();
var vwidth = 640, vheight = 480;
var sum_sec = 0;
var video_url, audio_url;
var video_stream;
var recordCallback;

function _init() {
	chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
		if (message.indexOf("start") != -1) {
			//video start
			var pars = message.split("|");
			var width = pars[1];
			var height = pars[2];
			record(width, height);
			recordCallback = sendResponse;
		}
		else {
			//audio stop
			audio_url = message;
			stop();
			sendResponse(video_url);
		}
		return true;
	});
}

function _onVideoSuccessCallback(stream) {
	console.log("_onVideoSuccessCallback");
	sharing = true;
	lastTime = 0;
	video_stream = stream;
	video.src = window.URL.createObjectURL(stream);
	video.width = vwidth;
	video.height = vheight;
	canvas.width = video.clientWidth;
	canvas.height = video.clientHeight;
	context = canvas.getContext("2d");
	sum_sec = 0;
	_nextFrame();
	recordCallback(true);
}

function _onErrorCallback(error) {
	console.log("getUserMedia error. " + error)
	alert('getUserMedia error!');
}

function _onAccessApproved(id) {
	if (!id) {
		console.log("Access rejected or canceled.");
		return;
	}
	
	var videoConstraints = {
		audio: false,
		video: {
			mandatory: { 
				chromeMediaSource: 'desktop',
				chromeMediaSourceId: id,
				maxWidth: vwidth,
				maxHeight: vheight
				//minAspectRatio: 1.77,
				//maxAspectRatio: 1.78
			},
			optional: [
				{ 
					minFrameRate: 5
				}
			]
		}
	};
	
	navigator.getUserMedia(videoConstraints, _onVideoSuccessCallback, _onErrorCallback);
}

function _nextFrame() {
	if (!sharing) return;
	var nowTime = new Date().getTime();
	if (lastTime === 0) {
		lastTime = nowTime - 10; // set first frame's duration 10ms
	}
	var duration = nowTime - lastTime;
	lastTime = nowTime;
	context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
	whammyVideo.add(canvas, duration);
	sum_sec = sum_sec + duration;
	console.log(duration + ", " + sum_sec);
	setTimeout(_nextFrame, 0);
}

function record(width, height) {
	if (sharing) return;
	console.log("share");
	vwidth = width;
	vheight = height;
	chrome.desktopCapture.chooseDesktopMedia(["screen", "window"], _onAccessApproved);
	//_onAccessApproved(-1);
}

function stop() {
	if (!sharing) return;
	console.log("stop");
	sharing = false;
	
	video_stream.stop();
	var output = whammyVideo.compile();
	whammyVideo.frames = [];
	video_url = webkitURL.createObjectURL(output);
}

function isSharing() {
	return sharing;
}

function getVideoWidth() {
	return video.clientWidth;
}

function getVideoHeight() {
	return video.clientHeight;
}

function getVideoUrl() {
	return video_url;
}

function getAudioUrl() {
	return audio_url;
}

 _init();