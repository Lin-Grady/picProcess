picProcess
==========

當前項目僅為練手項目,有很多不足地方和隱藏問題,建議只做參考

功能清单
--------

一、获取用户照片数据* 获取用户摄像头圖片,不是所有手機支持,並且部分手機會有旋轉角度的問題；* Input控件获取照片文件。

二、编辑合成照片* 使用canvas编辑壓縮,重設尺寸比例；* 轉成base64輸出預覽。

目前已知BUG/不足
----------------

-	輸出格式不支持gif
-	旋轉角度僅支持(0,90,180,270)
-	初始化沒有提供過濾條件和回調函數
-	輸出格式都是base64,需要後台支持

快速上手
--------

在页面中加载脚本：
```javascript
<script src="./js/exif.js"></script>
<script src="./js/picProcess.js" charset="utf-8"></script>
```


初始化时可以传入配置：
----------------------

-	nSelector: 處理后圖片展示元素(目前僅支持'#xx'和'.xx'格式)
-	oSselector: 上傳圖片展示元素(目前僅支持'#xx'和'.xx'格式)
-	width: 圖片寬度
-	height: 圖片高度
-	ratio: 圖片比例
-	max: 圖片最大值範圍
-	orientation: 圖片旋拍攝方向,(配合exif.js,1: 0°; 3: 180°; 6: 90°; 8: 270°; )

```javascript
var upload = new SelectFileImage(); 
xx.addEventListener('change', function(e) { upload.start(e); });
```

切記,每次選擇配置之後都必須重新實例化



_picProcess.js快速上手
--------
js文件夾裡面還有一個_picProcess.js是不需要的,那是我剛開始用的對象方法來寫,picProcess.js是用構造函數封裝的,兩者都能用,只是調用方法不同,而且这里移除了检测旋转功能,新增自动判断是否压缩,按比例缩小

初始化时默认配置：
----------------------
minSize: 40 * 1024,
maxSize: 10 * 1024 * 1024,
reg: /image\/\w+/,
width: 600,
maxLen: null, //最大长度范围,会覆盖设定高宽
encoderOptions: 0.8 //压缩质量
