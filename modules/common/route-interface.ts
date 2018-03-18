import { EHttpMethod } from './http-method-enum'
import { RequestHandler } from 'restify'

export interface IRoute {
	path: string
	method: EHttpMethod,
	validation?: any,
	middlewares?: RequestHandler[],
	controller: RequestHandler
}