import assert from 'assert'

export function approximately(actual, expected, delta, message=null)
{
	if(typeof actual === 'number' && typeof expected === 'number')
	{
		const diff = Math.abs(actual - expected)
		const larger = Math.max(diff, delta)

		assert.equal(larger, delta, message)
	}
	else
	{
		assert.equal(actual, expected, message)
	}
}

export function deepEqual(actual, expected, message=null, comparator=assert.equal)
{
	for(let key of Object.keys(expected))
	{
		assert.ok(key in actual, message)
	}

	for(let key of Object.keys(actual))
	{
		assert.ok(key in expected, message)

		if(typeof actual[key] === 'object' && typeof expected[key] === 'object')
		{
			deepEqual(actual[key], expected[key], message, comparator)
		}
		else
		{
			comparator(actual[key], expected[key], message)
		}
	}
}

export function approxDeepEqual(actual, expected, delta, message=null)
{
	deepEqual(actual, expected, message, (a, b) => approximately(a, b, delta, message))
}
