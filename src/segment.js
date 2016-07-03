import Piece from 'piece'
import Point from 'point'
import {divider} from 'util/piece'

export default class Segment
{
	constructor(...pieces)
	{
		this.pieces = Array.from(pieces)
	}

	startPoint()
	{
		return this.pieces[0].start()
	}

	endPoint()
	{
		return this.pieces[0].end()
	}

	interpolate(threshold = 10)
	{
		const pieces = []

		for(let piece of this.pieces)
		{
			pieces.push(...piece.divide(threshold))
		}

		this.pieces = pieces
	}

	points()
	{
		const points = []

		for(let piece of this.pieces)
		{
			points.push(...piece.points)
		}

		return points
	}
}
