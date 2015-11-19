function FixedPoint(x, y, type)
{
	Point.call(this, x, y, type);

	this._origX = this.x();
	this._origY = this.y();
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
