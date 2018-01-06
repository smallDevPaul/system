var Arc, Circle, GeometricObject, Point, Polygon, Rectangle, RoundedRectangle, Text,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

GeometricObject = (function(superClass) {
  extend(GeometricObject, superClass);

  function GeometricObject(x, y) {
    GeometricObject.__super__.constructor.call(this, 'Geometric Object', x, y);
    this.border = this.background = DEF_COLOR;
  }

  return GeometricObject;

})(GameObject);

Point = (function(superClass) {
  extend(Point, superClass);

  function Point(x, y) {
    Point.__super__.constructor.call(this, x, y);
  }

  Point.prototype.fill = function() {
    var c;
    c = system.context;
    c.beginPath();
    c.fillStyle = this.background;
    c.arc(this.x, this.y, DEF_POINT_RADIUS, 0, Math.PI * 2, false);
    c.fill();
    return c.closePath();
  };

  Point.prototype.stroke = function() {
    var c;
    c = system.context;
    c.beginPath();
    c.strokeStyle = this.border;
    c.arc(this.x, this.y, DEF_POINT_RADIUS, 0, Math.PI * 2, false);
    c.stroke();
    return c.closePath();
  };

  Point.prototype.draw = function() {
    var c;
    c = system.context;
    c.beginPath();
    c.fillStyle = this.background;
    c.strokeStyle = this.border;
    c.arc(this.x, this.y, DEF_POINT_RADIUS, 0, Math.PI * 2, false);
    c.fill();
    c.stroke();
    return c.closePath();
  };

  return Point;

})(GeometricObject);

Rectangle = (function(superClass) {
  extend(Rectangle, superClass);

  function Rectangle(x, y, width, height) {
    this.width = width;
    this.height = height;
    Rectangle.__super__.constructor.call(this, x, y);
  }

  Rectangle.prototype.fill = function() {
    system.context.fillStyle = this.background;
    return system.context.fillRect(this.x, this.y, this.width, this.height);
  };

  Rectangle.prototype.stroke = function() {
    system.context.strokeStyle = this.background;
    return system.context.fillRect(this.x, this.y, this.width, this.height);
  };

  Rectangle.prototype.draw = function() {
    this.fill();
    return this.stroke();
  };

  return Rectangle;

})(GeometricObject);

Circle = (function(superClass) {
  extend(Circle, superClass);

  function Circle(x, y, radius) {
    this.radius = radius;
    Circle.__super__.constructor.call(this, x, y);
  }

  Circle.prototype.fill = function() {
    var c;
    c = system.context;
    c.beginPath();
    c.fillStyle = this.background;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fill();
    return c.closePath();
  };

  Circle.prototype.stroke = function() {
    var c;
    c = system.context;
    c.beginPath();
    c.strokeStyle = this.border;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.stroke();
    return c.closePath();
  };

  Circle.prototype.draw = function() {
    var c;
    c = system.context;
    c.beginPath();
    c.fillStyle = this.background;
    c.strokeStyle = this.border;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fill();
    c.stroke();
    return c.closePath();
  };

  return Circle;

})(GeometricObject);

Arc = (function(superClass) {
  extend(Arc, superClass);

  function Arc(x, y, r, sa, ea, cc, type) {
    this.cc = cc != null ? cc : false;
    if (type == null) {
      type = 'deg';
    }
    Arc.__super__.constructor.call(this, x, y);
    this.radius = r;
    this.startAngle = type === 'deg' ? sa * (Math.PI / 180) : sa;
    this.endAngle = type === 'deg' ? ea * (Math.PI / 180) : ea;
  }

  Arc.prototype.fill = function() {
    var c;
    c = system.context;
    c.fillStyle = this.background;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.cc);
    c.fill();
    return c.closePath();
  };

  Arc.prototype.stroke = function() {
    var c;
    c = system.context;
    c.strokeStyle = this.border;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.cc);
    c.stroke();
    return c.closePath();
  };

  Arc.prototype.moveAngle = function(da) {
    da = da * (Math.PI / 180);
    this.startAngle += da;
    this.endAngle += da;
    if (this.startAngle >= (Math.PI * 2)) {
      this.startAngle -= Math.PI * 2;
    }
    if (this.endAngle >= (Math.PI * 2)) {
      return this.endAngle -= Math.PI * 2;
    }
  };

  return Arc;

})(GeometricObject);

Polygon = (function() {
  function Polygon() {
    var i, j, l, vertexes;
    vertexes = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    j = 0;
    i = 0;
    l = vertexes.length;
    this.vertexes = [];
    this.border = this.background = DEF_COLOR;
    while (i < l) {
      this.vertexes[j] = {
        x: vertexes[i],
        y: vertexes[i + 1]
      };
      i += 2;
      j++;
    }
  }

  Polygon.prototype.fill = function() {
    var c, i, l;
    c = system.context;
    c.beginPath();
    c.fillStyle = this.background;
    c.moveTo(this.vertexes[0].x, this.vertexes[0].y);
    i = 1;
    l = this.vertexes.length;
    while (i < l) {
      c.lineTo(this.vertexes[i].x, this.vertexes[i].y);
      i++;
    }
    c.lineTo(this.vertexes[0].x, this.vertexes[0].y);
    c.fill();
    return c.closePath();
  };

  Polygon.prototype.stroke = function() {
    var c, i, l;
    c = system.context;
    c.beginPath();
    c.strokeStyle = this.border;
    c.moveTo(this.vertexes[0].x, this.vertexes[0].y);
    i = 1;
    l = this.vertexes.length;
    while (i < l) {
      c.lineTo(this.vertexes[i].x, this.vertexes[i].y);
      i++;
    }
    c.lineTo(this.vertexes[0].x, this.vertexes[0].y);
    c.stroke();
    return c.closePath();
  };

  Polygon.prototype.draw = function() {
    var c, i, l;
    c = system.context;
    c.beginPath();
    c.fillStyle = this.background;
    c.strokeStyle = this.border;
    c.moveTo(this.vertexes[0].x, this.vertexes[0].y);
    i = 1;
    l = this.vertexes.length;
    while (i < l) {
      c.lineTo(this.vertexes[i].x, this.vertexes[i].y);
      i++;
    }
    c.lineTo(this.vertexes[0].x, this.vertexes[0].y);
    c.fill();
    c.stroke();
    return c.closePath();
  };

  Polygon.prototype.move = function(dx, dy) {
    var i, l, results;
    i = 0;
    l = this.vertexes.length;
    results = [];
    while (i < l) {
      this.vertexes[i].x += dx;
      this.vertexes[i].y += dy;
      results.push(i++);
    }
    return results;
  };

  Polygon.prototype.replace = function(x, y) {
    var dx, dy;
    dx = x - this.vertexes[0].x;
    dy = y - this.vertexes[0].y;
    return this.move(dx, dy);
  };

  return Polygon;

})();

RoundedRectangle = (function(superClass) {
  extend(RoundedRectangle, superClass);

  function RoundedRectangle(x, y, width, height, radius) {
    this.width = width;
    this.height = height;
    this.radius = radius;
    RoundedRectangle.__super__.constructor.call(this, x, y);
  }

  RoundedRectangle.prototype.__std_draw__ = function() {
    var c;
    c = system.context;
    c.beginPath();
    c.moveTo(this.x + this.radius, this.y);
    c.lineTo(this.x + this.width - this.radius, this.y);
    c.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + this.radius);
    c.lineTo(this.x + this.width, this.y + this.height - this.radius);
    c.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - this.radius, this.y + this.height);
    c.lineTo(this.x + this.radius, this.y + this.height);
    c.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - this.radius);
    c.lineTo(this.x, this.y + this.radius);
    c.quadraticCurveTo(this.x, this.y, this.x + this.radius, this.y);
    return c.closePath();
  };

  RoundedRectangle.prototype.fill = function() {
    system.context.fillStyle = this.background;
    this.__std_draw__();
    return system.context.fill();
  };

  RoundedRectangle.prototype.stroke = function() {
    system.context.strokeStyle = this.border;
    this.__std_draw__();
    return system.context.stroke();
  };

  RoundedRectangle.prototype.draw = function() {
    system.context.fillStyle = this.background;
    system.context.strokeStyle = this.border;
    this.__std_draw__();
    system.context.fill();
    return system.context.stroke();
  };

  return RoundedRectangle;

})(GeometricObject);

Text = (function(superClass) {
  extend(Text, superClass);

  function Text(string, x, y) {
    this.string = string;
    Text.__super__.constructor.call(this, x, y);
    this.textFont = false;
  }

  Text.prototype.font = function(font) {
    this.textFont = font;
    return system.context.font = font;
  };

  Text.prototype.width = function() {
    return system.context.measureText(this.string).width;
  };

  Text.prototype.fill = function() {
    if (this.textFont) {
      system.context.font = this.textFont;
    }
    system.context.fillStyle = this.background;
    return system.context.fillText(this.string, this.x, this.y);
  };

  Text.prototype.stroke = function() {
    if (this.textFont) {
      system.context.font = this.textFont;
    }
    system.context.strokeStyle = this.border;
    return system.context.strokeText(this.string, this.x, this.y);
  };

  Text.prototype.draw = function() {
    if (this.textFont) {
      system.context.font = this.textFont;
    }
    system.context.fillStyle = this.background;
    system.context.fillText(this.string, this.x, this.y);
    system.context.strokeStyle = this.border;
    return system.context.strokeText(this.string, this.x, this.y);
  };

  return Text;

})(GeometricObject);
