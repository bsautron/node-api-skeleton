import * as supertest from 'supertest'
import * as restifyError from 'restify-errors'
import * as sinon from 'sinon'
import { appInitializer } from '../../modules/server'
import exampleRoutes from '../../modules/example/example-routes'
import 'should'

function isAnError (body, code, message) {
	body.code.should.be.equal(code)
	body.message.should.be.equal(message)
}

describe('Server', () => {
	const request = () => supertest(server)

	// Init tests
	let server = undefined
	before(() => {
		server = appInitializer(exampleRoutes)
	})

	describe('Routes', () => {
		it('Route not found', async () => {
			await request()
			.post('/paw8efhawef')
			.expect('Content-Type', /json/)
			.expect(404)
			.then(res => isAnError(res.body, 'ResourceNotFound', '/paw8efhawef does not exist'))
		})
	})
	describe('Generic error', () => {
		it('Throw string', async () => {
			await request()
			.get('/throw-me/message')
			.expect('Content-Type', /json/)
			.expect(500)
			.then(res => isAnError(res.body, 'InternalServer', ''))
		})
		it('Throw object', async () => {
			await request()
			.get('/throw-me/object')
			.expect('Content-Type', /json/)
			.expect(500)
			.then(res => isAnError(res.body, 'InternalServer', ''))
		})
		it('Throw new Error', async () => {
			await request()
			.get('/throw-me/error')
			.expect('Content-Type', /json/)
			.expect(500)
			.then(res => isAnError(res.body, 'InternalServer', ''))
		})
		it('Throw restify error', async () => {
			await request()
			.get('/throw-me/restify-error')
			.expect('Content-Type', /json/)
			.expect(418)
			.then(res => isAnError(res.body, 'ImATeapot', ''))
		})
	})
	describe('Body parser', () => {
		it('Body is empty', async () => {
			await request()
			.post('/throw-me/body-parse')
			.expect(400)
			.then(res => isAnError(res.body, 'BadRequest', '"giveMeMessage" is required. Path = "giveMeMessage"'))
		})
		it('Miss an attribute', async () => {
			await request()
			.post('/throw-me/body-parse')
			.send({ giveMeMessage: 'hey' })
			.expect(400)
			.then(res => isAnError(res.body, 'BadRequest', '"giveMeNumber" is required. Path = "giveMeNumber"'))
		})
		it('Miss an attribute in an array', async () => {
			const body = {
				giveMeMessage: 'hey',
				giveMeNumber: 234,
				giveMeArray: [{}],
			}
			await request()
			.post('/throw-me/body-parse')
			.send(body)
			.expect(400)
			.then(res => isAnError(res.body, 'BadRequest', '"giveMeSomething" is required. Path = "giveMeArray.0.giveMeSomething"'))
		})
		it('Body is good', async () => {
			const body = {
				giveMeMessage: 'hey',
				giveMeNumber: 234,
				giveMeArray: [{ giveMeSomething: 'ok' }],
			}
			await request()
			.post('/throw-me/body-parse')
			.send(body)
			.expect(200)
			.then(res => res.body.should.be.equal('Good'))
		})
	})
})
