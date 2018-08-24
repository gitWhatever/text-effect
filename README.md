# text-effect
`
textillate纯js实现版本，提供了lettering(文字分离)和textillate(文字动画)两种功能。
`

实际效果可参考textillate的[官网](http://textillate.js.org/)

## 兼容性
IE8+

## Usage
basic markup:

```html
<h1 class="tlt">My Title</h1>
```

```js
new TextEffect('.tlt').textillate();
or
new TextEffect(document.querySelector('.tlt')).textillate();
```

if you just want to use lettring function,proveide a static function for you to use

```js
TextEffect.lettring('.tlt');
```

## Dependencies
only [animate.css](https://github.com/daneden/animate.css)

## Options
```
new TextEffect('.tlt').textillate({
  // the default selector to use when detecting multiple texts to animate
  selector: '.texts',

  // enable looping
  loop: false,

  // sets the minimum display time for each text before it is replaced
  minDisplayTime: 2000,

  // sets the initial delay before starting the animation
  // (note that depending on the in effect you may need to manually apply
  // visibility: hidden to the element before running this plugin)
  initialDelay: 0,

  // set whether or not to automatically start animating
  autoStart: true,

  // custom set of 'in' effects. This effects whether or not the
  // character is shown/hidden before or after an animation
  inEffects: [],

  // custom set of 'out' effects
  outEffects: [ 'hinge' ],

  // in animation settings
  in: {
  	// set the effect name
    effect: 'fadeInLeftBig',

    // set the delay factor applied to each consecutive character
    delayScale: 1.5,

    // set the delay between each character
    delay: 50,

    // set to true to animate all the characters at the same time
    sync: false,

    // randomize the character sequence
    // (note that shuffle doesn't make sense with sync = true)
    shuffle: false,

    // reverse the character sequence
    // (note that reverse doesn't make sense with sync = true)
    reverse: false,

    // callback that executes once the animation has finished
    callback: function () {}
  },

  // out animation settings.
  out: {
    effect: 'hinge',
    delayScale: 1.5,
    delay: 50,
    sync: false,
    shuffle: false,
    reverse: false,
    callback: function () {}
  },

  // callback that executes once textillate has finished
  callback: function () {},

  // set the type of token to animate (available types: 'char' and 'word')
  type: 'char'
});
```

## Events
触发事件类型跟textillate相同，只是有的事件名称不同:

* `effectStart` - triggered when textillate starts
* `inAnimationBegin` - triggered when the in animation begins
* `inAnimationEnd` - triggered when the in animation ends
* `outAnimationBegin` - triggered when the out animation begins
* `outAnimationEnd` - triggered when the out animation ends
* `effectFinish` - triggered when textillate ends

text-effct的调用方式稍有不同，事件监听没有绑定在元素上，用户通过effect实例去监听事件。

```js
var te = new TextEffect('.tlt').textillate();
te.on('effectStart', function() {
    console.log('文字效果开始了');
})
```

## Methods
```js
var te = new TextEffect('.tlt').textillate();
```
* `te.textillate('start')` - Manually start/restart textillate
* `te.textillate('stop')` - Manually pause/stop textillate
* `te.textillate('setOption')` - change the current text's option
* `te.textillate('init')`

## Example

实际的调用方式可以参考目录example/
