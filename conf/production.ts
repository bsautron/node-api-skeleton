import IConf from './conf-interface'

const production: IConf = {
	name: 'node-api-skeleton',
	port: 4000,
	mongo: {
		uri: 'mongodb://localhost:27017',
	},
}

export default production