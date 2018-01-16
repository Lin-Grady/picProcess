export var picProcess = {
        /**
         * [description]
         * @param  {[type]} e          [description]
         * @param  {[type]} nSelector  [原始圖片選擇器]
         * @param  {[type]} oSselector [修改圖片選擇器]
         * @return {[type]}            [description]
         */
        selectFileImage: function(e, settings, callback) {
                var fReader = new FileReader(),
                        formData = new FormData(),
                        file = e.target.files[0],
                        defaults = {
                                minSize: 40 * 1024,
                                maxSize: 10 * 1024 * 1024,
                                reg: /image\/\w+/,
                                width: 600,
                                maxLen: null, //最大长度范围,会覆盖设定高宽
                                encoderOptions: 0.8 //压缩质量
                        },
                        settings = picProcess.extend(defaults, settings),
                        filtration = picProcess.filtration(file, settings);
                // console.log('file:', file,filtration);

                formData.append('file', file);
                //限制大小格式
                if (!filtration) {
                        return false;
                } else if (Object.prototype.toString.call(filtration) === "[object Object]") {
                        settings.callback && settings.callback({formData: formData})
                        return false;
                }

                //轉碼完成
                fReader.onload = function(e) {
                        //加載圖片
                        var img = new Image();
                        img.src = e.target.result;
                        img.onload = function(e) {
                                var imgInfo = e.path[0],
                                        nSize = picProcess.resetSize(this, imgInfo.width, imgInfo.height, settings),
                                        dataURI = picProcess.changeDataURI.call(this, file.type, nSize.width, nSize.height, settings.encoderOptions);
                                img.src = null;
                                settings.callback && settings.callback({dataURI: dataURI})
                        }
                }

                //執行
                fReader.readAsDataURL(file);
        },

        /**
         * [簡單過濾]
         * @param  {[type]} file     [上傳文件]
         * @param  {[type]} settings [判斷條件]
         * @return {[type]}          [是否符合]
         */
        filtration: function(file, settings) {
                if (file.size > settings.maxSize || !settings.reg.test(file.type)) {
                        alert(settings.msg || ('上传格式非图片类型或上传图片超过' + settings.maxSize / 1024 / 1024 + 'M'))
                        return false;
                } else if (file.size < settings.minSize) {
                        return {};
                }
                return true;
        },

        /**
         * [轉base64格式]
         * @param  {[type]} orientation [圖片類型]
         * @param  {[type]} orientation [拍攝方向]
         * @return {[type]}             [DataURI]
         */
        changeDataURI: function(type, width, height, encoderOptions) {
                var canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d');

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(this, 0, 0, width, height);
                //图片展示的 data URI
                return canvas.toDataURL(type, encoderOptions);
        },

        /**
         * [description]
         * @param  {[type]} img    [圖片]
         * @param  {[type]} width  [description]
         * @param  {[type]} height [description]
         * @param  {[type]} ratio  [比例]
         * @param  {[type]} max    [最大範圍]
         * @return {[type]}        [寬高]
         */
        resetSize: function(img, width, height, settings) {
                //前提是，必须在图片完全下载到客户端浏览器才能判断，
                var resizeWidth = 0,
                        resizeHeight = 0,
                        max = settings.maxLen;
                // console.log('原始寬高: ', width, height);

                if (!max) {
                        resizeWidth = settings.width;
                        resizeHeight = settings.height || Math.ceil(resizeWidth * height / width);
                } else {
                        //限制最大值範圍
                        if (width > max && width >= height) {
                                resizeWidth = max;
                                resizeHeight = Math.ceil(resizeWidth * height / width);
                        } else if (height > max && height >= width) {
                                resizeHeight = max;
                                resizeWidth = Math.ceil(width * resizeHeight / height);
                        }
                }

                // console.log('重設寬高: ', resizeWidth, resizeHeight);
                return {width: resizeWidth, height: resizeHeight}
        },

        /**
         * [合并对象]
         * @param  {[type]} defaults [被覆盖对象]
         * @param  {[type]} source   [覆盖对象]
         * @return {[type]}          [description]
         */
        extend: function(defaults, source) {
                for (var i in source) {
                        defaults[i] = source[i]
                }
                return defaults;
        }
}
