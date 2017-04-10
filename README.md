[![Build Status][travis-img]][travis-url]
[![Coverage Status][coveralls-img]][coveralls-url]
![Dev Dependencies][david-img]

<img alt="warp.js" src="warp.png" width="246" height="75">

Warp, distort, bend, twist and smudge your scalable vector graphics in the browser. `warp.js` allows you to feed in any
SVG file and apply any kind of complex transformation.

## Installation

Either download `dist/warp.js` from this repository and include it on your page:
```html
<script src="warp.js"></script>
```

Or install through npm:
```
npm install warpjs --save-dev
```

## Basic example

```js
const svg = document.getElementById('svg-element')
const warp = new Warp(svg)

warp.interpolate(4)
warp.transform(([x, y]) => [x, y + 4 * Math.sin(x / 16)])
```
[Run on CodePen &rarr;](http://codepen.io/benjamminf/pen/NpZLeb)

This example creates a wave effect. Try playing with the values to see how it works.

## Animation example

```js
warp.interpolate(4)
warp.transform(([x, y]) => [x, y, y])

let offset = 0
function animate()
{
    warp.transform(([x, y, oy]) => [x, oy + 4 * Math.sin(x / 16 + offset), oy])
    offset += 0.1
    requestAnimationFrame(animate)
}

animate()
```
[Run on CodePen &rarr;](http://codepen.io/benjamminf/pen/oZKBEw)

This example extends the previous by animating the wave. It takes advantage of the fact that points can be extended with additional values/dimensions. The first call to `transform()` doesn't actually perform any transformation – instead it extends the coordinate with a second `y` value. This second value won't actually affect how the SVG's path is rendered, but it can be used in subsequent transformations. When it comes to transforming the path to make the wave effect, the second `y` value is used as an "original position" value when calculating the new `y` position.

Using this concept of extending coordinates, you could use it to store velocity, accelerating, or just about anything.

## API

### `transform(transformer)`
Applies a transformation to all points on the SVG. This method accepts a function for transforming the points in the SVG. The function will be passed a single argument – a coordinate array, with the first two indices containing the `x` and `y` values of that point. The function must return a coordinate array with at least two values, but it may also return more. If more values are returned than what was supplied, then that vector will be extended with those new values, and subsequent calls to `transform()` will supply these new values.

#### Parameters
- `transformer` Function that returns an array of numbers representing the new coordinate

### `interpolate(threshold)`
Intepolates the paths in the SVG with additional points for higher fidelity transformations. It divides each path segment into smaller segments until the size of those segments exceeds the threshold. Extended coordinates (see `transform()`) will have all values interpolated – not just the `x` and `y` pairs.

#### Parameters
- `threshold` The length in which segments will stop interpolation

#### Returns
`boolean` Whether the method interpolated at least one segment

### `extrapolate(threshold)`
Joins path segments together if combining them results in their size being less than or equal to the threshold. Used for improving performance by reducing the number of points in the SVG. It's a lossy algorithm, so expect some quality loss when using.

#### Parameters
- `threshold` The length in which segments will stop extrapolation

#### Returns
`boolean` Whether the method extrapolated at least one segment pair

### `preInterpolate(transformer, threshold)`
Performs interpolation on the current SVG, but uses a transformed version of that SVG to determine how the paths are interpolated. This method is used to ensure that before transformation there will be enough points to work with. It helps prevent cases where quality is lost by the transformer dramatically altering the coordinates.

#### Parameters
- `threshold` The length in which segments will stop interpolation

#### Returns
`boolean` Whether the method interpolated at least one segment

### `preExtrapolate(transformer, threshold)`
Performs extrapolation on the current SVG, but uses a transformed version of that SVG to determine how the paths are extrapolated. This method is used to ensure that before transformation the right segments are joined to minimize quality loss after transformation. 

#### Parameters
- `threshold` The length in which segments will stop extrapolation

#### Returns
`boolean` Whether the method extrapolated at least one segment pair

### `update()`
Updates the SVG elements with the new paths. Usually not necessary to call, as it is done automatically in the `transform()` method.

[travis-url]: https://travis-ci.org/benjamminf/warpjs
[travis-img]: https://img.shields.io/travis/benjamminf/warpjs.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/benjamminf/warpjs?branch=master
[coveralls-img]: https://img.shields.io/coveralls/benjamminf/warpjs.svg?style=flat-square
[david-img]: https://img.shields.io/david/dev/benjamminf/warpjs.svg?style=flat-square
