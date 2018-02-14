import * as pingController from './ping-controller'
import { EHttpMethod } from '../common/enum-http-method'
import { IRoute } from '../common/interface-route'
import * as joi from 'joi'

const routes: IRoute[] = [
	/**
	 * @api {get} /ping /ping
	 * @apiGroup Test Server
	 * @apiVersion 1.0.0
	 * @apiDescription Simple route to know if the server is alived
	 */
	{
		method: EHttpMethod.GET,
		path: '/ping',
		controller: pingController.pingMe,
	},
	/**
	 * @api {get} /ping-async /ping-async
	 * @apiGroup Test Server
	 * @apiVersion 1.0.0
	 * @apiDescription Simple route to know if the server is alived with an async controller
	 */
	{
		method: EHttpMethod.GET,
		path: '/ping-async',
		controller: pingController.pingMeAsync,
	},
]

export default routes