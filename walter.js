/**
 * Walter
 * Animated image sequences
 *
 * @author https://github.com/woodscreative
 */
function Walter($config)
{
  // object - public configuration
  this.config = {
    // string - DOM selector 
    selector : '.walter',
    // int - timer delay in ms 
    delay : 100,
    // string - class applied to all frame images
    classFrameImage : 'walter__image',
    // string - class applied to only the active frame
    classFrameActive : 'walter__image--is-active'
  };
  // Merge configuraiton objects
  if ($config)
  {
  	for (var prop in $config)
  	{
  		if (Object.prototype.hasOwnProperty.call($config, prop))
  		{
  			this.config[prop] = $config[prop];
  		};
  	};
	};
	// object - json loaded from [data-walter] attribute
	this.settings = {};
  // setTimeout
  this.timer = null;
  /**
   * object
   * Registered callbacks
   */
  this.callbacks = {
    // @see init()
    'init' : [],
    // @see updateFrame
    'onChange' : []
  };
  /**
   * Perform callback(s)
   *
   * @param string $hook property of this.callbacks
   * @param mixed $e passed to callback function
   */
  this._callback = function($hook, $e)
  {
    // Pass the hook by default
    if (!$e)
    {
      $e = $hook;
    };
    for (var i=0; i<this.callbacks[$hook].length; i++)
    {
      this.callbacks[$hook][i]($e);
    };
  };
  /**
   * Initialise
   */
  this.init = function()
  {
    this._callback('init');
    var that = this;
    // Find containers for animations and create frames
    var els = document.querySelectorAll(this.config.selector);
    for (var i=0; i<els.length; i++)
    {
      var el = els[i];
      el.settings = JSON.parse(el.getAttribute('data-walter'));
      // Create an arbitrary method to retrieve settings for convenience
      el.getSettings = function()
      {
        return this.settings;
      };
      this.createFrames(el);
      this.updateFrame(el, 0);
    };
    // Start animations
    this.start();
    // Find controls
    var els = document.querySelectorAll('[data-walter-control]');
    for (var i=0; i<els.length; i++)
    {
      var el = els[i];
      el.onclick = function()
      {
        var control = JSON.parse(this.getAttribute('data-walter-control'));
        switch (control.action)
        {
          case "start":
            that.start();
          break;
          case "stop":
            console.log('stop');
            that.stop();
          break;
        };
      };
    };
  };
  /**
   * Create image frames
   *
   * @param object DOM element to create frame in
   */
  this.createFrames = function($el)
  {
    var first = 0;
    var settings = $el.getSettings();
    for (var i=0; i<settings.frames.length; i++)
    {
      var src = settings.frames[i];
      var image = document.createElement('img');
      image.setAttribute('data-walter-index', i);
      image.classList.add(this.config.classFrameImage);
      if (i == first)
      {
        image.classList.add(this.config.classFrameActive);
      };
      image.src = src;
      $el.appendChild(image); 
    };
  };
  /**
   * Update image frame
   *
   * @param object DOM element to update frame in
   * @param int $i index of settings.frames[$i]
   */
  this.updateFrame = function($el, $i)
  {
    // The new frame image
    var settings = $el.getSettings();
    // check within range
    if ($i >= settings.frames.length)
    {
      $i = 0;
    };
    var frame = settings.frames[$i];
    // Old selected frame
    var oldFrameImage = $el.querySelector('.'+this.config.classFrameActive);
    oldFrameImage.classList.remove(this.config.classFrameActive);
    // New selected frame
    var images = $el.querySelectorAll('.'+this.config.classFrameImage);
    var newFrameImage = images[$i];
    images[$i].classList.add(this.config.classFrameActive);
    settings.current = $i;
    this._callback('onChange');
  };
  /**
   * Start timer
   */
  this.start = function()
  {
    this.stop();
    var that = this;
    this.timer = setTimeout(
      function() {
        //console.log('update');
        var els = document.querySelectorAll(that.config.selector);
        for (var i=0; i<els.length; i++)
        {
          var el = els[i];
          that.updateFrame(el, el.settings.current+1);
        };
        that.start();
      },
      this.config.delay
    );
  };
  /**
   * Stop timer
   */
  this.stop = function()
  {
    clearTimeout(this.timer);
  };
  /**
   * Set callback
   *
   * @param string $hook property of this.callbacks
   * @param function $f callback function
   */
  this.setCallback = function($hook, $f)
  {
    this.callbacks[$hook].push($f);
  };
  /**
   * Get animation
   * a convenience method to access animations in the DOM
   *
   * @param string query selector to find animation in the DOM
   * @return object with methods to access animation data/setting etc
   */
  this.get = function($selector)
  {
    var anim = document.querySelector($selector);
    return new this._Animation(anim);
  };
  /**
   * Constructor for get()
   * @see get()
   */
  this._Animation = function($anim)
  {
    // reference to DOM element
    this.me = $anim;
    // @return string URL of current active frame
    this.getActiveFrameSrc = function()
    {
      if (!this.me.hasOwnProperty('settings'))
      {
        return;
      };
      var settings = this.me.settings;
      return settings.frames[settings.current];
    };
    // @return int the current frame index
    this.getCurrentFrame = function()
    {
      if (!this.me.hasOwnProperty('settings'))
      {
        return;
      };
      var settings = this.me.settings;
      return settings.current;
    };
    // @return object the settings
    this.getSettings = function()
    {
      if (!this.me.hasOwnProperty('settings'))
      {
        return;
      };
      return this.me.settings;
    };
  };
}