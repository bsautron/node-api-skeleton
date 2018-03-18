import { Request, Response } from 'restify'
import * as restifyError from 'restify-errors'

export async function simpleCrash (req: Request, res: Response) {
	throw 'Outch'
}

export async function objectCrash (req: Request, res: Response) {
	throw { a: 'aie' }
}

export async function errorCrash (req: Request, res: Response) {
	throw new Error('Not good')
}

export async function resitifyErrorCrash (req: Request, res: Response) {
	throw new restifyError.ImATeapotError()
}
export async function bodyParseCrash (req: Request, res: Response) {
	res.send('Good')
}