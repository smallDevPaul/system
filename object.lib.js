
/*
	product:System.coffee object library
	author:Poul Shults
	license:GNU General
	copyright:©2016-2017
 */
var Animation, DEF_COLOR, DEF_POINT_RADIUS, DOP, DrawableObject, GameInterface, GameLevel, GameObject, Sprite, Tile, TileSet, TileSprite, _Event, _Image,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DEF_COLOR = '#FAFAFA';

DEF_POINT_RADIUS = 2;

system.data.objects = [];

system.data.interfaces = {};

system.data.levels = [];

system.data.context = system.data.levels;

system.camera = {
  dx: 0,
  dy: 0,
  move: function(dx, dy) {
    var i, len, object, ref1;
    this.dx += dx;
    this.dy += dy;
    ref1 = system.data.objects;
    for (i = 0, len = ref1.length; i < len; i++) {
      object = ref1[i];
      if (object.cameraControl === true) {
        object.move(dx, dy);
      }
    }
    return this;
  },
  replace: function(x, y) {
    var dx, dy, i, len, object, ref1;
    dx = this.dx - x;
    dy = this.dy - y;
    this.dx = x;
    this.dy = y;
    ref1 = system.data.objects;
    for (i = 0, len = ref1.length; i < len; i++) {
      object = ref1[i];
      if (object.cameraControl === true) {
        object.move(dx, dy);
      }
    }
    return this;
  }
};

_Event = (function() {
  _Event.prototype.active = false;

  _Event.prototype.__event__ = null;

  function _Event(type1, handler1, bo, cap) {
    this.type = type1;
    this.handler = handler1;
    this.bindedObject = bo;
    this.capture = !!cap;
    if (bo.__event__ != null) {
      if (bo.__event__[type] != null) {
        bo.__event__[type].push(this);
      } else {
        bo.__event__[type] = [this];
      }
    } else {
      bo.__event__ = {};
      bo.__event__[this.type] = [this];
    }
  }

  _Event.prototype.activate = function() {
    this.__event__ = system.on(this.type, this.handler, this.capture);
    return this.active = true;
  };

  _Event.prototype.deactivate = function() {
    system.off(this.__event__);
    return this.active = false;
  };

  return _Event;

})();

GameInterface = (function() {
  GameInterface.prototype.active = false;

  function GameInterface(name1, obj, init1, On, display, Off) {
    this.name = name1;
    this.init = init1;
    this.extend(obj);
    this.display = function() {
      return display.call(this, system.context);
    };
    this.on = function() {
      var that;
      On.apply(this, arguments);
      this.active = true;
      that = this;
      return system.addDrawer(this.name, function() {
        return that.display();
      });
    };
    this.off = function() {
      system.removeDrawer(this.name);
      this.active = false;
      return Off.apply(this, arguments);
    };
    system.data.interfaces[this.name] = this;
  }

  GameInterface.prototype.borrow = function(p, name) {
    return this[p] = system.getInterface(name)[p];
  };

  return GameInterface;

})();

GameLevel = (function() {
  function GameLevel(obj, init, start, display1, end) {
    this.display = display1;
    this.index = system.data.levels.length;
    this.extend(obj);
    this.objects = [];
    this.init = function() {
      system.data.context = this.objects;
      init.apply(this, arguments);
      return system.data.context = system.data.objects;
    };
    this.start = function() {
      start.apply(this, arguments);
      return system.data.drawer = (function(_this) {
        return function() {
          return _this.display(system.context);
        };
      })(this);
    };
    this.end = function() {
      system.data.drawer = function() {
        return null;
      };
      return end.apply(this, arguments);
    };
    system.data.levels.push(this);
  }

  GameLevel.prototype.remove = function() {
    return this;
  };

  return GameLevel;

})();

Animation = (function() {
  Animation.prototype.running = false;

  function Animation(name1, framFunc, duration, callback) {
    this.name = name1;
    this.framFunc = framFunc;
    this.duration = duration;
    this.callback = callback;
    this.startTime = 0;
    this.timeElapsed = 0;
  }

  Animation.prototype.start = function() {
    var cb;
    this.running = true;
    cb = (function(_this) {
      return function() {
        _this.timeElapsed = (new Date()).getTime() - _this.startTime;
        _this.frameFunc(_this.timeElapsed / _this.duration, _this.timeElapsed);
        if (_this.timeElapsed < _this.duration) {
          return setTimeout(cb, 100 / 6);
        } else {
          _this.timeElapsed = _this.duration;
          _this.running = false;
          return _this.callback();
        }
      };
    })(this);
    this.startTime = (new Date()).getTime();
    return cb();
  };

  Animation.prototype.create = function() {
    return new Animation(this.name, this.frameFunc, this.duration);
  };

  return Animation;

})();

DrawableObject = (function() {
  function DrawableObject(obj, init, draw) {
    this.extend(obj);
    this.init = function() {
      return init.apply(this, arguments);
    };
    this.draw = function() {
      return draw.call(this, system.context);
    };
  }

  DrawableObject.prototype.asGameObject = function(name, x, y) {
    var o;
    o = new GameObject(name, x, y);
    o.extend(this);
    return this.extend(o);
  };

  return DrawableObject;

})();

DOP = (function() {
  function DOP(object1, init1, draw1) {
    this.object = object1;
    this.init = init1;
    this.draw = draw1;
  }

  DOP.prototype.create = function() {
    return new DrawableObject(this.object, this.init, this.draw);
  };

  return DOP;

})();

GameObject = (function() {
  GameObject.prototype.cameraControl = true;

  function GameObject(name1, x1, y1) {
    this.name = name1;
    this.x = x1;
    this.y = y1;
    system.data.context.push(this);
  }

  GameObject.prototype.move = function(dx, dy) {
    this.x += dx;
    return this.y += dy;
  };

  GameObject.prototype.replace = function(x, y) {
    this.x = x;
    return this.y = y;
  };

  GameObject.prototype.preventCamera = function() {
    return this.cameraControl = false;
  };

  GameObject.prototype.allowCamera = function() {
    return this.cameraControl = true;
  };

  return GameObject;

})();

_Image = (function(superClass) {
  extend(_Image, superClass);

  _Image.prototype.width = 0;

  _Image.prototype.height = 0;

  _Image.prototype.source = null;

  function _Image(img, x, y, w, h) {
    _Image.__super__.constructor.call(this, '_Image', x, y);
    this.source = img;
    if (arguments.length === 3) {
      this.width = img.width;
      this.height = img.height;
    } else if (arguments.length === 5) {
      this.width = w;
      this.height = h;
    }
  }

  _Image.prototype.draw = function() {
    return system.context.drawImage(this.source, this.x, this.y, this.width, this.height);
  };

  _Image.prototype.resize = function(d) {
    var old;
    old = {};
    old.width = this.width;
    old.height = this.height;
    this.width *= d;
    this.height *= d;
    return old;
  };

  _Image.prototype.create = function() {
    return new _Image(this.source, this.x, this.y, this.width, this.height);
  };

  return _Image;

})(GameObject);

Sprite = (function(superClass) {
  extend(Sprite, superClass);

  function Sprite(img, x, y, type1, fn, w, h) {
    this.type = type1;
    if (arguments.length === 7) {
      Sprite.__super__.constructor.call(this, img, x, y, w, h);
    } else {
      suped(img, x, y);
    }
    this.frameNumber = fn;
    this.currentIndex = 0;
    if (this.type === 'v') {
      this.dwidth = this.width;
      this.dheight = this.height / fn;
    } else if (this.type === 'h') {
      this.dwidth = this.width / fn;
      this.dheight = this.height;
    }
  }

  Sprite.prototype.draw = function() {
    if (this.type === 'v') {
      system.context.drawImage(this.source, 0, this.dheight * this.currentIndex, this.dwidth, this.dheight, this.x, this.y, this.width, this.height);
    } else if (this.type === 'h') {
      system.context.drawImage(this.source, this.dwidth * this.currentIndex, 0, this.dwidth, this.dheight, this.x, this.y, this.width, this.height);
    }
    return this.currentIndex += this.currentIndex >= this.frameNumber ? -this.currentIndex : 1;
  };

  Sprite.prototype.create = function() {
    return new Sprite(this.source, this.x, this.y, this.type, this.frameNumber, this.width, this.height);
  };

  return Sprite;

})(_Image);

TileSprite = (function(superClass) {
  extend(TileSprite, superClass);

  function TileSprite(ts, dx1, dy1, dwidth1, dheight1, type1, fn) {
    this.dx = dx1;
    this.dy = dy1;
    this.dwidth = dwidth1;
    this.dheight = dheight1;
    this.type = type1;
    TileSprite.__super__.constructor.call(this, ts.source, ts.x, ts.y, this.dwidth, this.dheight);
    this.frameLength = fn;
    this.currentIndex = 0;
  }

  TileSprite.prototype.draw = function() {
    if (this.type === 'v') {
      system.context.drawImage(this.source, this.dx, this.dy + this.dheight * this.currentIndex, this.dwidth, this.dheight, this.x, this.y, this.width, this.height);
    } else if (this.type === 'h') {
      system.context.drawImage(this.source, this.dx + this.dwidth * this.currentIndex, this.dy, this.dwidth, this.dheight, this.x, this.y, this.width, this.height);
    }
    return this.currentIndex += this.currentIndex >= this.frameNumber ? -this.currentIndex : 1;
  };

  TileSprite.prototype.create = function() {
    var src;
    src = {};
    src.source = this.source;
    src.x = this.x;
    src.y = this.y;
    return new TileSprite(src, this.dx, this.dy, this.dwidth, this.dheight, this.type, this.frameNumber);
  };

  return TileSprite;

})(_Image);

Tile = (function(superClass) {
  extend(Tile, superClass);

  function Tile(ts, dx1, dy1, dwidth1, dheight1) {
    this.dx = dx1;
    this.dy = dy1;
    this.dwidth = dwidth1;
    this.dheight = dheight1;
    Tile.__super__.constructor.call(this, ts.source, ts.x, ts.y, this.dwidth, this.dheight);
  }

  Tile.prototype.draw = function() {
    return system.context.drawImage(this.source, this.dx, this.dy, this.dwidth, this.dheight, this.x, this.y, this.width, this.height);
  };

  Tile.prototype.create = function() {
    var src, tile;
    src = {};
    src.source = this.source;
    src.x = this.x;
    src.y = this.y;
    tile = new Tile(src, this.dx, this.dy, this.dwidth, this.dheight);
    tile.width = this.width;
    tile.height = this.height;
    return tile;
  };

  return Tile;

})(_Image);

TileSet = (function(superClass) {
  extend(TileSet, superClass);

  function TileSet() {
    return TileSet.__super__.constructor.apply(this, arguments);
  }

  TileSet.prototype.createTile = function(dx, dy, dwidth, dheight) {
    return new Tile(this, dx, dy, dwidth, dheight);
  };

  TileSet.prototype.createSprite = function(dx, dy, dwidth, dheight, type, fn) {
    return new TileSprite(this, dx, dy, dwidth, dheight, type, fn);
  };

  return TileSet;

})(_Image);

system.createDrawableObject = function(obj, init, draw) {
  return new DrawableObject(obj, init, draw);
};

system.createInterface = function(name, obj, init, On, display, Off) {
  return new GameInterface(name, obj, init, On, display, Off);
};

system.getInterface = function(name) {
  return system.data.interfaces[name];
};

system.createLevel = function(obj, init, start, display, end) {
  return new GameLevel(obj, init, start, display, end);
};

system.getLevel = function(index) {
  return system.data.levels[index];
};

system.setContext = function(ref) {
  return system.data.context = ref;
};

system.createEvent = function(type, handler, bo, cap) {
  return new _Event(type, handler, bo, cap);
};

system.emulate = function(name, delay) {
  var interf;
  interf = system.getInterface(name);
  interf.on();
  return setTimeout(function() {
    return interf.off();
  }, delay);
};
