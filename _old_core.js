Object.prototype.extend = function(o){
	for(p in o) this[p] = o[p];
		return this;
};
Object.prototype.hasProp = function(prop) {
	return (prop in this);
};
var system = {
	context:{},
	canvas:{},
	event:{},
	width:0,
	height:0,
	data:{
		dir:''
	},
	init:function(id){
		this.canvas = document.getElementById(id);
		this.context = this.canvas.getContext('2d');
	},
	initWorldSize:function(width,height){
		this.width = this.canvas.width = width;
		this.height = this.canvas.height = height;
	},
	initResizeMode:function(){
		var that = this,callback = function(){
			that.width = that.canvas.width = window.innerWidth;
			that.height = that.canvas.height = window.innerHeight;
		};
		window.addEventListener('resize',callback,false);
		callback();
	},
	loadImageResources:function(paths,callback){
		var i = 0,
		    till = paths.length - 1,
		    images = [],
		    load = function(path){
			     var img = new Image();
			     images.push(img);
			     if(i < till) img.onload = function(){load(paths[++i]);};
			     else img.onload = function(){callback(images)};
			     img.src = system.data.dir + path;
		};
		load(paths[i]);
	},
	drawImage:function(image,x,y,w,h,dx,dy,dw,dh){
		if(arguments.length === 9) system.context.drawImage(image,dx,dy,dw,dy,x,y,w,h);
		else system.context.drawImage.apply(system.context,arguments);
	},
	initDisplayFunc:function(callback){
		var func = function(){
			system.context.clearRect(0,0,system.width,system.height);
			callback(system.context,system.width,system.height);
			requestAnimationFrame(func);
		};
		func();
	},
	initMouseControl:function(callback,x,y){
		window.addEventListener('mousemove',function(e){
			callback(e);
			if(y == null){
				x.x = e.pageX
				x.y = e.pageY;
			}else{
				x = e.pageX;
				y = e.pageY;
			}
		},true);
	},
	use:function(e,h){
		if(e.match(/key/gi)) window['on'+e] = h;
		else this.canvas['on'+e] = h;
	},
	unuse:function(e){
		this.use(e,null);
	},
	on:function(e,h,c){
		c = !!c;
		if(!this.event.hasProp(e)) this.event[e] = [];
		this.event[e].push({
			handler:h,
			capture:c
		});
		 if(e.match(/key/gi) || e === 'mousemove' || e === 'mousewheel'){
			window.addEventListener(e,h,c);
		}else this.canvas.addEventListener(e,h,c);
	},
	off:function(e,p){
		var t;
		if(p == null) p = 0;
		t = this.event[e];
		if(e.match(/key/gi)){
			window.removeEventListener(e,t[p].handler,t[p].capture);
		}else this.canvas.removeEventListener(e,t[p].handler,t[p].capture);
		this.event[e].splice(p,1);
	},
	direct:function(to){
		system.data.dir = to + '/';
	},
	set:function(p,v){
		system.context[p] = v;
	}
};

