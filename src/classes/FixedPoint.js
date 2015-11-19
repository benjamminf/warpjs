function FixedPoint(x, y, type)
{
	Point.call(this, x, y, type);

	this._origX = this.x();
	this._origY = this.y();
	this._restX = this.x();
	this._restY = this.y();
}

var fn = FixedPoint.prototype = new Point;
fn.constructor = FixedPoint;

fn.origX = function(x)
{
	if(typeof x === 'number')
	{
		this._origX = x;
	}

	return this._origX;
};

fn.origY = function(y)
{
	if(typeof y === 'number')
	{
		this._origY = y;
	}

	return this._origY;
};

fn.restX = function(x)
{
	if(typeof x === 'number')
	{
		this._restX = x;
	}

	return this._restX;
};

fn.restY = function(y)
{
	if(typeof y === 'number')
	{
		this._restY = y;
	}

	return this._restY;
};
