var gravity,ginit;
gravity = {
	gdx:0,
	gdy:0,
	gmax:10,
	gstep:null,
	ginit:function(x,y){
		this.gravitated = !0;
		this.gstep = new Vector(x,y);
		return this;
	},
	gset:function(dx,dy,m){
		if(m != null) this.gmax = m;
		this.gdx = dx;
		this.gdy = dy;
		return this;
	},
	gravitated:null,
	gravitate:function(){
		if(this.gravitated){
			if(Math.abs(this.gdx) < this.gmax) this.gdx += this.gstep.x;
			if(Math.abs(this.gdy) < this.gmax) this.gdy += this.gstep.y;
			this.move(this.gdx,this.gdy);
		}
	},
	gzero:function(){
		this.gdx = 0;
		this.gdy = 0;
	},
	gstop:function(){
		this.gravitated = !1;
	}
};
ginit = function(o){
	if(o.is('Array')) o.map(function(e){e.prototype.extend(gravity)});
	else o.prototype.extend(gravity);
};