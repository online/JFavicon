/*!
 * JFavicon - A small library for manipulating the Favicon
 * Str@nnik
 * Copyright (c) 2012 Alex Ivashkin
 * @version 0.3.1
*/

(function() {
	
	var jf = {};
	var undefined = 'undefined';
	jf.m = {};
	jf.sett = {
		width: 15,
		height: 9,
		bg: '#000',
		ct: '#fff',
		num: null,
		favicon: '/favicon.ico',
		currStyle: 'default',
		dir: '/',
		font: 'normal 8px sans-serif',
		sMes: false,
		mes: 'Новых: {c}'
	};
	
	var ua = (function () {
		var agent = navigator.userAgent.toLowerCase();
		// New function has access to 'agent' via closure
		return function (browser) {
			return agent.indexOf(browser) !== -1;
		};
	}());
	
	if (ua('safari')) {jf.sett.brow = 'saf'} else if (ua('msie')) {jf.sett.brow = 'ie'} else {jf.sett.brow = false}
	
	jf.init = function (value) {
		jf.m.body = document.getElementsByTagName('body')[0];
		jf.m.head = document.getElementsByTagName('head')[0];
		jf.m.fav = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]')[0];
		jf.m.setTitle = document.getElementsByTagName('title')[0];
		jf.m.title = document.title;
		
		if (typeof value != undefined) {
			if (value.extract) window.jf = jf;
			if (value.fav) jf.sett.favicon = value.fav;
			if (value.style) jf.sett.currStyle = value.style;
			if (value.dir) jf.sett.dir = value.dir;
			if (value.width) jf.sett.width = value.width;
			if (value.height) jf.sett.height = value.height;
			if (value.bg) jf.sett.bg = value.bg;
			if (value.ct) jf.sett.ct = value.ct;
			if (value.num) jf.sett.num = value.num;
			if (value.font) jf.sett.font = value.font;
			if (value.message) jf.sett.mes = value.message;
			if (value.showMessage) jf.sett.sMes = value.showMessage;
		}
		
		favicon();
		
		return this;
	};
	
	jf.style = {
		'default': {
			title: 'default',
			maxNum: 99
		},
		main: {
			title: 'main',
			maxNum: 2,
			ext: '.png',
			pref: 'fv'
		}
	};
	
	jf.setStyle = function (value) {
		if (typeof value != undefined) {
			if (typeof jf.style[value.title] == undefined) {
				jf.style[value.title] = value;
			}
		}
	};
	
	function favicon () {
		if (!document.querySelectorAll( 'link[rel="icon"], link[rel="shortcut icon"]')[0]) {
			var link = document.createElement('link');
			link.rel = 'shortcut icon';
			link.href = jf.sett.favicon;
			link.type = 'image/x-icon';
			jf.m.head.appendChild(link);
			jf.m.fvi = link;
		} else {
			jf.m.fvi = document.querySelectorAll( 'link[rel="icon"], link[rel="shortcut icon"]')[0];
		}
	}
	
	jf.draw = function (num) {
		if (jf.sett.currStyle == 'default') {
			var img = new Image();
			img.src = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]')[0].href;
			
			function title () {
				if (jf.sett.sMes || jf.sett.brow == 'ie' || jf.sett.brow == 'saf') {
					var title = jf.sett.mes.replace('{c}', num).replace('{s}', jf.m.title);
					jf.m.setTitle.innerHTML = title;
				}
			}
			
			img.onload = function () {
				var canva = document.createElement('canvas');
				canva.width = 16;
				canva.height = 16;
				var c = canva.getContext("2d");
				c.drawImage(img, 0, 0);
				c.fillStyle = jf.sett.bg;
				c.fillRect(1, 16-jf.sett.height, jf.sett.width, jf.sett.height);
				c.fillStyle = jf.sett.ct;
				c.font = jf.sett.font;
				c.fillText((num <= 99) ? num : '99+', 2, 14);
				jf.m.head.removeChild(document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]')[0]);
				var link = document.createElement('link');
				link.rel = 'shortcut icon';
				link.href = canva.toDataURL();
				link.type = 'image/x-icon';
				jf.m.head.appendChild(link);
				title();
			}
		} else {
			jf.m.head.removeChild(document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]')[0]);
			var link = document.createElement('link');
			link.rel = 'shortcut icon';
			var currNum = null;
			(num <= jf.style[jf.sett.currStyle].maxNum) ? currNum = num : currNum = 'max';
			link.href = jf.sett.dir + jf.sett.currStyle + '/' + jf.style[jf.sett.currStyle].pref + currNum + jf.style[jf.sett.currStyle].ext;
			link.type = 'image/x-icon';
			jf.m.head.appendChild(link);
			title();
		}
		
		jf.sett.num = num;
		return this;
	}
	
	jf.add = function (num) {
		if (typeof num == undefined) {
			num = 1;
		}
		jf.draw(jf.sett.num+num);
	};
	
	jf.deduct = function (num) {
		if (typeof num == undefined) {
			num = 1;
		}
		jf.draw(jf.sett.num-num);
	};
	
	jf.disable = function () {
		jf.m.head.removeChild(document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]')[0]);
		var link = document.createElement('link');
		link.rel = 'shortcut icon';
		link.href = jf.m.fvi.href;
		link.type = 'image/x-icon';
		jf.m.head.appendChild(link);
		
		if (jf.sett.sMes || jf.sett.brow == 'ie' || jf.sett.brow == 'saf') {
			jf.m.setTitle.innerHTML = jf.m.title;
		}
	};
	
	jf.reset = function () {
		jf.disable();
		jf.sett.num = null;
		
		if (jf.sett.sMes || jf.sett.brow == 'ie' || jf.sett.brow == 'saf') {
			jf.m.setTitle.innerHTML = jf.m.title;
		}
	};
	
	window.JFavicon = jf;
	
}());