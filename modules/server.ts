import * as morgan from 'morgan-debug'
import * as restify from 'restify'
import * as restifyErrors from 'restify-errors'
import * as joi from 'joi'
import * as _ from 'lodash'
import logger from './common/logger'
import conf from '../conf'
import { IRoute } from './common/route-interface'

const log = logger.namespace('server')
const defaultRoutes = [
	// ...exampleRoutes
]

/**
 * First: We use restify-error for errors management
 * This function ensure that every error is controller will never crash the server
 * If the error is an Restify Error, we juste forward the error
 * Else, we return en 500 - Internal Error
 *
 * An async function is returned because thanks to the await
 * We can catch the controller fail
 * @example
 * In a controller, you can trhow an Restify Error like:
 * 		throw new restifyErrors.ResourceNotFoundError({
 *			message: `The Unicorn is not found`,
 *		})
 * @param controllerFunction Restify Controller function
 */
function wrapControllerFunction (controllerFunction: restify.RequestHandler) {
	return async (req: restify.Request, res: restify.Response, next: restify.Next) => {
		try {
			await controllerFunction(req, res, next)
		} catch (error) {
			if (error instanceof restifyErrors.HttpError) next(error)
			else next(new restifyErrors.InternalServerError({ context: error }))
		}
	}
}

/**
 * Check if every properties match with the definition of the schema
 * We assume that a body is always an object
 * In addition, the body will be parsed
 * "3445" is a number, and we will transfom to 3445
 * @return The joi validation like:
 * 		{
 * 			error: ...
 * 			values: ... // That is the body parsed
 * 		}
 * @param body The Http request body
 * @param bodyValidation The schema define in the route definition
 */
function getBodyValidation (body: any, bodyValidation: any): any {
	if (!bodyValidation) return { error: undefined, value: body }

	return joi.validate(body, bodyValidation)
}

/**
 * This function return the first error of the validation from Joi librairy
 * It will concat the error message, and the path for the error
 * We asume that each body is an object
 */
export function getHumanReadableErrorValidationMessage (error): string {
	const firstError = error.details[0]
	return `${firstError.message}. Path = "${firstError.path.join('.')}"`
}

/**
 * Add the route definition to the server
 *
 * Add validator for body from the client.
 * Add middleware
 * Add then end point controller
 * Wrap all function to a async function to catch any throw crash
 * @example
 * 		server.get('/hello', (req, res) => res.send('hello'))
 * @param server Application Server
 * @param route The route definition
 */
function setRoute (server: restify.Server, route: IRoute): void {
	// The validation return an error if data is not valid, return a body correctly parsed
	const validationMiddelware = wrapControllerFunction((req, res, next) => {
		const requestBody = req.body || {} // All body must be a json in my API
		const bodyValidate = getBodyValidation(requestBody, _.get(route, 'validation.body'))

		if (bodyValidate.error) return next(new restifyErrors.BadRequestError({
			message: getHumanReadableErrorValidationMessage(bodyValidate.error),
		}))
		req.body = bodyValidate.value
		next()
	})
	const restMiddlwares = _.map(route.middlewares || [], wrapControllerFunction)
	const controller = wrapControllerFunction(route.controller)

	server[route.method](route.path, validationMiddelware, restMiddlwares, controller)
	log(`Route: ${route.method.toUpperCase()} ${route.path} available`)
}

/**
 * Set dynamicly every route definition to the application server
 * In this function, take all './modules/**-routes.ts' file
 * Each file is an array of routes definition
 * All array are flatten and the 'setRoute' function is applied for each
 * @param server Application server
 */
function routesInitializer (server: restify.Server, routes: IRoute[]): restify.Server {
	routes.forEach(route => setRoute(server, route))

	return server
}

/**
 * Init the application
 * Prepare all middelware, routes, errors handling before open the port
 * @param additionalRoutes Other routes - useful for behavior test driven
 */
export function appInitializer (additionalRoutes: IRoute[] = []): restify.Server {
	const server = restify.createServer()

	server.use(restify.plugins.bodyParser()) // Enable restify to parse the Body (like in the post route)
	server.use(morgan(`${conf.name}:http`, 'tiny')) // Set morgan log (log the route called)
	routesInitializer(server, [...additionalRoutes, ...defaultRoutes]) // Set all routes

	// Log to the console only Internal Errors (Debug is more easier)
	// server.on('InternalServer', (req, res, err, cb) => {
	// 	log(err)
	// 	res.send(err)
	// })

	return server
}
