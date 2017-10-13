var picProcess = {
        /**
         * [description]
         * @param  {[type]} e          [description]
         * @param  {[type]} nSelector  [原始圖片選擇器]
         * @param  {[type]} oSselector [修改圖片選擇器]
         * @return {[type]}            [description]
         */
        selectFileImage: function(e, nSelector, oSselector) {
                var file = e.target.files[0],
                        //拍攝方向
                        orientation = null,
                        fReader = new FileReader();
                console.log('file:', file);

                //限制大小格式
                if (!picProcess.filtration(file)) {
                        return false;
                }

                //获取照片方向角属性，用户旋转控制
                EXIF.getData(file, function() {
                        orientation = EXIF.getTag(this, 'Orientation');
                        console.log('旋转角度: ', orientation);
                });

                //轉碼完成
                fReader.onload = function(e) {
                        //加載圖片
                        var img = new Image();
                        img.src = e.target.result;
                        picProcess.preview(oSselector, e.target.result)
                        img.onload = function() {
                                // console.log('data: URL格式: ', this);
                                var url = picProcess.changeDataURI.call(this, file.type, orientation);
                                picProcess.preview(nSelector, url)
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
         * @param  {[type]} orientation [圖片類型]
         * @param  {[type]} orientation [拍攝方向]
         * @return {[type]}             [DataURI]
         */
        changeDataURI: function(type, orientation) {
                var canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d'),
                        nSize = picProcess.resetSize(this, 600, 400);

                switch (+ orientation) {
                        case 3:
                                canvas.width = nSize.width;
                                canvas.height = nSize.height;
                                ctx.rotate(180 * Math.PI / 180);
                                ctx.drawImage(this, -nSize.width, -nSize.height, nSize.width, nSize.height);
                                break;
                        case 6:
                                canvas.width = nSize.height;
                                canvas.height = nSize.width;
                                ctx.rotate(90 * Math.PI / 180);
                                ctx.drawImage(this, 0, -nSize.height, nSize.width, nSize.height);
                                break;
                        case 8:
                                canvas.width = nSize.height;
                                canvas.height = nSize.width;
                                ctx.rotate(270 * Math.PI / 180);
                                ctx.drawImage(this, -nSize.width, 0, nSize.width, nSize.height);
                                break;
                        default:
                                canvas.width = nSize.width;
                                canvas.height = nSize.height;
                                ctx.drawImage(this, 0, 0, nSize.width, nSize.height);
                                break;
                }
                //图片展示的 data URI
                return canvas.toDataURL(type, 0.8);
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
                //前提是，必须在图片完全下载到客户端浏览器才能判断，
                var w = img.naturalWidth,
                        h = img.naturalHeight,
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
