export function line(x1, y1, x2, y2)
{

}

export function polyline(points)
{

}

export function polygon(points)
{
	return polyline(points) + 'Z'
}

export function rectangle(x, y, width, height, rx=0, ry=0)
{

}

export function ellipse(cx, cy, rx, ry)
{

}

export function circle(cx, cy, r)
{
	return ellipse(cx, cy, r, r)
}
