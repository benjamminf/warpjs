import Point from 'point'
import {magnitude, split, divider} from '../util/piece'

const convertSegs = segs => segs.map(seg => new Piece(...seg.map(p => new Point(p.x, p.y))))

export const LINEAR = new Symbol('Linear')
export const QUADRATIC = new Symbol('Quadratic')
export const CUBIC = new Symbol('Cubic')

export default class Piece
{
	constructor(...points)
	{
		switch(points.length)
		{
			case 2: this.type = LINEAR ; break
			case 3: this.type = QUADRATIC ; break
			case 4: this.type = CUBIC ; break

			default: throw new Error("Need either two, three or four points to form a piece")
		}

		this.points = Array.from(points)
	}

	start()
	{
		return this.points[0]
	}

	end()
	{
		return this.points[this.points.length - 1]
	}

	control(index = 1)
	{
		switch(this.type)
		{
			case LINEAR: throw new Error("There are no control points for linear pieces")
			case QUADRATIC: return this.points[1]
			case CUBIC: return this.points[index === 2 ? 2 : 1]
		}
	}

	length()
	{
		return magnitude(this.points)
	}

	split(t = 0.5)
	{
		return convertSegs(split(this.points, t))
	}

	divide(threshold = 10)
	{
		return convertSegs(divider(this.points, threshold))
	}
}
