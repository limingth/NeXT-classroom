Demo说明
==============

chrome-extension文件夹是Chrome插件的源码，test-page文件夹用于测试插件的实际运行情况  

## 测试方法
1. 在Chrome浏览器的扩展程序页面（chrome://extensions/）选中“开发者模式”单选框
2. 单击“加载正在开发的扩展程序”按钮，选择chrome-extension文件夹
3. 配置本地http与https服务器，将test-page中的文件放入指定html目录下，使其可以访问（注意：Linux中应授予.js可读权限）  
    3.1 Mac OS X中配置Apache http://www.cnblogs.com/snandy/archive/2012/11/13/2765381.html  
    3.2 Apache配置https连接 http://www.linuxidc.com/Linux/2012-03/55609.htm
4. 在Chrome中访问上述文件地址，比如 https://localhost/test/index.html，若遇到https证书不安全警告，请选择允许网站继续显示（！！注意：Chrome插件目前只拥有访问 "https://localhost/*", "https://maodou.io/*", "https://166.111.131.12/*" 的权限，因此需要在上述domain中进行测试）
5. 在index.html页面中输入要录制视频的宽度与高度，点击recordMedia按钮，弹出录屏对话框，选择一个窗口或是整个桌面进行录制  
    5.1. 若此时提示getUserMedia错误，请关注Chrome地址栏的最右侧，像摄像机一样的那个小图标，是否有红色的叉：如有，请点击该图标，并选择允许网页使用默认麦克风设备，然后重新加载插件和网页，返回步骤4；否则，应该是bug，请向我提供反馈
6. 录制过程中请不要关闭index.html页面，录制一段时间后，点击stopRecordMedia按钮，页面中将会生成两个超级链接，一个是WebM格式的视频文件，一个是Wav格式的音频文件；如没有显示下载链接，应该是bug，请向我提供反馈


## 说明
* 目前测试Chrome版本37.0.2062.103 m，在Windows与Linux系统中都正常
* 录制视频的帧数与视频的分辨率有关，在我的笔记本上录制1600×900的视频时大约为3.5fps，800×600时大约为9fps，在Linux下帧数高于Windows中


## 待解决的问题
* 高清分辨率时帧数比较低，与录屏使用的webp格式编码速度有关，换jpeg后好很多
* 目前看来，Chrome还不支持同时录制音频与桌面，需要找一个合并音视频文件的编码器
* 还未进行过长时间录制的测试，预计会遇到Chrome占用内存太多的情况，需要解决本地存储的问题
