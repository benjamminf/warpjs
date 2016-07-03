import Point from 'point'
import {split} from 'util/math'

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
		// TODO: Calculate the arc length of the curve rather than the linear distance between the start and end

		const start = this.start()
		const end = this.end()

		const dx = end.x - start.x
		const dy = end.y - start.y

		return Math.sqrt(dx * dx + dy * dy)
	}

	split(t = 0.5)
	{
		const convertSeg = seg => seg.map(p => new Point(p.x, p.y))

		const [segA, segB] = split(this.points.map(p => ({x: p.x, y: p.y})))
		const pieceA = new Piece(...convertSeg(segA))
		const pieceB = new Piece(...convertSeg(segB))

		return [pieceA, pieceB]
	}
}
