var mywidth = document.getElementById("mywidth");
var myheight = document.getElementById("myheight");
var btn_record = document.getElementById("record");
var btn_stop = document.getElementById("stop");
var video_link = document.getElementById("download_video");
var audio_link = document.getElementById("download_audio");

function init() {
	if (chrome.extension.getBackgroundPage().isSharing()) {
		mywidth.value = chrome.extension.getBackgroundPage().getVideoWidth();
		myheight.value = chrome.extension.getBackgroundPage().getVideoHeight();
		btn_record.disable = true;
		btn_stop.disable = false;
		video_link.style.display = 'none';
		video_link.href = "#";
	} 
	else {
		btn_record.disable = false;
		btn_stop.disable = true;
		if (chrome.extension.getBackgroundPage().getVideoUrl()) {
			video_link.style.display = '';
			video_link.href = chrome.extension.getBackgroundPage().getVideoUrl();
		}
		if (chrome.extension.getBackgroundPage().getAudioUrl()) {
			audio_link.style.display = '';
			audio_link.href = chrome.extension.getBackgroundPage().getAudioUrl();
		}
	}
};

btn_record.onclick = function() {
	var width = mywidth.value || 640;
	var height = myheight.value || 480;
	if (width > 0 && width <= 1920*4 && height > 0 && height < 1080*4) {
		chrome.extension.getBackgroundPage().record(width, height);
		btn_record.disable = true;
		btn_stop.disable = false;
	}
	else {
		console.log("invalid width/height parameter");
		mywidth.value = 'error';
	}
};

btn_stop.onclick = function() {
	chrome.extension.getBackgroundPage().stop();
	video_link.style.display = '';
	video_link.href = chrome.extension.getBackgroundPage().getVideoUrl();
	audio_link.style.display = '';
	audio_link.href = chrome.extension.getBackgroundPage().getAudioUrl();
	btn_record.disable = false;
	btn_stop.disable = true;
};

init();
