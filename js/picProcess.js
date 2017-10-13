/**
 * [description]
 * @param  {[type]} nSelector  [原始圖片選擇器]
 * @param  {[type]} oSselector [修改圖片選擇器]
 * @return {[type]}            [description]
 */
function SelectFileImage(settings) {
        this.nSelector = settings.nSelector;
        this.oSselector = settings.oSselector;
        this.width = settings.width;
        this.height = settings.height;
        this.ratio = settings.ratio;
        this.max = settings.max;
        this.orientation = settings.orientation;
        console.log(this);
}

//運行
SelectFileImage.prototype.start = function(e) {
        var self = this;

        self.file = e.target.files[0];
        self.fReader = new FileReader();
        console.log('file:', self.file);

        //限制大小格式
        if (!self.filtration()) {
                return false;
        }

        //获取照片方向角属性，用户旋转控制
        EXIF.getData(self.file, function() {
                if (!self.orientation)
                        self.orientation = EXIF.getTag(this, 'Orientation');
                console.log('旋转角度: ', self.orientation);
        });

        //轉碼完成
        self.fReader.onload = function(e) {
                //加載圖片
                var img = new Image();
                img.src = e.target.result;
                self.preview(self.oSselector, e.target.result)
                img.onload = function() {
                        // console.log('data: URL格式: ', this);
                        self.imgData = this;
                        var url = self.changeDataURI();
                        self.preview(self.nSelector, url)
                }
        }

        //執行
        self.fReader.readAsDataURL(self.file);
}

/**
 * [簡單過濾]
 * @param  {[type]} settings [判斷條件]
 * @return {[type]}          [是否符合]
 */
SelectFileImage.prototype.filtration = function(extend) {
        var extend = extend || {},
                settings = {
                        size: extend.size || 5 * 1024 * 1024,
                        reg: extend.reg || /image\/\w+/
                };

        if (this.file.size > settings.size || !settings.reg.test(this.file.type)) {
                alert(extend.msg || ('上传格式非图片类型或上传图片超过' + settings.size / 1024 / 1024 + 'M'))
                return false;
        }
        return true;
}

//旋轉尺寸重繪
SelectFileImage.prototype.changeDataURI = function() {
        var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d'),
                nSize = this.resetSize(this.width || 600, this.height || 400, this.ratio, this.max);

        switch (+ this.orientation) {
                case 3:
                        canvas.width = nSize.width;
                        canvas.height = nSize.height;
                        ctx.rotate(180 * Math.PI / 180);
                        ctx.drawImage(this.imgData, -nSize.width, -nSize.height, nSize.width, nSize.height);
                        break;
                case 6:
                        canvas.width = nSize.height;
                        canvas.height = nSize.width;
                        ctx.rotate(90 * Math.PI / 180);
                        ctx.drawImage(this.imgData, 0, -nSize.height, nSize.width, nSize.height);
                        break;
                case 8:
                        canvas.width = nSize.height;
                        canvas.height = nSize.width;
                        ctx.rotate(270 * Math.PI / 180);
                        ctx.drawImage(this.imgData, -nSize.width, 0, nSize.width, nSize.height);
                        break;
                default:
                        canvas.width = nSize.width;
                        canvas.height = nSize.height;
                        ctx.drawImage(this.imgData, 0, 0, nSize.width, nSize.height);
                        break;
        }
        //图片展示的 data URI
        return canvas.toDataURL(this.file.type, 0.8);
}

/**
 * [description]
 * @param  {[type]} width  [description]
 * @param  {[type]} height [description]
 * @param  {[type]} ratio  [比例]
 * @param  {[type]} max    [最大範圍]
 * @return {[type]}        [寬高]
 */
SelectFileImage.prototype.resetSize = function(width, height, ratio, max) {
        //前提是，必须在图片完全下载到客户端浏览器才能判断，
        var w = this.imgData.naturalWidth,
                h = this.imgData.naturalHeight,
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
}

/**
 * [預覽圖]
 * @param  {[type]} selector [只簡單支持id和class]
 * @param  {[type]} url      [圖片地址]
 * @return {[type]}          [description]
 */
SelectFileImage.prototype.preview = function(selector, url) {
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
