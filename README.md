# text-effect
```
textillate纯js实现版本，包括lettering(文字分离)和textillate(文字动画)的功能。
```
## Usage
basic markup:

```html
<h1 class="tlt">My Title</h1>
```


```js
const tlt = document.querySelector('.tlt');
new TextEffect(tlt).textillate();
```

if you want to use lettring function,proveide a static function for you to use

```js
const tlt = document.querySelector('.tlt');
TextEffect.lettring(tlt);
```

## Dependencies
only [animate.css](https://github.com/daneden/animate.css)