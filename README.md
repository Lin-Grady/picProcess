# picProcess
當前項目僅為練手項目,有很多不足地方和隱藏問題,建議只做參考




## 功能清单
一、获取用户照片数据
* 获取用户摄像头圖片,不是所有手機支持,並且部分手機會有旋轉角度的問題；
* Input控件获取照片文件。

二、编辑合成照片 
* 使用canvas编辑壓縮,重設尺寸比例；
* 轉成base64輸出預覽。




## 快速上手
在页面中加载脚本：
```javascript
<script src="./js/exif.js"></script>
<script src="./js/picProcess.js" charset="utf-8"></script>
```





## 初始化时可以传入配置：
* nSelector: 處理后圖片展示元素(目前僅支持'#xx'和'.xx'格式)
* oSselector: 上傳圖片展示元素(目前僅支持'#xx'和'.xx'格式)
* width: 圖片寬度
* height: 圖片高度
* ratio: 圖片比例
* max: 圖片最大值範圍
* orientation: 圖片旋拍攝方向,(配合exif.js,1: 0°; 3: 180°; 6: 90°; 8: 270°; )
```javascript
var upload = new SelectFileImage();
xx.addEventListener('change', function(e) {
        upload.start(e);
});

```
