import IConf from './conf-interface'

const developement: IConf = {
	name: 'node-api-skeleton',
	port: 3000,
	mongo: {
		uri: 'mongodb://localhost:27017/lewis',
	},
}

export default developement