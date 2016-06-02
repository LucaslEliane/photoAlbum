(function(window){
	'use strict';

	/**
	 * 构造方法
	 * @constructor
     */
	function LucasAlbum() {
		this.LAYOUT = {
			PUZZLE    :   1,
			WATERFALL :   2,
			BARREL    :   3
		};
		this.init();
	}

	var usageLayout,
		imgArray = [],
		imgSize = [],
		imgRatio = [],
		width,
		contentElement,
		imageCount,
		layout,
		columnCount = 5,
		overlay,
		previewImage,
		previewDiv;

	LucasAlbum.prototype.init = function() {
		this.getAlbumElement();
		this.createOverlay();
		this.getLayout();
	};

	/**
	 * 公有方法，初始化构建相册，只返回相册的DOM对象
	 * @returns {HTML Element} 相册DIV元素的HTML Element
     */
	LucasAlbum.prototype.getAlbumElement = function() {
		var tmp,
			ratio;
		if (document.getElementsByClassName) {
			if (document.getElementsByClassName('lucas-album')[0]) {
				contentElement = document.getElementsByClassName('lucas-album')[0];
				width = parseInt(window.getComputedStyle(contentElement,null).width);
			}
		}
		if (document.querySelectorAll) {
			if (document.querySelectorAll('.lucas-album img').length !== 0) {
				tmp = document.querySelectorAll('.lucas-album img');
			}
		}
		for (var i = 0; i < tmp.length; i++) {
			imgArray[i] = tmp[i].getAttribute('src');
			imgSize[i] = {
				height: window.getComputedStyle(tmp[i],null).height,
				width :window.getComputedStyle(tmp[i],null).width
			};
			ratio = parseInt(imgSize[i].width)/parseInt(imgSize[i].height);
			imgRatio[i] = {
				id: i,
				ratio: parseFloat(ratio.toFixed(3))
			};

			contentElement.removeChild(tmp[i]);
		}
		layout = this.LAYOUT[contentElement.getAttribute('category')];
		imageCount = imgArray.length;
		return contentElement;
	};
	/**
	 * 公有方法，返回当前正在使用的布局方式对象
	 * @returns {Object}
     */
	LucasAlbum.prototype.getLayout = function () {
		if (usageLayout) {
			return usageLayout;
		} else {
			switch (layout) {
				case 1:
					usageLayout = new Puzzle(this,imageCount);
					usageLayout.init();
					break;
				case 2:
					usageLayout = new Waterfall(this,columnCount);
					usageLayout.init();
					break;
				case 3:
					usageLayout = new Barrel(this,width,4);
					usageLayout.init();
					break;
				default:
					usageLayout = new Waterfall(this,columnCount);
					usageLayout.init();
					break;
			}
		}
	};
	LucasAlbum.prototype.addImage = function(image) {
		usageLayout.addImage(image);
	};
	/**
	 * 公有方法，为某个元素添加一个类
	 * @param element 需要添加类的dom元素
	 * @param value	需要添加的类名
	 * @return {HTML Element} 添加完类名的DOM元素
     */
	LucasAlbum.prototype.addClass = function (element,value) {
		var className,
			newClass = '';
		if (element.getAttribute('class')) {
			className = element.getAttribute('class').split(' ');
			className.forEach(function(index){
				if (index !== value) {
					newClass = newClass + ' ' + index;
				}
			});
			newClass = newClass.trim();
			newClass = newClass + ' ' + value;
			element.setAttribute('class',newClass);
		} else {
			element.setAttribute('class',value);
		}
		return element;
	};
	/**
	 * 公有方法，为某个dom元素删除一个类名
	 * @param element 需要删除类名的dom元素
	 * @param value 删除的类名
	 * @return {HTML Element} 返回删除完类名的DOM元素
     */
	LucasAlbum.prototype.removeClass = function (element,value) {
		var className;
		if (element.getAttribute('class')){
			className = element.getAttribute('class');
			className = className.replace(value,'');
			element.setAttribute('class',className);
		}
		return element;
	};
	/**
	 * 将某个元素插入到父元素的指定位置上
	 * @param parent 父元素
	 * @param child 要插入的子元素
     * @param n	位置下标
	 * @return {HTML Element} 返回插入完的父元素
     */
	LucasAlbum.prototype.insertAt = function (parent, child ,n ) {
		if (n<0 || n>parent.childNodes.length) {
			throw new Error('invalid index');
		} else if (n == parent.childNodes.length) {
			parent.appendChild(child);
		} else {
			parent.insertBefore(child,parent.childNodes[n]);
		}
		return parent;
	};
	/**
	 * 创建遮罩层，并且为遮罩层添加点击事件
	 */
	LucasAlbum.prototype.createOverlay = function() {
		var that = this;
		overlay = document.createElement('div');
		overlay.setAttribute('class','overlay');
		previewDiv = document.createElement('div');
		previewDiv.setAttribute('class','previewImage');
		previewImage = document.createElement('img');
		previewImage.setAttribute('class','imageHidden');
		this.addClass(overlay,'hidden');
		this.addClass(previewDiv,'hidden');
		this.insertAt(document.getElementsByTagName('body')[0],overlay,0);
		this.insertAt(document.getElementsByTagName('body')[0],previewDiv,1);
		previewDiv.appendChild(previewImage);
		previewDiv.addEventListener('click',function () {
			that.removeClass(overlay,'overlayShow');
			that.removeClass(previewDiv,'previewShow');
			that.removeClass(previewImage,'imageShow');
			that.addClass(overlay,'hidden');
			that.addClass(previewDiv,'hidden');
			that.addClass(previewImage,'imageHidden');
		});
	};
	/**
	 * 为每个图片添加点击样式
	 * @param image img的DOM元素
	 */
	LucasAlbum.prototype.addClickEvent = function(image,url) {
		var that = this,
			src;
		if (url) {
			src = url;
		} else {
			src = image.getAttribute('src');
		}
		image.addEventListener('click', function (event) {
			previewImage.setAttribute('src', src);
			that.removeClass(overlay, 'hidden');
			that.removeClass(previewDiv, 'hidden');
			that.removeClass(previewImage, 'imageHidden');
			that.addClass(overlay, 'overlayShow');
			that.addClass(previewDiv, 'previewShow');
			that.addClass(previewImage, 'imageShow');
		});
	};
	/**
	 * 瀑布布局的包装函数
	 * @param external 外部LucasAlbum的this指针
	 * @param columnCount 列数
	 * @constructor
     */
	var Waterfall = function(external,columnCount) {
		var columnHeight = [],
			column = [];



		Waterfall.prototype.init = function () {
			this.imageColumn(columnCount);
			this.initAppendImage();
		};
		/**
		 * 生成相册的列栏元素
		 */
		Waterfall.prototype.imageColumn = function() {
			if (document.createElement) {
				for (var i = 0; i < columnCount; i++) {
					column[i] = document.createElement('ul');
					column[i].setAttribute('class','waterfall waterfall-'+columnCount);
					contentElement.appendChild(column[i]);
				}
			}
		};
		/**
		 * 图片初始化挂载方法
		 */
		Waterfall.prototype.initAppendImage = function() {
			for (var i = 0; i < columnCount; i++) {
				columnHeight[i] = 0;
			}
			var that = this;
			imgArray.forEach(function(value){
				that.appendImage(value);
			});
		};
		/**
		 * 瀑布流挂载辅助函数，计算当前最短的一列
		 * @returns element {DOM对象，最短的一列}
		 */
		Waterfall.prototype.getLowestColumn = function() {
			var min = 999999,
				index;
			for (var i = 0; i < columnCount; i++) {
				columnHeight[i] = column[i].offsetHeight;
			}
			for (var j = 0; j < columnCount; j++) {
				if (columnHeight[j] < min) {
					index = j;
					min = columnHeight[j];
				}
			}
			return index;
		};
		/**
		 * 单个图片挂载，可在另外挂载的时候复用
		 * @param image 图片的路径
		 */
		Waterfall.prototype.appendImage = function(image) {
			var index = this.getLowestColumn(),
				imageElement,
				liElement;
			liElement = document.createElement('li');
			imageElement = document.createElement('img');
			liElement.appendChild(imageElement);
			imageElement.setAttribute('src',image);
			column[index].appendChild(liElement);
			external.addClickEvent(imageElement);
		};
		/**
		 * 图片挂载方法，为用户提供的接口
		 * @param image 图片URL的数组或者是单个URL
         */
		Waterfall.prototype.addImage = function(image) {
			var that = this;
			if (typeof image === 'string') {
				that.appendImage(image);
			} else if (image.length > 1) {
				image.forEach(function (value) {
					that.appendImage(value);
				});
			}
		};
	};
	/**
	 * 木桶布局包装函数
	 * @param external 外部函数的this指针
	 * @param width 整个div的宽度
	 * @param rowsWidth 每行图片的长宽比的上限值
     * @constructor
     */
	var Barrel = function(external,width,rowsWidth) {

		var totalWidth=0,
			rows,
			count,
			rowsArray = [],
			popArray = [];

		/**
		 * 木桶布局的初始化函数
		 */
		Barrel.prototype.init = function () {
			for (var i=0;i<imageCount;i++) {
				totalWidth+=parseFloat(imgRatio[i].ratio);
				popArray[i]=i;
			}
			rows = Math.ceil(totalWidth/rowsWidth);
			this.setRows();
		};
		/**
		 * 设置木桶布局每行元素，构造每行的行节点
		 */
		Barrel.prototype.setRows = function() {
			var tmp = imgRatio;
			for (var i = 0; i<rows ; i++) {
				rowsArray[i] = document.createElement('ul');
				rowsArray[i].setAttribute('class','barrel');
				contentElement.appendChild(rowsArray[i]);
				count = 0;
				for (var j=0;j<imageCount;j++) {
					if (tmp[j] !== null && ((count + tmp[j].ratio) < rowsWidth)) {
						this.createImage(tmp[j].id, i);
						count += tmp[j].ratio;
						tmp[j] = null;
					}
				}
				rowsArray[i].style.height = width/count+'px';
			}
		};
		/**
		 * 设置木桶布局的图片元素节点并添加事件处理、挂载
		 * @param imageIndex 图片在图片数组中的下标
		 * @param rowsIndex 图片所在的ul行下标
         */
		Barrel.prototype.createImage = function(imageIndex,rowsIndex) {
			var imageNode = document.createElement('img');
			imageNode.setAttribute('src',imgArray[imageIndex]);
			rowsArray[rowsIndex].appendChild(imageNode);
			external.addClickEvent(imageNode);
		};
	};
	/**
	 * 拼图布局包装函数
	 * @param external 外部this指针
	 * @param imageCount 图片数目
	 * @constructor
     */
	var Puzzle = function(external,imageCount) {
		var puzzleCount = [],
			aspectRatioRectangle = 1.5,
			aspectRatioSquare = 1;

		Puzzle.prototype.init = function() {
			this.getPuzzleCount();
		};

		/**
		 * 获取应该使用多少组拼图
		 */
		Puzzle.prototype.getPuzzleCount = function () {
			var count = Math.ceil(imageCount/6);
			for (var i=0; i<count-1; i++) {
				puzzleCount[i] = document.createElement('div');
				puzzleCount[i].setAttribute('class','puzzle-6');
				puzzleCount[i].style.height = width/1.5+'px';
				contentElement.appendChild(puzzleCount[i]);
				for (var j=0; j<6; j++) {
					this.puzzleCountHelp(i,i,j,aspectRatioRectangle);
				}
			}
			puzzleCount[count] = document.createElement('div');
			puzzleCount[count].setAttribute('class','puzzle-'+imageCount%6);
			puzzleCount[count].style.height = width/1.5+'px';
			contentElement.appendChild(puzzleCount[count]);
			for (var k=0;k<imageCount%6;k++) {
				if ((imageCount%6 === 2)||((imageCount%6 === 5||imageCount%6 ===3) && (k === 1 || k === 2))) {
					this.puzzleCountHelp(count,count-1,k,aspectRatioSquare);
				} else {
					this.puzzleCountHelp(count, count - 1, k, aspectRatioRectangle);
				}
			}
		};
		/**
		 * 为每个拼图进行css类设置
		 * @param countGroup 属于第几个拼图组
		 * @param array 属于第几组图片
		 * @param offset 在组中的偏移量
         * @param aspectRatio 目标宽高比，用来格式化拉伸方式
         */
		Puzzle.prototype.puzzleCountHelp = function(countGroup,array,offset,aspectRatio) {
			var divTmp,
				ratio;
			divTmp = document.createElement('div');
			if (imgRatio[array*6+offset].ratio>=aspectRatio) {
				ratio = 'horizontal';
			} else {
				ratio = 'vertical';
			}
			divTmp.style.backgroundImage = 'url(\"'+imgArray[array*6+offset]+'\")';
			divTmp.setAttribute('class',ratio);
			external.addClickEvent(divTmp,imgArray[array*6+offset]);
			puzzleCount[countGroup].appendChild(divTmp);
		};
	};
	window.onload = function() {
		if (typeof window.lucasAlbum === 'undefined') {
			window.lucasAlbum = new LucasAlbum();
		}
	};
}(window));