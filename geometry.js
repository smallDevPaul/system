var Vector,Rectangle,Circle,Segment,Traingle,Polygon,Point,IO,GeometryJS;
system.gameObjects = [];
Vector = function(x,y,go){
	this.x = x;
	this.y = y;
};
Point = function(){
	Vector.apply(this,arguments);
	this.index = system.gameObjects.length;
	system.gameObjects.push(this);
};
Rectangle = function(x,y,w,h){
	system.gameObjects.push(this);
	this.index = system.gameObjects.length - 1;
	this.vertex = [];
	if(arguments.length > 4){
		var a = arguments;
		this.vertex[0] = new Vector(x,y,!0);
		this.vertex[1] = new Vector(a[2],a[3],!0);
		this.vertex[2] = new Vector(a[4],a[5],!0);
		this.vertex[3] = new Vector(a[6],a[7],!0);
	}else{
		this.vertex[0] = new Vector(x,y,!0);
		this.vertex[1] = new Vector(x,y+h,!0);
		this.vertex[2] = new Vector(x+w,y+h,!0);
		this.vertex[3] = new Vector(x+w,y,!0);
	}
};
Circle = function(cx,cy,r){
	system.gameObjects.push(this);
	this.index = system.gameObjects.length - 1;
	this.c = new Vector(cx,cy,!0);
	this.radius = r;
};
Segment = function(x,y,w,go){
	system.gameObjects.push(this);
	this.index = system.gameObjects.length - 1;
	this.point = [];
	if(arguments.length > 3){
		this.point[0] = new Vector(x,y,!0);
		this.point[1] = new Vector(w,arguments[3],!0);
	}else{
		this.point[0] = new Vector(x,y,!0);
		this.point[1] = new Vector(x+w,y,!0);
	}
};
IO = function(path,x,y,w,h){
	system.gameObjects.push(this);
	this.index = system.gameObjects.length - 1;
	this.path = path;
	this.image = new Image();
	this.x = x;
	this.y = y;
	if(w != null && h != null){
		this.width = w;
		this.height = h;
	}
	this.loaded = !1;
	var that = this;
	this.image.onload = function(){
		that.loaded = !0;
	};
	this.image.src = path;
};
Polygon = function(vertexes){
	system.gameObjects.push(this);
	this.index = system.gameObjects.length - 1;
	this.vertex = [];
	for(var i = 0,p = 0,l = vertexes.length;p < l;i++,p+=2){
		this.vertex[i] = new Vector(vertexes[p],vertexes[p+1],!0);
	}
	this.RP = 0;
};
Vector.prototype.extend({
	distance_to:function(vector){
		return Math.sqrt(Math.pow(this.x - vector.x,2)+Math.pow(this.y - vector.y,2));
	},
	move:function(dx,dy){
		this.x += dx;
		this.y += dy;
	},
	replace:function(x,y){
		this.x = x;
		this.y = y;
	}
});
Point.prototype.extend(Vector.prototype);
Point.prototype.constructor = Point;
Rectangle.prototype.extend({
	width:function(){
		return this.vertex[0].distance_to(this.vertex[3]);
	},
	height:function(){
		return this.vertex[0].distance_to(this.vertex[1]);
	},
	has_point:function(point){
		if(this.vertex[0].x <= point.x && this.vertex[0].y <= point.y && this.vertex[2].x >= point.x && this.vertex[2].y >= point.y) return !0;
		return !1;
	},
	scale:function(w){
		var oh = ((this.height() * w) - this.height()) / 2,
			  ow = ((this.width() * w) - this.width()) / 2;
		this.vertex[0].move(-ow,-oh);
		this.vertex[1].move(-ow,oh);
		this.vertex[2].move(ow,oh);
		this.vertex[3].move(ow,-oh);
	},
	move:function(x,y){
		for(var i = 0;i < 4;i++){
			this.vertex[i].move(x,y);
		}
	},
	replace:function(x,y){
		this.move(x - this.vertex[0].x,y - this.vertex[0].y);
	},
	rect_collision:function(rect){
		for(var i = 0;i < 4;i++){
			if(this.has_point(rect.vertex[i])) return !0;
		}
		for(var i = 0;i < 4;i++){
			if(rect.has_point(this.vertex[i])) return !0;
		}
		return !1;
	},
	circle_collision:function(a,cb){
		if(this.has_point(a.c)) cb(-1);
		else{
			var closest;
			sw = !1;
			if(a.c.y < this.vertex[0].y){
				if(a.c.x < this.vertex[0].x) closest = this.vertex[0];
				else if(a.c.x > this.vertex[3].x) closest = this.vertex[3];
				else{
					if(a.c.y + a.radius >= this.vertex[0].y) cb(0);
					sw = !0;
				}
			}else if(a.c.y > this.vertex[1].y){
				if(a.c.x < this.vertex[1].x) closest = this.vertex[1];
				else if(a.c.x > this.vertex[2].x) closest = this.vertex[2];
				else{
					if(a.c.y - a.radius <= this.vertex[1].y) cb(2);
					sw = !0;
				}
			}else{
				sw = !0;
				if(a.c.x < this.vertex[0].x && a.c.x + a.radius >= this.vertex[0].x) cb(1);
				else if(a.c.x > this.vertex[2].x && a.c.x - a.radius <= this.vertex[2].x) cb(3);
			}
			if(!sw){
				if(closest.distance_to(a.c) <= a.radius) cb(4);
			}
		}
	}
});
Segment.prototype.extend({
	length:function(){
		return this.point[0].distance_to(this.point[1]);
	},
	move:function(dx,dy){
		this.point[0].move(dx,dy)
		this.point[1].move(dx,dy);
	},
	scale:function(w){
		var d = this.length();
		d = (d * w - d) / 2;
		if(this.point[0].y === this.point[1].y){
			this.point[0].move(-d,0);
			this.point[0].move(d,0);
		}else{
			var tv,a,b,c;
			tv = new Vector(this.point[0].x,this.point[1].y);
		 a = this.point[0].distance_to(tv);
		 b = this.point[1].distance_to(tv);
		 c = this.length();
		 d = new Vector((a/c) * d);
		 if(this.point[0].y > this.point[1].y) d = -d;
		 this.point[0].move(-d,-d);
		 this.point[1].move(d,d);
		}
	},
	circle_collision:function(obj){
		if(obj.c.x > this.point[0].x && obj.c.x < this.point[1].x){
			var a,b,c,p;
			a = this.point[0].distance_to(obj.c);
			b = this.point[1].distance_to(obj.c);
			c = this.length();
			p = (a+b+c)/2;
			if((2*Math.sqrt(p*(p-a)*(p-b)*(p-c))/c) <= obj.radius) return !0;
		}else{
			if(obj.c.x <= this.point[0].x){
				if(obj.c.distance_to(this.point[0]) <= obj.radius) return !0;
			}else{
				if(obj.c.distance_to(this.point[1]) <= obj.radius) return !0;
			}
		}
		return !1;
	}
});
Circle.prototype.extend({
	rect_collision:function(rect,cb){
		rect.circle_collision(this,cb);
	},
	segment_collision:function(segm){
		return segm.circle_collision(this);
	},
	has_point:function(p){
		if(p.distance_to(this.c) <= this.radius) return !0;
		return !1;
	},
	move:function(x,y){
		this.c.move(x,y);
	},
	replace:function(x,y){
		this.c.replace(x,y);
	},
	scale:function(w){
		this.radius *= w;
	}
});
IO.prototype.extend({
	draw:function(sx,sy,sw,sh){
		var args;
		if(sx == null){
			args = [this.image,this.x,this.y];
			if(this.hasProp('width')){
				args.push(this.width);
				args.push(this.height);
			}
		}else args = [this.image,sx,sy,sw,sh,this.x,this.y,this.width,this.height];
		system.world.drawImage.apply(system.world,args);
	},
	move:function(dx,dy){
		this.x += dx;
		this.y += dy;
	},
	replace:function(x,y){
		this.x = x
		this.y = y;
	},
	scale:function(w){
		this.width *= w;
		this.height *= w;
	},
	getOriginSize:function(){
		return {width:this.image.width,height:this.image.height};
	},
	onload:function(f){
		this.image.onload = f;
	}
});
Polygon.prototype.extend({
	setReplacePoint:function(p){
		this.RP = p;
	},
	move:function(dx,dy){
		this.vertex.map(function(e){
			e.move(dx,dy);
		});
	},
	replace:function(tox,toy){
		var dx,dy;
		dx = Math.abs(this.vertex[this.RP].x - tox);
		dy = Math.abs(this.vertex[this.RP].y - toy);
		for(var i = 0,l = this.vertex.length;i < l;i++) this.vertex[i].move(dx,dy);
	}
});
system.camera = {
	vx:0,
	vy:0,
	move:function(x,y){
		this.vx += x;
		this.vy += y;
		system.gameObjects.map(function(e){
			e.move(x,y);
		});
	},
 	reset:function(nx,ny){
 		this.vx = nx != null ? nx : 0;
 		this.vy = ny != null ? nx : 0;
 	},
 	allowFor:function(o){
 		o.index = system.world.length;
 		system.gameObjects.push(o);
 	},
 	preventFor:function(o){
 		system.gameObjects.splice(o.index,1);
 		o.index = undefined;
 	}
};