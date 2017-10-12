var picProcess = {
        /**
         * [description]
         * @param  {[type]} e        [上傳對象]
         * @param  {[type]} selector [選擇器]
         * @return {[type]}          [description]
         */
        selectFileImage: function(e, selector, selector2) {
                var file = e.target.files[0],
                        //旋轉角度
                        orientation = null,
                        fReader = new FileReader();

                //限制大小格式
                if (!picProcess.filtration(file)) {
                        return false;
                }

                //获取照片方向角属性，用户旋转控制
                EXIF.getData(file, function() {
                        orientation = EXIF.getTag(this, 'Orientation');
                        console.log('旋转角度: ', orientation);
                        // alert(orientation);
                });

                //轉碼完成
                fReader.onload = function(e) {
                        //加載圖片
                        var img = new Image();
                        img.src = e.target.result;
                        picProcess.preview(selector2, e.target.result)
                        img.onload = function() {
                                // console.log('data: URL格式: ', this);
                                var url = picProcess.changeDataURI.call(this, orientation);
                                picProcess.preview(selector, url)
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
        filtration: function(file, extend) {
                var extend = extend || {},
                        settings = {
                                size: extend.size || 5 * 1024 * 1024,
                                reg: extend.reg || /image\/\w+/
                        };

                if (file.size > settings.size || !settings.reg.test(file.type)) {
                        alert(extend.msg || ('上传格式非图片类型或上传图片超过' + settings.size / 1024 / 1024 + 'M'))
                        return false;
                }
                return true;
        },

        /**
         * [轉base64格式]
         * @param  {[type]} orientation [旋轉角度]
         * @return {[type]}             [DataURI]
         */
        changeDataURI: function(orientation) {
                var canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d'),
                        nSize = picProcess.resetSize(this, 300, 300, 1, 600);

                canvas.width = nSize.width;
                canvas.height = nSize.height;
                ctx.drawImage(this, 0, 0, nSize.width, nSize.height);

                if (orientation && orientation != 1) {
                        rotateImg(this, canvas, orientation);
                }
                console.log(canvas);
                return canvas.toDataURL('image/jpeg', 0.8);
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
        resetSize: function(img, width, height, ratio, max) {
                var w = img.naturalWidth,
                        h = img.naturalHeight,
                        regRatio = /^\d+:\d+$/gi,
                        regMax = /^\d+$/gi,
                        width = width || w,
                        height = height || h;

                console.log('圖片寬高: ', w, h, '入參: ', width, height, ratio, max);

                if (w != width)
                        w = width;
                if (h != height)
                        h = height;
                if (ratio && w / h != ratio)
                        w = h * ratio;

                //限制最大值範圍
                if (max) {
                        if (w > max && w >= h) {
                                h = Math.ceil(h * max / w);
                                w = max;
                        } else if (h > max && h >= w) {
                                w = Math.ceil(w * max / h);
                                h = max;
                        }
                }
                console.log('重設寬高: ', w, h);
                return {width: w, height: h}
        },

        /**
         * [旋轉角度]
         * @param  {[type]} img    []
         * @param  {[type]} canvas []
         * @param  {[type]} rotate [旋轉角度]
         * @return {[type]}        [description]
         */
        rotateImg: function(img, canvas, rotate) {
                var degree = rotate * Math.PI / 180,
                        ctx = canvas.getContext('2d');

                switch (+ rotate) {
                        case 3:
                                ctx.drawImage(img, img.width, -img.height);
                                break;
                        case 6:
                                ctx.drawImage(img, img.height, -img.width);
                                break;
                        case 8:
                                ctx.drawImage(img, -img.height, img.height);
                                break;
                }
        },

        /**
         * [預覽圖]
         * @param  {[type]} selector [只簡單支持id和class]
         * @param  {[type]} url      [圖片地址]
         * @return {[type]}          [description]
         */
        preview: function(selector, url) {
                var isId = /^#\w+/ig.test(selector),
                        isClass = /^\.\w+/ig.test(selector),
                        name = selector.slice(1),
                        dom = null;

                //選擇器類型
                if (isId) {
                        dom = document.getElementById(name);
                } else if (isClass) {
                        dom = document.getElementsByClassName(name)[0];
                } else {
                        alert('選擇器傳參不支持!');
                        return false;
                }

                //判斷類型
                if (dom.nodeName == 'IMG') {
                        dom.src = url;
                } else {
                        dom.style.backgroundImage = 'url(' + url + ')';
                };
        }

}
