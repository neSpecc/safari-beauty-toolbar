/**
 * Safari Beauty Toolbar
 * {@link https://github.com/neSpecc/safari-beauty-toolbar}
 *
 * Make the Safari Toolbar more consistent with your brand colors.
 * Works only on the MacOS, Safari browser that has native toolbar's opacity
 *
 *
 * @author Petr Savchenko <specc.dev@gmail.com>
 * @see CodeX - team of enthusiasts developers unifying students and graduates of the ITMO University {@link https://ifmo.su}
 * @license MIT
 * @preserve
 */
var SBToolbar = /** @class */ (function () {
    /**
     * @constructor
     * @param options
     */
    function SBToolbar(options) {
        /**
         * Initialization state
         * @type {boolean}
         */
        this.initialized = false;
        /**
         * Index of color-list for the animation process
         * @type {number}
         */
        this.currentColorIndex = 0;
        if (!options || !options.color) {
            this.log("«color» option is missed");
            return;
        }
        this.color = options.color;
        /**
         * Check for support and initialize the Toolbar liner
         */
        this.init();
    }
    /**
     * Destroys the underlayer
     */
    SBToolbar.prototype.destroy = function () {
        if (!this.initialized) {
            return;
        }
        this.stopAnimation();
        this.stopBlinking();
        this.underlayer.remove();
        this.underlayer = null;
        this.color = null;
        this.initialized = false;
    };
    /**
     * Reinitialize the Toolbar liner
     * @param {ISBTConfig} [options] - you can reinitialize module with the different settings
     */
    SBToolbar.prototype.reinit = function (options) {
        this.destroy();
        if (options && options.color) {
            this.color = options.color;
        }
        /**
         * Check for support and initialize the Toolbar liner
         */
        this.init();
    };
    /**
     * Start blinking process;
     * @param {IBlinkingParams} params - supported blinking options
     * @param {number} params.interval - blinking interval, default is 400
     * @param {number} params.transitionSpeed - speed of opacity changing, default is 500
     */
    SBToolbar.prototype.blink = function (params) {
        var _this = this;
        if (params === void 0) { params = { interval: 400, transitionSpeed: 500 }; }
        if (!this.initialized) {
            this.log("Module was not initialized");
            return;
        }
        /**
         * Stop all previously fired animations
         */
        this.stopAllEffects();
        this.underlayer.style["will-change"] = "opacity";
        if (!isNaN(params.transitionSpeed)) {
            this.underlayer.style.transition = "opacity " + params.transitionSpeed + "ms ease";
        }
        else {
            this.log("transitionSpeed must be a number");
        }
        this.blinkingInterval = setInterval(function () {
            if (_this.underlayer.style.opacity === "1") {
                _this.underlayer.style.opacity = "0";
            }
            else {
                _this.underlayer.style.opacity = "1";
            }
        }, params.interval);
    };
    /**
     * Start changing colors animatedly
     */
    SBToolbar.prototype.animate = function (params) {
        var _this = this;
        if (!this.initialized) {
            this.log("Module was not initialized");
            return;
        }
        if (!params || !params.colors) {
            this.log("Missed required parameter «colors» (array of strings) for the animation");
            return;
        }
        /**
         * Stop all previously fired animations
         */
        this.stopAllEffects();
        this.underlayer.style["will-change"] = "background-color";
        var speed = 800;
        if (params && params.speed && !isNaN(params.speed)) {
            speed = params.speed;
        }
        this.underlayer.style.transition = "background-color " + Math.floor(speed / 1.1) + "ms ease";
        this.animationInterval = setInterval(function () {
            _this.underlayer.style.backgroundColor = params.colors[_this.currentColorIndex];
            _this.currentColorIndex++;
            if (_this.currentColorIndex > params.colors.length) {
                _this.currentColorIndex = 0;
            }
        }, speed);
    };
    /**
     * Show progress bar animation at the toolbar
     * @param {string} [color] - bar color. Blue by default
     * @param {string} [estimate] - estimate loading time in milliseconds. Uses as the animation speed.
     */
    SBToolbar.prototype.startProgress = function (_a) {
        var _this = this;
        var _b = _a.color, color = _b === void 0 ? "#05c7ff" : _b, _c = _a.estimate, estimate = _c === void 0 ? 3500 : _c;
        if (!this.initialized) {
            this.log("Module was not initialized");
            return;
        }
        this.stopAnimation();
        this.stopBlinking();
        this.underlayer.style.transition = "none";
        this.underlayer.style.width = "0";
        this.underlayer.style.transition = "width " + estimate + "ms cubic-bezier(.12,.63,.81,.44)";
        this.underlayer.style.backgroundColor = color;
        setTimeout(function () {
            _this.underlayer.style.width = "90%";
        }, 100);
    };
    /**
     * Finish progressbar animation
     */
    SBToolbar.prototype.stopProgress = function () {
        var _this = this;
        this.underlayer.style.width = "100%";
        setTimeout(function () {
            _this.underlayer.style.width = "auto";
        }, 200);
    };
    /**
     * Stop the blinking process
     */
    SBToolbar.prototype.stopBlinking = function () {
        if (this.initialized && this.blinkingInterval) {
            clearTimeout(this.blinkingInterval);
            this.blinkingInterval = null;
            this.underlayer.style.opacity = "1";
        }
    };
    /**
     * Stop the animation process
     */
    SBToolbar.prototype.stopAnimation = function () {
        if (this.initialized && this.animationInterval) {
            clearTimeout(this.animationInterval);
            this.animationInterval = null;
            this.currentColorIndex = 0;
            this.underlayer.style.backgroundColor = this.color;
        }
    };
    /**
     * Stop all animations
     */
    SBToolbar.prototype.stopAllEffects = function () {
        this.stopAnimation();
        this.stopBlinking();
        this.stopProgress();
    };
    /**
     * Initialize the Toolbar
     */
    SBToolbar.prototype.init = function () {
        if (!SBToolbar.supported) {
            this.log("Module is not supported by current platform");
            return;
        }
        /**
         * Append the Underlayer
         * @type {Element}
         */
        this.underlayer = this.make();
        /**
         * Toggle initialization state
         * @type {boolean}
         */
        this.initialized = true;
    };
    Object.defineProperty(SBToolbar, "supported", {
        /**
         * Detect when module can be used
         * @return {boolean}
         */
        get: function () {
            return SBToolbar.isSafari && (SBToolbar.isMac || SBToolbar.isIOS);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SBToolbar, "isMac", {
        /**
         * Check if current platform is the Mac
         * @return {boolean}
         */
        get: function () {
            return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SBToolbar, "isIOS", {
        /**
         * Check if current platform is the IOS
         * @return {boolean}
         */
        get: function () {
            return !!navigator.platform.match(/(iPhone|iPod|iPad)/i);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SBToolbar, "isSafari", {
        /**
         * Check if current browser is a Safari
         * @return {boolean}
         */
        get: function () {
            return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Write log to the Console
     * @param {string} output
     */
    SBToolbar.prototype.log = function (output) {
        var style = "color: #047ec6;\n                  font-size: 11.8px;\n                  letter-spacing: 3px;\n                  border: 1px solid #047ec6;\n                  border-radius: 3px;\n                  display: inline-block;\n                  padding: 1px 3px;\n                  margin-right: 5px";
        if (window.console) {
            window.console.log("%cSBToolbar" + "%c" + output, style, "");
        }
    };
    /**
     * Make the underlayer and append to the DOM
     * @return {HTMLElement}
     */
    SBToolbar.prototype.make = function () {
        var liner = document.createElement("div");
        liner.style.position = "fixed";
        liner.style.top = "0";
        liner.style.left = "0";
        liner.style.right = "0";
        liner.style.height = "100px";
        liner.style.transform = "translateY(-99.99%)";
        liner.style.zIndex = "9999";
        liner.style.backgroundColor = this.color;
        liner.setAttribute("name", "safari-colorful-toolbar");
        document.body.appendChild(liner);
        return liner;
    };
    /**
     * Current revision number
     */
    SBToolbar.version = "1.0.0";
    return SBToolbar;
}());
