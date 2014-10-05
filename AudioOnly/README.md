说明
==============

## 文件说明

* ```mic.js```,```recorder.js```,```recorderWorker.js```是实现录音必需的脚本文件。
* ```index.html```,```test.js```是功能测试文件，调用方法可参考```test.js```。


## 函数调用

* 在页面中添加对脚本```<script src="mic.js"></script>```和```<script src="recorder.js"></script>```的引用，并保证```recorderWorker.js```与```recorder.js```在同一目录下。
* recordAudio()  
    调用该函数时录音开始。无参数。
* stopRecordAudio(callback)  
    调用该函数时结束录音。参数callback(url)是声音文件生成完成时的回调函数，其中url是录音生成.wav文件的地址。


## 测试结果

* 经测试，该脚本可以录制长度约70分钟的音频，最大占用内存约1.2G，之后Chrome录音的tab会直接崩溃，但不影响其它tabs。
