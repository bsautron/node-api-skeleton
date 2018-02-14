import { Request, Response } from 'restify'
import * as moment from 'moment'
import * as _ from 'lodash'
import * as pingService from './ping-service'
import * as restifyErrors from 'restify-errors'

export function pingMe (req: Request, res: Response) {
	const pingTime = pingService.ping()

	res.json({
		message: 'pong',
		context: { time: pingTime },
	})
}

export async function pingMeAsync (req: Request, res: Response) {
	const pingTime = await pingService.pingAsync()

	res.json({
		message: 'pong',
		context: { time: pingTime },
	})
}