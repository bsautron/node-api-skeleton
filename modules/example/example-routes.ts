import { IRoute } from '../common/route-interface'
import { EHttpMethod } from '../common/http-method-enum'
import * as exampleController from './example-controller'
import * as joi from 'joi'


const routes: IRoute[] = [
	{
		path: '/throw-me/message',
		method: EHttpMethod.GET,
		controller: exampleController.simpleCrash,
	},
	{
		path: '/throw-me/object',
		method: EHttpMethod.GET,
		controller: exampleController.objectCrash,
	},
	{
		path: '/throw-me/error',
		method: EHttpMethod.GET,
		controller: exampleController.errorCrash,
	},
	{
		path: '/throw-me/restify-error',
		method: EHttpMethod.GET,
		controller: exampleController.resitifyErrorCrash,
	},
	{
		path: '/throw-me/body-parse',
		method: EHttpMethod.POST,
		validation: {
			body: joi.object({
				giveMeMessage: joi.string().required(),
				giveMeNumber: joi.number().required(),
				giveMeArray: joi.array().items(joi.object({
					giveMeSomething: joi.any().required(),
				})).required(),
			}).required(),
		},
		controller: exampleController.bodyParseCrash,
	},
]

export default routes