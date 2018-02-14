import * as _ from 'lodash'
import * as requets from 'request-promise'
import conf from '../../conf'
import logger from '../common/logger'

const log = logger.namespace('ping')

export function ping () {
	const pingTime = new Date()
	log(`You ping me at ${pingTime}`)

	return pingTime
}

export function pingAsync () {
	return new Promise(resolve => setTimeout(() => resolve(ping()), 1000))
}