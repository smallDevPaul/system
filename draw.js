system.brush = {
	frect:function(x,y,w,h,fs){
		var c = system.world;
		if(fs) c.fillStyle = fs;
		c.fillRect(x,y,w,h);
	},
	srect:function(x,y,w,h,ss){
		var c = system.world;
		if(ss) c.strokeStyle = ss;
		c.strokeRect(x,y,w,h);
	},
	farc:function(cx,cy,r,sa,ea,fs,ccw){
		var c = system.world;
		c.beginPath();
		if(fs) c.fillStyle = fs;
		c.arc(cx,cy,r,sa,ea,!!ccw);
		c.fill();
		c.closePath();
	},
	sarc:function(cx,cy,r,sa,ea,ss,ccw){
		var c = system.world;
		c.beginPath();
		if(ss) c.strokeStyle = ss;
		c.arc(cx,cy,r,sa,ea,!!ccw);
		c.stroke();
		c.closePath();
	},
	fcircle:function(cx,cy,r,fs){
		this.farc(cx,cy,r,0,Math.PI * 2,fs);
	},
	scircle:function(cx,cy,r,ss){
		this.sarc(cx,cy,r,0,Math.PI * 2,ss);
	}
};
Rectangle.prototype.extend({
	style:function(so){
		if(!this.hasProp('SO')) this.SO = {};
		this.SO.extend(so);
	},
	fill:function(){
		var c = system.world;
		c.fillStyle = this.SO.fillStyle;
		c.fillRect(this.vertex[0].x,this.vertex[0].y,this.width(),this.height());
	},
	stroke:function(){
		var c = system.world;
		c.strokeStyle = this.SO.strokeStyle;
		c.strokeRect(this.vertex[0].x,this.vertex[0].y,this.width(),this.height());
	},
	draw:function(){
		var c = system.world,w = this.width(),h = this.height();
		c.extend(this.SO);
		c.fillRect(this.vertex[0].x,this.vertex[0].y,w,h);
		c.strokeRect(this.vertex[0].x,this.vertex[0].y,w,h);
	}
});
Circle.prototype.style = Rectangle.prototype.style;
Circle.prototype.extend({
	fill:function(){
		system.brush.fcircle(this.c.x,this.c.y,this.radius,this.SO.fillStyle);
	},
	stroke:function(){
		system.brush.scircle(this.c.x,this.c.y,this.radius,this.SO.strokeStyle);
	},
	draw:function(){
		var c = system.world;
		c.beginPath();
		c.extned(this.SO);
		c.arc(this.c.x,this.c.y,this.radius,0,Math.PI * 2,false);
		c.fill();
		c.stroke();
		c.closePath();
	}
});
Segment.prototype.extend({
	style:function(ss){
		if(!this.hasProp('SO')) this.SO = {};
		this.SO.strokeStyle = ss;
	},
	draw:function(){
		var c = system.world;
		c.beginPath();
		c.extend(this.SO);
		c.moveTo(this.point[0].x,this.point[0].y);
		c.lineTo(this.point[1].x,this.point[1].y);
		c.stroke();
		c.closePath();
	}
});