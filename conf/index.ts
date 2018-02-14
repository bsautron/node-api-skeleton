import developement from './developement'
import production from './production'
import IConf from './conf-interface'

export const nodeEnv: string = process.env.NODE_ENV || 'developement'

const envs = {
	developement,
	production,
}
const conf: IConf = envs[nodeEnv] || developement

export default conf
