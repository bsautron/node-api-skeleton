import { appInitializer } from './modules/server'
import logger from './modules/common/logger'
import conf from './conf'

const log = logger.namespace('init')

/**
 * This is juste to say in the console when the port of the server is open
*/
function logServerAvailable () {
	log(`Server listen on port ${conf.port}`)
}

appInitializer()
	.listen(conf.port, logServerAvailable)
