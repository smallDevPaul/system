var system,trim,trimTo;
trim = function(str){
	return str.replace(/\s+/gi,'');
};
trimTo = function(to,str){
	return str.replace(/\s+/gi,to);
};
Object.prototype.extend = function(o){
	for(p in o) this[p] = o[p];
	return this;
};
Object.prototype.extend({
	is:function(){
		var name;
		name = Object.prototype.toString.call(this);
		name = name.slice(8,name.length-1);
		return arguments.length !== 0 ? name === arguments[0] : name;
	},
	hasProp:function(p){
		return (p in this);
	}
});
system = {
	canvas:{},
	world:{},
	event:{},
	hub:{
		background:{used:!1}
	},
	init:function(id,w,h,ca){
		this.canvas = document.getElementById(id);
		this.world = this.canvas.getContext('2d');
		system.hub.clearingEnabled = ca != null ? ca : !0;
		if(arguments.length > 2){ 
			this.canvas.width = w;
			this.canvas.height = h;
		}else if(w != null) system.hub.clearingEnabled = w;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		return this.world;
	},
	cursor:function(c){
		return {
			y:c.y - Number(system.hub.offsetY),
			x:c.x - Number(system.hub.offsetX)
		};
	},
	fullWH:function(once){
		var f;
		f = function(){
			system.width = system.canvas.width = window.innerWidth;
			system.height = system.canvas.height = window.innerHeight;
		};
		if(!!once && once.is('Function') && (!arguments[1])) window.addEventListener('resize',function(e){f();once(e)});
		else if(!once) window.addEventListener('resize',f);
		f();
	},
	set:function(o){
		this.world.extend(o);
	},
	center:function(o){
		var cb = function(){
			var w = system.width,
					 h = system.heigh,
					 ww = window.innerWidth,
					 wh = window.innerHeight;
			if(w > ww || h > wh) return;
			else{
				system.hub.offsetY = system.canvas.style.marginTop = '' + ((ww - w) / 2);
				 system.hub.offsetX = system.canvas.style.marginRight = '' + ((wh - h) / 2); 
			}
		};
		if(!o) window.addEventListener('resize',cb,!0);
		cb();
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
	run:function(cb){
		this.timer = setInterval(function(){
			if(system.hub.clearingEnabled) system.clear()
			if(system.hub.background.used){
				var sw = !1;
				if('alpha' in system.hub.background){
					sw = !0;
					system.set({globalAlpha:system.hub.background.alpha});
				}
				system.set({fillStyle:system.hub.background.pattern});
				system.world.fillRect(0,0,system.width,system.height);
				if(sw) system.set({globalAlpha:'1'});
			}
			cb();
		});
	},
	clear:function(){
		system.world.clearRect(0,0,this.width,this.height);
	},
	stop:function(){
		clearInterval(this.timer,100/6);
	},
	background:function(pattern,alpha){
		var c = system.hub.background;
		c.used = !0;
		c.pattern = pattern;
		if(alpha != null) c.alpha = alpha;
	},
	image:{
		pattern:function(path,repeation){
			var img;
			img = new Image();
			img.src = path;
			return {
				to:function(f){
					img.onload = function(){
						f(system.world.createPattern(img,repeation));
					}
				}
			}
		},
		bitmap:function(path){
			var img,a,ro;
			a = arguments;
			img = new Image();
			img.src = path;
			a[0] = img;
			return {
				to:function(f){
					img.onload = function(){
						var b;
						b = createImageBitmap.apply(window,a).then(f);
					}
				}
			}
		} 
	},
	opacity:function(to){
		this.world.globalAlpha = to;
		return this;
	}
};