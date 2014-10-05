window.onload = function(){
	var start_btn, stop_btn;
	start_btn = document.getElementById("record");
	stop_btn = document.getElementById("stop");
	
	start_btn.disabled = false;
	stop_btn.disabled = true;
	
	start_btn.onclick = function() {
		start_btn.disabled = true;
		stop_btn.disabled = false;
		recordAudio();
	};
	stop_btn.onclick = function() {
		start_btn.disabled = false;
		stop_btn.disabled = true;
		stopRecordAudio(callback);
	};
};

function callback(audio_url){
	var link = document.getElementById("download_audio");
	link.style.display = "";
	link.href = audio_url;
}
