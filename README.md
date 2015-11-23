# dvg.js - *Distortable* Vector Graphics

Distort, warp, bend, twist and smudge your scalable vector graphics in real time. DVG allows you to feed in any SVG file and apply any kind of complex transformation.

## How to use

```js
var svg = document.getElementById('svg');
var distort = new DVG(svg);

distort.withPoints(function(x, y)
{
	this.x(...);
    this.y(...);
});
```

## Demos

- [Smudging tool](http://codepen.io/benjamminf/full/GpaKGV/)
- [Black hole effect](blackhole.html)

## How it works

DVG has three phases; normalisation, interpolation/extrapolation, and application.

#### Normalisation

The SVG file is taken apart, and all primitive shapes like `<rect>` and `<ellipse>` are converted to paths.

Then all paths are taken apart, and all lines are replaced with Bezier curves. The reason for this is because distorted curves look smoother than distorted lines.

#### Interpolation/Extrapolation

In order for an SVG file to be able to handle highly detailed and non-affine transformations such as smudging, the SVG file needs to contain a *lot* of points to work with. So all paths are recursively interpolated until there are closely bunched points all along each path.

Similarly, if points are bunched *too* closely, they are merged together (provided the correct mode is set). This is the extrapolation step.

#### Application

This is where your math goes. Every point is applied your algorithm, then interpolation/extrapolation is repeated.
