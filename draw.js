system.brush = {
	_call:function(c){
		var val = c.substring(2,c.length - 1);
		val = val.split(',');
		c[0] === 'M' ? 
		system.world.moveTo(val[0],val[1]) : c[0] === 'L' ? 
		system.world.lineTo(val[0],val[1]) : c[0] === 'A' ? 
		system.world.arc(val[0],val[1],val[2],val[3],val[4],!!(parseInt(val[5]))) : c[0] === 'F' ? 
		system.world.fill() : c[0] === 'S' ? 
		system.world.stroke() : false;
	},
	frect:function(x,y,w,h,fs){
		var c = system.world;
		if(fs) c.fillStyle = fs;
		c.fillRect(x,y,w,h);
		return this;
	},
	srect:function(x,y,w,h,ss){
		var c = system.world;
		if(ss) c.strokeStyle = ss;
		c.strokeRect(x,y,w,h);
		return this;
	},
	farc:function(cx,cy,r,sa,ea,fs,ccw){
		var c = system.world;
		c.beginPath();
		if(fs) c.fillStyle = fs;
		c.arc(cx,cy,r,sa,ea,!!ccw);
		c.fill();
		c.closePath();
		return this;
	},
	sarc:function(cx,cy,r,sa,ea,ss,ccw){
		var c = system.world;
		c.beginPath();
		if(ss) c.strokeStyle = ss;
		c.arc(cx,cy,r,sa,ea,!!ccw);
		c.stroke();
		c.closePath();
		return this;
	},
	fcircle:function(cx,cy,r,fs){
		this.farc(cx,cy,r,0,Math.PI * 2,fs);
		return this;
	},
	scircle:function(cx,cy,r,ss){
		this.sarc(cx,cy,r,0,Math.PI * 2,ss);
		return this;
	},
	line:function(sx,sy,woex,ey){
		var c = system.world;
		c.beginPath();
		c.moveTo(sx,sy);
		if(ey == null) c.lineTo(sx+woex,sy);
		else c.lineTo(woex,ey);
		c.stroke();
		c.closePath();
		return this;
	},
	path:function(cds){
		var cdarr;
		trimTo(' ',cds);
		cdarr = cds.split(' ');
		system.world.beginPath();
		for(var i = 0,l = cdarr.length;i < l;i++){
			this._call(cdarr[i]);
		}
		system.world.closePath();
		return this;
	},
	image:function(){system.world.drawImage.aplly(system.world,arguments);}
};
if(window.hasProp('GeometryJS')){
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
	Point.prototype.extend({
		style:function(fs){
			this.SO = {fillStyle:fs};
			return this;
		},
		draw:function(){
			var c = system.world;
			c.beginPath();
			c.extend(this.SO);
			c.arc(this.x,this.y,1,0,Math.PI*2,!1);
			c.closePath();
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
			c.extend(this.SO);
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
}
Point.prototype.extend({
	style:function(fs){
		this.FS = fs;
		return this;
	},
	draw:function(){
		var c = system.world;
		c.beginPath();
		c.fillStyle = this.FS;
		c.arc(this.x,this.y,1,0,Math.PI * 2,false);
		c.fill();
		c.closePath();
	}
});