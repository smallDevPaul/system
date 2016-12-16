var system;
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
	init:function(id,w,h){
		this.canvas = document.getElementById(id);
		this.world = this.canvas.getContext('2d');
		if(w){ 
			this.canvas.width = w;
			this.canvas.height = h;
		}
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		return this.world;
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
		 if(e.match(/key/gi)){
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
		this.timer = setInterval(cb);
	},
	clear:function(){
		system.world.clearRect(0,0,this.width,this.height);
	},
	stop:function(){
		clearInterval(this.timer,100/6);
	}
};