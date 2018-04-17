/**
 * Example module wrapper
 * @author Petr Savchenko <specc.dev@gmail.com>
 * @see {@link https://ifmo.su/beauty-toolbar}
 *
 * ƪ(˘⌣˘)ʃ
 */
'use strict';

var demo = function (demo) {

  /**
   * Toolbar class instance
   * @type {SBToolbar|null}
   */
  var toolbarPane = null;

  /**
   * Example module initialization
   */
  demo.init = function () {

    var demoContainer = document.getElementById('js-demo');

    if (!demo.supported){
      return;
    }

    demoContainer.hidden = false;


    /**
     * Set the Toolbar to Blue
     */
    toolbarPane = new SBToolbar({
      color: "#0591ff"
    });

  };

  /**
   * Example of animation calling
   */
  demo.animate = function (button) {

    resetButtons(button);

    if (!button.classList.toggle('toggled')){

      toolbarPane.stopAnimation();

      button.textContent = button.dataset.startText;

    } else {

      toolbarPane.animate({
        colors: ["rgb(255, 10, 138)", "blue", "#61ffa7", "#ffeb9c"],
        speed: 600
      });

      button.dataset.startText = button.textContent;
      button.textContent = 'Stop this';

    }

  };


  /**
   * Example of blink calling
   */
  demo.blink = function (button) {

    resetButtons(button);

    if (!button.classList.toggle('toggled')){

      toolbarPane.stopBlinking();

      button.textContent = button.dataset.startText;

    } else {

      toolbarPane.blink({
        interval: 300,
        transitionSpeed: 500
      });

      button.dataset.startText = button.textContent;
      button.textContent = 'Stop Blinking';

    }
  };

  /**
   * Example of progress calling
   */
  demo.progress = function (button) {

    resetButtons(button);

    if (button.classList.contains('toggled')){
      return;
    }

    /**
     * Call before the process (for example, AJAX request)
     */
    toolbarPane.startProgress({
      color: "#05c7ff",
      estimate: 3500
    });

    button.classList.add('toggled');

    /**
     * Call after the process will be finished
     * We use the timeout for the demonstration
     */
    setTimeout(function(){
      toolbarPane.stopProgress();

      button.classList.remove('toggled');
    }, 4850);

  };

  /**
   * Changes Toolbar color
   * @param {string} color - new Toolbar's  color
   */
  demo.reset = function (color) {

    var colorValueHolder = document.getElementById('js-color-value');

    colorValueHolder.textContent = '"' + color + '"';

    toolbarPane.reinit({
      color: color
    });
  };

  /**
   * Reset activated button
   * @param {HTMLElement} elToSkip - current clicked button
   */
  function resetButtons(elToSkip) {
    var buttons = document.querySelectorAll('.toggled');

    if (!buttons.length){
      return;
    }

    Array.prototype.slice.call(buttons).forEach(function (button) {
      if (button === elToSkip){
        return;
      }
      button.classList.remove('toggled');
      button.textContent = button.dataset.startText || button.textContent;
    });
  }

  /**
   * Detect when module can be used
   * @return {boolean}
   */
  demo.supported = function(){
    return isSafari() && (isMac() || isIOS());
  }();

  /**
   * Check if current platform is the Mac
   * @return {boolean}
   */
  function isMac() {
    return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  }

  /**
   * Check if current platform is the IOS
   * @return {boolean}
   */
  function isIOS() {
    return !!navigator.platform.match(/(iPhone|iPod|iPad)/i);
  }

  /**
   * Check if current browser is a Safari
   * @return {boolean}
   */
  function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  return demo;

}({});


/**
 * Simple rotator for the screenshots
 * @author Petr Savchenko <specc.dev@gmail.com>
 * @see {@link https://ifmo.su/beauty-toolbar}
 */
/**
 * @constructor
 * @param {string} sel - items' selector
 */
var Rotator = function (sel) {

  /**
   * Find all items
   * @type {NodeListOf<Element>}
   */
  this.items = document.querySelectorAll('.' + sel);

  /**
   * BEM modifiers map
   * @type {{main: string, last: string, first: string}}
   */
  this.css = {
    main: sel + '--main',
    last: sel + '--last',
    first: sel + '--first'
  };

  /**
   * Find current main item
   * @type {Element | null}
   */
  this.current = document.querySelector('.' + this.css.main);
  this.currentIndex = Array.prototype.indexOf.call(this.current.parentNode.children, this.current);

  for (var i = 0; i < this.items.length; i++){
    this.items[i].addEventListener('click', itemClicked.bind(this));
  }

  /**
   * Item click listener: pass clicked item to the 'set' method
   * @param event
   */
  function itemClicked (event) {
    var clicked = event.target;
    var clickedIndex = Array.prototype.indexOf.call(clicked.parentNode.children, clicked);

    if (clickedIndex === this.currentIndex){
      return;
    }

    this.set(clickedIndex);
  }
};

/**
 * Replace passed item with main item
 * @param {number} index - index of clicked item
 */
Rotator.prototype.set = function (index) {

  var itemToSelect = this.items[index];

  var isFirst = itemToSelect.classList.contains(this.css.first);
  var isLast = itemToSelect.classList.contains(this.css.last);

  if (isFirst) {
    this.current.classList.add(this.css.first);
    itemToSelect.classList.remove(this.css.first);
  } else if (isLast){
    this.current.classList.add(this.css.last);
    itemToSelect.classList.remove(this.css.last);
  }

  this.current.classList.remove(this.css.main);
  itemToSelect.classList.add(this.css.main);

  this.currentIndex = index;
  this.current = itemToSelect;
};

