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
		columnCount = 3,
		column = [],
		columnHeight = [];

	LucasAlbum.prototype.init = function() {
		this.getAlbumElement();
		this.imageColumn(columnCount);
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
	}
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
	}
	/**
	 * 瀑布流挂载辅助函数，计算当前最短的一列
	 * @returns {DOM对象，最短的一列}
     */
	LucasAlbum.prototype.getLowestColumn = function() {
		var min = 999999,
			index;
		for (var i =0;i<columnCount;i++) {
			columnHeight[i] = column[i].offsetHeight;
		}
		for (var i=0;i<columnCount;i++) {
			if (columnHeight[i] < min) {
				index = i;
				min = columnHeight[i]
			}
		}
		return index;
	}
	/**
	 * 单个图片挂载，可在另外挂载的时候复用
	 * @param 图片的路径
     */
	LucasAlbum.prototype.appendImage = function(image) {
		var index = this.getLowestColumn(),
			imageElement,
			liElement;
		console.log(index);
		liElement = document.createElement('li');
		imageElement = document.createElement('img');
		liElement.appendChild(imageElement);
		imageElement.setAttribute('src',image);
		column[index].appendChild(liElement);
	}

	window.onload = function() {
		if (typeof window.lucasAlbum === 'undefined') {
			window.lucasAlbum = new LucasAlbum();
		}
	}
}(window));