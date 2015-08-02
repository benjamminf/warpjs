/* Constructor */

/**
 *
 * @param x
 * @param y
 * @constructor
 */
function Point(x, y)
{
	this.segment = {};
	this.pointType = 0;
	this.attrX = attrX || 'x';
	this.attrY = attrY || 'y';
	this.origX = 0;
	this.origY = 0;

	this.position(x, y);
}


/* Static properties */

Point.CONTROL_0 = 0;
Point.CONTROL_1 = 1;
Point.CONTROL_2 = 2;


/* Static methods */

/**
 *
 * @param segment
 * @param pointType
 * @returns {Point}
 */
Point.from = function(segment, pointType)
{
	var point = new Point();
	point.target(segment, pointType);

	return point;
};


/* Methods */

/**
 *
 * @param segment
 * @param pointType
 */
Point.prototype.target = function(segment, pointType)
{
	this.segment = segment;
	this.pointType = pointType | 0;

	if(this.pointType > 0)
	{
		this.attrX = 'x' + this.pointType;
		this.attrY = 'y' + this.pointType;
	}
	else
	{
		this.attrX = 'x';
		this.attrY = 'y';
	}

	this.origX = this.segment[this.attrX];
	this.origY = this.segment[this.attrY];
};

/**
 *
 * @param value
 * @returns {*}
 */
Point.prototype.x = function(value)
{
	if(!isNaN(value))
	{
		this.segment[this.attrX] = value;
	}

	return this.segment[this.attrX];
};

/**
 *
 * @param value
 * @returns {*}
 */
Point.prototype.y = function(value)
{
	if(!isNaN(value))
	{
		this.segment[this.attrY] = value;
	}

	return this.segment[this.attrY];
};

/**
 *
 * @param x
 * @param y
 * @returns {{x: *, y: *}}
 */
Point.prototype.position = function(x, y)
{
	return {
		x: this.x(x),
		y: this.y(y)
	};
};
