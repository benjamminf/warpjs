(function(root, factory)
{
	if(typeof define === 'function' && define.amd)
	{
		define([], factory);
	}
	else
	{
		root.SVGDistort = factory();
	}
}(this, function()
{
	"use strict";