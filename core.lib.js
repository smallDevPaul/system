
/*
	product:System.coffee core
	author:Poul Shults
	license:GNU General
	copyright:©2016-2017
 */
var system,
  slice = [].slice;

Object.prototype.extend = function(obj) {
  var prop;
  for (prop in obj) {
    this[prop] = obj[prop];
  }
  return this;
};

system = {
  canvas: {},
  context: {},
  width: 0,
  height: 0,
  readyState: 0,
  data: {
    dir: '',
    background: null,
    drawer: function() {
      return null;
    },
    A_drawers: {},
    inter_char: '$',
    split_char: ' ',
    event: {},
    global: {},
    sizing_mode: null,
    requestFrame: null
  },
  beforeLoad: function() {
    return null;
  },
  afterLoad: function() {
    return null;
  },
  init: function(id) {
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext('2d');
    return this.data.requestFrame = window.requestAnimationFrame != null ? function(func) {
      return requestAnimationFrame(func);
    } : window.webkitRequestAnimationFrame != null ? function(func) {
      return webkitRequestAnimationFrame(func);
    } : function(func) {
      var cb;
      return (cb = function() {
        func();
        return setTimeout(cb, 100 / 6);
      })();
    };
  },
  initMainLoop: function() {
    var ad, func;
    ad = system.data.A_drawers;
    func = function() {
      var drawer;
      system.context.clearRect(0, 0, system.width, system.height);
      if (system.data.background) {
        system.data.background();
      }
      system.data.drawer();
      for (drawer in system.data.A_drawers) {
        if (ad[drawer].clousure != null) {
          ad[drawer].clousure();
        }
      }
      return system.data.requestFrame(func);
    };
    return func();
  },
  initSizingMode: function(w, h) {
    var cb;
    if (arguments.length === 0) {
      system.data.sizing_mode = 'resizable';
      cb = function() {
        system.width = system.canvas.width = window.innerWidth;
        return system.height = system.canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', cb);
      return cb();
    } else {
      system.width = system.canvas.width = w;
      system.height = system.canvas.height = h;
      return system.data.sizing_mode = 'static';
    }
  },
  initMouseControl: function() {
    system.mouse = {
      x: 0,
      y: 0
    };
    return system.canvas.addEventListener('mousemove', function(e) {
      system.mouse.x = e.pageX;
      return system.mouse.y = e.pageY;
    });
  },
  initLoading: function(obj, req_aud_t) {
    var loadA, loadI, step;
    system.beforeLoad();
    if (obj === document || (obj == null)) {
      system.readyState = 1;
      return system.afterLoad();
    } else {
      step = 0;
      system.resources = {};
      loadI = function(images, cb) {
        var all, i, load, till;
        i = 0;
        till = images.length - 1;
        all = [];
        load = function(path) {
          var img;
          img = new Image();
          all.push(img);
          img.onload = i < till ? function() {
            system.readyState += step;
            return load(images[++i]);
          } : function() {
            system.readyState += step;
            system.resources.images = all;
            return cb();
          };
          img.src = system.data.dir + path;
          return img;
        };
        return load(images[i]);
      };
      loadA = function(audio, cb) {
        var all, i, load, till;
        i = 0;
        till = audio.length - 1;
        all = [];
        load = function(path) {
          var aud, aud_t;
          aud = new Audio();
          if (req_aud_t === 255) {
            aud_t = new Audio_t();
            aud_t.imply(aud);
            all.push(aud_t);
          } else {
            all.push(aud);
          }
          aud.oncanplay = i < till ? function() {
            system.readyState += step;
            load(audio[++i]);
            return aud.oncanplay = function() {};
          } : function() {
            system.readyState += step;
            system.resources.audio = all;
            aud.oncanplay = function() {};
            return cb();
          };
          aud.src = system.data.dir + path;
          return aud;
        };
        return load(audio[i]);
      };
      if ((obj.images != null) && (obj.audio != null)) {
        step = 1 / (obj.images.length + obj.audio.length);
        return loadI(obj.images, function() {
          return loadA(obj.audio, function() {
            system.readyState = 1;
            return system.afterLoad();
          });
        });
      } else if (obj.images != null) {
        step = 1 / obj.images.length;
        return loadI(obj.images, function() {
          system.readyState = 1;
          return system.afterLoad();
        });
      } else if (obj.audio != null) {
        step = 1 / obj.audio.length;
        return loadA(obj.audio, function() {
          system.readyState = 1;
          return system.afterLoad();
        });
      } else {
        system.readyState = 1;
        return system.afterLoad();
      }
    }
  },
  interpolate: function() {
    var arg, args, char, i, ic, j, len, str;
    str = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    i = 0;
    ic = system.data.inter_char;
    for (j = 0, len = str.length; j < len; j++) {
      char = str[j];
      if (char === ic) {
        arg = args[i];
        str = str.replace(ic + i, args[i]);
        i++;
      }
    }
    return str;
  },
  getGlobal: function(name) {
    return this.data.global[name];
  },
  defineGlobal: function(name, v) {
    return this.data.global[name] = v;
  },
  removeGlobal: function(name) {
    if (this.data.global[name]) {
      return delete this.data.global[name];
    }
  },
  removeDrawer: function(name) {
    return delete system.data.A_drawers[name];
  },
  addDrawer: function(name, handler) {
    return system.data.A_drawers[name] = {
      name: name,
      clousure: handler
    };
  },
  direct: function(dirent) {
    system.data.dir = dirent + '/';
    return system.data.dir;
  },
  once: function(ev, handler) {
    if (ev.match(/key/gi || ev === 'resize' || ev === 'mousewheel')) {
      return window.on[ev] = handler;
    } else {
      return this.canvas.on[ev] = handler;
    }
  },
  stop: function(ev) {
    return this.once(ev, null);
  },
  path: function(cds) {
    var cdarr, cmd, j, len;
    if (arguments.length > 1) {
      cds = system.interpolate.apply(system, arguments);
    }
    cds.replace(/\s+/gi, ' ');
    cdarr = cds.split(this.data.split_char);
    for (j = 0, len = cdarr.length; j < len; j++) {
      cmd = cdarr[j];
      this.call(cmd);
    }
    return this;
  },
  setBackground: function(bgr, pref) {
    if (bgr.substring != null) {
      this.data.background = function() {
        system.context.fillStyle = bgr;
        return system.context.fillRect(0, 0, system.width, system.height);
      };
      return 'color background';
    } else if (bgr.src != null) {
      this.data.background = function() {
        var ds;
        ds = pref === 'h' ? system.width / bgr.width : pref === 'v' ? system.height / bgr.height : 1;
        return system.context.drawImage(bgr, 0, 0, system.width, system.height);
      };
      return 'image background';
    } else if (bgr.source != null) {
      this.data.background = function() {
        return bgr.draw();
      };
      return '_Image backround';
    } else {
      return 'no background';
    }
  },
  'off': function(event) {
    var i, l;
    system.data.event[event.type].splice(event.index, 1);
    i = event.index;
    l = system.data.event[event.type].length;
    while (i < l) {
      system.data.event[event.type][i].index--;
      i++;
    }
    if (event.type === 'mousewheel' || event.type.match(/key/gi)) {
      return window.removeEventListener(event.type, event.handler);
    } else {
      return this.canvas.removeEventListener(event.type, event.handler);
    }
  },
  set: function(p, v) {
    this.context[p] = v;
    return this;
  },
  call: function(cmd) {
    var c, val;
    val = cmd.substring(2, cmd.length - 1);
    val = val.split(',');
    c = cmd[0];
    if (c === 'M') {
      return this.context.moveTo(val[0], val[1]);
    } else if (c === 'L') {
      return this.context.lineTo(val[0], val[1]);
    } else if (c === 'A') {
      return this.context.arc(val[0], val[1], val[2], val[3], val[4], !!(parseInt(val[5])));
    } else if (c === 'F') {
      return this.context.fill();
    } else if (c === 'S') {
      return this.context.stroke();
    } else if (c === 'E') {
      return this.context.closePath();
    } else if (c === 'B') {
      return this.context.beginPath();
    } else if (c === 'C') {
      return this.context.arc(val[0], val[1], val[2], 0, Math.PI * 2, false);
    } else if (c === 'R') {
      return this.context.rect(val[0], val[1], val[2], val[3]);
    } else if (c === 'T') {
      return this.context.quadraticCurveTo(val[0], val[1], val[2], val[3]);
    } else if (c === 'Q') {
      return this.context.bezierCurveTo(val[0], val[1], val[2], val[3], val[4], val[5]);
    }
  },
  'on': function(e, h, c) {
    var event;
    c = !!c;
    if (this.data.event[e] == null) {
      this.data.event[e] = [];
    }
    event = {
      type: e,
      handler: h,
      capture: c,
      index: system.data.event[e].length
    };
    this.data.event[e].push(event);
    if (e.match(/key/gi) || e === 'mousewheel') {
      window.addEventListener(e, h, c);
    } else {
      this.canvas.addEventListener(e, h, c);
    }
    return event;
  }
};
