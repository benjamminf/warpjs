function Point(x, y, type)
{
	this._x = 0;
	this._y = 0;
	this._type = Point.NORMAL;

	this.x(x);
	this.y(y);
	this.type(type);
}

Point.NORMAL  = Point[1] = 1;
Point.CONTROL = Point[2] = 2;

var fn = Point.prototype;

fn.x = function(x)
{
	if(typeof x === 'number')
	{
		this._x = x;
	}

	return this._x;
};

fn.y = function(y)
{
	if(typeof y === 'number')
	{
		this._y = y;
	}

	return this._y;
};

fn.type = function(type)
{
	if(Point[type])
	{
		this._type = type;
	}

	return this._type;
};
