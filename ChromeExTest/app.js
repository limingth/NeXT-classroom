navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

var video = document.getElementById("video");
var canvas = document.createElement("canvas");
var context;
var lastTime = 0;
var sharing = false;
var whammyVideo = new Whammy.Video();
var vwidth = 640, vheight = 480;

function onSuccessCallback(stream) {			
	//window.stream = stream;
	video.src = window.URL.createObjectURL(stream);
	video.width = vwidth;
	video.height = vheight;
	canvas.width = video.clientWidth;
	canvas.height = video.clientHeight;
	context = canvas.getContext("2d");
	nextFrame();
}

function onErrorCallback(error) {
	alert('getUserMedia error!');
}

function share(width, height) {
	console.log("share");
	if (sharing) return;
	sharing = true;
	vwidth = width;
	vheight = height;
	chrome.desktopCapture.chooseDesktopMedia(["screen", "window"], onAccessApproved);
	//onAccessApproved(-1);
}

function onAccessApproved(id) {
	if (!id) {
		console.log("Access rejected.");
		return;
	}
	
	var screenConstraints = {
		audio: false,
		video: {
			mandatory: { 
				chromeMediaSource: 'screen', //desktop
				//chromeMediaSourceId: id,
				maxWidth: vwidth,
				maxHeight: vheight
				//minAspectRatio: 1.77,
				//maxAspectRatio: 1.78
			},
			optional: [
				{ 
					minFrameRate: 30
				}
			]
		}
	};
	
	navigator.getUserMedia(screenConstraints, onSuccessCallback, onErrorCallback);
}

function stop() {
	console.log("stop");
	sharing = false;
	var output = whammyVideo.compile();
	whammyVideo.frams = [];
	return webkitURL.createObjectURL(output);
}

function nextFrame() {
	if (!sharing) return;
	var nowTime = new Date().getTime();
	if (lastTime === 0) {
		lastTime = nowTime - 1;
	}
	var duration = nowTime - lastTime;
	lastTime = nowTime;
	context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
	whammyVideo.add(canvas, duration);
	setTimeout(nextFrame, 1);
}