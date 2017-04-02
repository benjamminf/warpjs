const config = require('./webpack')

config.target = 'node'

for(let rule of config.module.rules)
{
	if(rule.use && rule.use.loader === 'babel-loader')
	{
		rule.use.options = rule.use.options || {}
		rule.use.options.env = rule.use.options.env || {}
		
		rule.use.options.env.test = {
			plugins: ['istanbul'],
		}
	}
}

module.exports = config
