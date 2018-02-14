import * as debug from 'debug'
import conf from '../../conf'

/**
 * This is the logger we need to use
 * Use DEBUG="" var env to enable log into the standart output
 * We set an generic output for best filter
 * Every output is like "my-application:name-space My message"
 */
export default {
	namespace: (namespace: string) => debug(`${conf.name}:${namespace}`),
}