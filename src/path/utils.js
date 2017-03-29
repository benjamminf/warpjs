export function fromLine(x1, y1, x2, y2)
{

}

export function fromPolyline(points)
{

}

export function fromPolygon(points)
{
	return fromPolyline(points) + 'Z'
}

export function fromRectangle(x, y, width, height, rx=0, ry=0)
{

}

export function fromEllipse(cx, cy, rx, ry)
{

}

export function fromCircle(cx, cy, r)
{
	return fromEllipse(cx, cy, r, r)
}
