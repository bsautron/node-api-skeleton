import { EHttpMethod } from './enum-http-method'
import { RequestHandler } from 'restify'

export interface IRoute {
	path: string
	method: EHttpMethod,
	validation?: any,
	middlewares?: RequestHandler[],
	controller: RequestHandler
}