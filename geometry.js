var Vector,Rectangle,Circle,Segment,Traingle,Polygon;
Vector = function(x,y){
	this.x = x;
	this.y = y;
};
Rectangle = function(x,y,w,h){
	this.vertex = [];
	if(arguments.length > 4){
		var a = arguments;
		this.vertex[0] = new Vector(x,y);
		this.vertex[1] = new Vector(a[2],a[3]);
		this.vertex[2] = new Vector(a[4],a[5]);
		this.vertex[3] = new Vector(a[6],a[7]);
	}else{
		this.vertex[0] = new Vector(x,y);
		this.vertex[1] = new Vector(x,y+h);
		this.vertex[2] = new Vector(x+w,y+h);
		this.vertex[3] = new Vector(x+w,y);
	}
};
Circle = function(cx,cy,r){
	this.c = new Vector(cx,cy);
	this.radius = r;
};
Segment = function(x,y,w){
	this.point = [];
	if(arguments.length > 3){
		this.point[0] = new Vector(x,y);
		this.point[1] = new Vector(w,arguments[3]);
	}else{
		this.point[0] = new Vector(x,y);
		this.point[1] = new Vector(x+w,y);
	}
};
Polygon = function(vertexes){
	this.vertex = [];
	for(var i = 0,p = 0,l = vertexes.length;p < l;i++,p+=2){
		this.vertex[i] = new Vector(vertexes[p],vertexes[p+1]);
	}
};
Vector.prototype.extend({
	distance_to:function(vector){
		return Math.sqrt(Math.pow(this.x - vector.x,2)+Math.pow(this.y - vector.y,2));
	}
});
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
	move:function(x,y){
		for(var i = 0;i < 4;i++){
			this.vertex[i].x += x;
			this.vertex[i].y += y;
		}
	},
	replace:function(x,y){
		this.move(x - this.vertex[0].x,y - this.vertex[0].y);
	},
	circle_collision:function(a){
		if(this.has_point(a.c)) return !0;
		else{
			var closest,sw;
			sw = !1;
			if(a.c.y < this.vertex[0].y){
				if(a.c.x < this.vertex[0].x) closest = this.vertex[0];
				else if(a.c.x > this.vertex[3].x) closest = this.vertex[3];
				else{
					if(a.c.y + a.radius >= this.vertex[0].y) return !0;
					sw = !0;
				}
			}else if(a.c.y > this.vertex[1].y){
				if(a.c.x < this.vertex[1].x) closest = this.vertex[1];
				else if(a.c.x > this.vertex[2].x) closest = this.vertex[2];
				else{
					if(a.c.y - a.radius <= this.vertex[1].y) return !0;
					sw = !0;
				}
			}else{
				sw = !0;
				if(a.c.x < this.vertex[0].x && a.c.x + a.radius >= this.vertex[0].x) return !0;
				else if(a.c.x > this.vertex[2].x && a.c.x - a.radius <= this.vertex[2].x) return !0;
			}
			if(!sw){
				if(closest.distance_to(a.c) <= a.radius) return !0;
			}
		}
		return !1;
	}
});
Segment.prototype.extend({
	length:function(){
		return this.point[0].distance_to(this.point[1]);
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
	rect_collision:function(rect){
		rect.circle_collision(this);
	},
	has_point:function(p){
		if(p.distance_to(this.c) <= this.radius) return !0;
		return !1;
	},
	move:function(x,y){
		this.c.x += x;
		this.c.y += y;
	},
	replace:function(x,y){
		this.move(x - this.c.x,y - this.c.y);
	}
});