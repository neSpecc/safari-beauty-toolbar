/**
 * Safari Colorful Toolbar
 *
 * Make the Safari Toolbar more consistent with your brand colors.
 * Works only on the MacOS, Safari browser that has native toolbar's opacity
 *
 * @author Petr Savchenko <specc.dev@gmail.com>
 * @see CodeX - team of enthusiasts developers unifying students and graduates of the ITMO University {@link https://ifmo.su}
 * @licence MIT
 * @preserve
 */

/**
 * Configuration object
 */
interface ISCTConfig {
  /**
   * @type {string} toolbar liner's color;
   */
  color: string;
}

/**
 * Blinking configuration object
 */
interface IBlinkingParams {
  /**
   * Interval for opacity changing
   */
  interval?: number;

  /**
   * Speed of opacity changing
   */
  transitionSpeed?: number;
}

/**
 * Blinking configuration object
 */
interface IAnimationParams {
  /**
   * List of colors to change
   */
  colors?: string[];

  /**
   * Speed of opacity changing
   */
  speed?: number;
}

class SCToolbar {

  /**
   * Current revision number
   */
  public static readonly version: string = "1.0.0";

  /**
   * Initialization state
   * @type {boolean}
   */
  private initialized: boolean = false;

  /**
   * @type {string} underlayer color
   */
  private color: string;

  /**
   * Layer below the Toolbar
   * @type {HTMLElement}
   */
  private underlayer: HTMLElement;

  /**
   * intervalID for the blinking process
   * @type {number}
   */
  private blinkingInterval: number;

  /**
   * intervalID for the animation process
   * @type {number}
   */
  private animationInterval: number;

  /**
   * Index of color-list for the animation process
   * @type {number}
   */
  private currentColorIndex: number = 0;

  /**
   * @constructor
   * @param options
   */
  constructor(options: ISCTConfig) {

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
  public destroy(): void {
    if (!this.initialized) {
      return;
    }

    this.stopAnimation();
    this.stopBlinking();

    this.underlayer.remove();
    this.underlayer = null;
    this.color = null;

    this.initialized = false;
  }

  /**
   * Reinitialize the Toolbar liner
   * @param {ISCTConfig} [options] - you can reinitialize module with the different settings
   */
  public reinit(options: ISCTConfig): void {

    if (options && options.color) {
      this.color = options.color;
    }

    /**
     * Check for support and initialize the Toolbar liner
     */
    this.init();
  }

  /**
   * Start blinking process;
   * @param {IBlinkingParams} params - supported blinking options
   * @param {number} params.interval - blinking interval, default is 400
   * @param {number} params.transitionSpeed - speed of opacity changing, default is 500
   */
  public blink(params: IBlinkingParams = {interval: 400, transitionSpeed: 500}): void {
    if (!this.initialized) {
      this.log("Module was not initialized");
      return;
    }

    /**
     * If animation was fired previously, stop it
     */
    if (this.animationInterval) {
      this.stopAnimation();
    }

    this.underlayer.style["will-change"] = "opacity";

    if (!isNaN(params.transitionSpeed)) {
      this.underlayer.style.transition = `opacity ${params.transitionSpeed}ms ease`;
    } else {
      this.log("transitionSpeed must be a number");
    }

    this.blinkingInterval = setInterval(() => {
      if (this.underlayer.style.opacity === "1") {
        this.underlayer.style.opacity = "0";
      } else {
        this.underlayer.style.opacity = "1";
      }
    }, params.interval);
  }

  /**
   * Start changing colors animatedly
   */
  public animate(params: IAnimationParams): void {
    if (!this.initialized) {
      this.log("Module was not initialized");
      return;
    }

    if (!params || !params.colors) {
      this.log("Missed required parameter «colors» (array of strings) for the animation");
      return;
    }

    /**
     * If blinking was fired previously, stop it
     */
    if (this.blinkingInterval) {
      this.stopBlinking();
    }

    this.underlayer.style["will-change"] = "background-color";

    let speed = 800;

    if (params && params.speed && !isNaN(params.speed)) {
      speed = params.speed;
    }

    this.underlayer.style.transition = `background-color ${speed / 1.1}ms ease`;

    this.animationInterval = setInterval(() => {
      this.currentColorIndex++;

      if (this.currentColorIndex > params.colors.length){
        this.currentColorIndex = 0;
      }

      this.underlayer.style.backgroundColor = params.colors[this.currentColorIndex];;

    }, speed);
  }

  /**
   * Stop the blinking process
   */
  public stopBlinking(): void {
    if (this.initialized && this.blinkingInterval) {
      clearTimeout(this.blinkingInterval);
      this.blinkingInterval = null;
    }
  }

  /**
   * Stop the animation process
   */
  public stopAnimation(): void {
    if (this.initialized && this.animationInterval) {
      clearTimeout(this.animationInterval);
      this.animationInterval = null;
      this.currentColorIndex = 0;
      this.underlayer.style.backgroundColor = this.color;
    }
  }

  /**
   * Initialize the Toolbar
   */
  private init(): void {

    if (!SCToolbar.supported) {
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
  }

  /**
   * Detect when module can be used
   * @return {boolean}
   */
  private static get supported(): boolean {
    return SCToolbar.isSafari && (SCToolbar.isMac || SCToolbar.isIOS);
  }

  /**
   * Check if current platform is the Mac
   * @return {boolean}
   */
  private static get isMac(): boolean {
    return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  }

  /**
   * Check if current platform is the IOS
   * @return {boolean}
   */
  private static get isIOS(): boolean {
    return !!navigator.platform.match(/(iPhone|iPod|iPad)/i);
  }

  /**
   * Check if current browser is a Safari
   * @return {boolean}
   */
  private static get isSafari(): boolean {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  /**
   * Write log to the Console
   * @param {string} output
   */
  private log(output: string): void {
    const style = `color: #047ec6;
                  font-size: 11.8px;
                  letter-spacing: 3px;
                  border: 1px solid #047ec6;
                  border-radius: 3px;
                  display: inline-block;
                  padding: 1px 3px;
                  margin-right: 5px`;

    if (window.console) {
      window.console.log("%cSCToolbar" + "%c" + output, style, "");
    }
  }

  /**
   * Make the underlayer and append to the DOM
   * @return {HTMLElement}
   */
  private make(): HTMLElement {
    const liner = document.createElement("div");

    liner.style.position = "fixed";
    liner.style.top = "0";
    liner.style.left = "0";
    liner.style.right = "0";
    liner.style.height = "100px";
    liner.style.transform = "translateY(-99.99%)";
    liner.style.backgroundColor = this.color;

    document.body.appendChild(liner);

    return liner;
  }
}
