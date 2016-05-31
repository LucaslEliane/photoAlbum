(function(window){
	'use strict';

	/**
 	 * 公有变量以及初始化方法
 	 * @return {[type]} [description]
 	 */
	function LucasAlbum() {
		this.LAYOUT = {
			PUZZLE    :   1,
			WATERFALL :   2,
			BARREL    :   3
		};
		this.init();
	}

	var imgArray = [],
		contentElement,
		imageCount,
		layout,
		columnCount = 5,
		column = [],
		columnHeight = [],
		overlay,
		previewImage,
		previewDiv;

	LucasAlbum.prototype.init = function() {
		this.getAlbumElement();
		this.imageColumn(columnCount);
		this.createOverlay();
		this.initAppendImage();

	};

	/**
 	 * 获取相册的div元素以及所有div元素中的img元素
	 * @return {[type]} [description]
 	 */
	LucasAlbum.prototype.getAlbumElement = function() {
		var tmp;
		if (document.getElementsByClassName) {
			if (document.getElementsByClassName('lucas-album')[0]) {
				contentElement = document.getElementsByClassName('lucas-album')[0];
			}
		}
		if (document.querySelectorAll) {
			if (document.querySelectorAll('.lucas-album img').length !== 0) {
				tmp = document.querySelectorAll('.lucas-album img');
			}
		}
		for (var i = 0; i < tmp.length; i++) {
			imgArray[i] = tmp[i].getAttribute('src');
			contentElement.removeChild(tmp[i]);
		}
		layout = this.LAYOUT[contentElement.getAttribute('category')];
		imageCount = imgArray.length;
	};
	/**
	 * 为某个元素添加一个类
	 * @param element 需要添加类的dom元素
	 * @param value	需要添加的类名
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
	};
	/**
	 * 为某个dom元素删除一个类名
	 * @param element 需要删除类名的dom元素
	 * @param value 删除的类名
     */
	LucasAlbum.prototype.removeClass = function (element,value) {
		var className;
		if (element.getAttribute('class')){
			className = element.getAttribute('class');
			className = className.replace(value,'');
			element.setAttribute('class',className);
		}
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
		document.getElementsByTagName('body')[0].appendChild(overlay);
		document.getElementsByTagName('body')[0].appendChild(previewDiv);
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
 	 * 生成相册的列栏元素
 	 * @param columnCount 相册分列数
 	 */
	LucasAlbum.prototype.imageColumn = function(columnCount) {
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
	LucasAlbum.prototype.initAppendImage = function() {
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
	LucasAlbum.prototype.getLowestColumn = function() {
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
	LucasAlbum.prototype.appendImage = function(image) {
		var index = this.getLowestColumn(),
			imageElement,
			liElement;
		liElement = document.createElement('li');
		imageElement = document.createElement('img');
		liElement.appendChild(imageElement);
		imageElement.setAttribute('src',image);
		column[index].appendChild(liElement);
		this.addClickEvent(imageElement);
	};
	/**
	 * 为每个图片添加点击样式
	 * @param image img的DOM元素
     */
	LucasAlbum.prototype.addClickEvent = function(image) {
		var that = this;
		image.addEventListener('click',function(event){
			var src = event.target.getAttribute('src');
			previewImage.setAttribute('src',src);
			that.removeClass(overlay,'hidden');
			that.removeClass(previewDiv,'hidden');
			that.removeClass(previewImage,'imageHidden');
			that.addClass(overlay,'overlayShow');
			that.addClass(previewDiv,'previewShow');
			that.addClass(previewImage,'imageShow');
		});
	};

	window.onload = function() {
		if (typeof window.lucasAlbum === 'undefined') {
			window.lucasAlbum = new LucasAlbum();
		}
	};
}(window));