[![Build Status][travis-img]][travis-url]
[![Coverage Status][coveralls-img]][coveralls-url]
![Dev Dependencies][david-img]

# warp.js

Warp, distort, bend, twist and smudge your scalable vector graphics in real time. `warp.js` allows you to feed in any
SVG file and apply any kind of complex transformation.

## Quick example

```js
const svg = document.getElementById('svg-element')
const warp = new Warp(svg)

warp.interpolate(5)
warp.transform(([x, y]) => [x, y + 10 * Math.sin(x)])
```
[Run on CodePen &rarr;](http://codepen.io/benjamminf/pen/NpZLeb)

This example creates a wave effect. Try playing with the values to see how it works.

## API

### transform(transformer)

### interpolate(threshold)

### extrapolate(threshold)

### preInterpolate(transformer, threshold)

### preExtrapolate(transformer, threshold)

### update()


[travis-url]: https://travis-ci.org/benjamminf/warpjs
[travis-img]: https://img.shields.io/travis/benjamminf/warpjs.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/benjamminf/warpjs?branch=master
[coveralls-img]: https://img.shields.io/coveralls/benjamminf/warpjs.svg?style=flat-square
[david-img]: https://img.shields.io/david/dev/benjamminf/warpjs.svg?style=flat-square
