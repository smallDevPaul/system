var Audio_t, REQUIRE_AUDIO_TYPE, STD_APPEND, STD_AUDIO;

STD_APPEND = document.body;

REQUIRE_AUDIO_TYPE = 255;

STD_AUDIO = 0;

Audio_t = (function() {
  function Audio_t() {
    this.audio = new Audio();
    this.loaded = false;
  }

  Audio_t.prototype.load = function(path, onload, appendIn) {
    var listener;
    listener = (function(_this) {
      return function() {
        _this.loaded = true;
        if (onload != null) {
          onload(_this);
        }
        return _this.audio.removeEventListener('canplay', listener, false);
      };
    })(this);
    this.audio.addEventListener('canplay', listener, false);
    if (appendIn != null) {
      appendIn.appendChild(this.audio);
    }
    return this.audio.src = path;
  };

  Audio_t.prototype.play = function(from) {
    if (this.loaded) {
      if (from != null) {
        this.audio.currentTime = from;
      }
      return this.audio.play();
    }
  };

  Audio_t.prototype.pause = function() {
    if (this.loaded) {
      return this.audio.pause();
    }
  };

  Audio_t.prototype.end = function() {
    if (this.loaded) {
      this.audio.pause();
      this.audio.currentTime = 0;
      true;
    }
    return false;
  };

  Audio_t.prototype.imply = function(audio) {
    if (audio != null) {
      this.audio = audio;
      return this.loaded = true;
    }
  };

  Audio_t.prototype.attr = function(name, value) {
    if (this.loaded) {
      if (value != null) {
        this.audio[name] = value;
      }
      return this.audio[name];
    }
  };

  Audio_t.prototype.replay = function() {
    return this.play(0);
  };

  return Audio_t;

})();
