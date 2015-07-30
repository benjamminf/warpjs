/**
 *
 * @param x
 * @param y
 * @constructor
 */
function Point(x, y)
{
	this.segment = {};
	this.attrX = attrX || 'x';
	this.attrY = attrY || 'x';

	this.position(x, y);
}

Point.fn = Point.prototype;

Point.fn.update = function(segment, attrX, attrY)
{
	this.segment = segment;
	if(attrX) this.attrX = attrX;
	if(attrY) this.attrY = attrY;
};

Point.fn.x = function(value)
{
	if(!isNaN(value))
	{
		this.segment[this.attrX] = value;
	}

	return this.segment[this.attrX];
};

Point.fn.y = function(value)
{
	if(!isNaN(value))
	{
		this.segment[this.attrY] = value;
	}

	return this.segment[this.attrY];
};

Point.fn.position = function(x, y)
{
	return {
		x: this.x(x),
		y: this.y(y)
	};
};

Point.from = function(segment, attrX, attrY)
{
	var point = new Point();
	point.update(segment, attrX, attrY);

	return point;
};
