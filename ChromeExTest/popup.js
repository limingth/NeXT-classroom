var mywidth = document.getElementById("mywidth");
var myheight = document.getElementById("myheight");
var record = document.getElementById("record");
var stop = document.getElementById("stop");

record.onclick = function() {
	var width = mywidth.value || 640;
	var height = myheight.value || 480;
	if (width > 0 && width <= 1920*4 && height > 0 && height < 1080*4) {
		chrome.extension.getBackgroundPage().share(width, height);
	}
	else {
		mywidth.value = 'error';
	}
};

stop.onclick = function() {
	var url = chrome.extension.getBackgroundPage().stop();
	document.getElementById('download').style.display = '';
	document.getElementById('download').href = url;
};