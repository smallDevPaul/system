var system;
system = {
	canvas:{},
	world:{},
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
		if(once.is('Function') && (!arguments[1])) window.addEventListener('resize',function(e){f();once(e)});
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
		if(e.match(/key/gi)) window.addEventListener(e,h,!!c);
		else this.canvas.addEventListener(e,h,!!c);
	},
	off:function(e){

	},
	run:function(cb){
		this.timer = setInterval(cb);
	},
	clear:function(){
		system.world.clearRect(0,0,this.canvas.width,this.canvas.height);
	},
	stop:function(){
		clearInterval(this.timer,100/6);
	}
};