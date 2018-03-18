import { getHumanReadableErrorValidationMessage } from '../../modules/server'
import 'should'

describe('Server', () => {
	describe('Error is easily readable', () => {
		it('Single error', () => {
			const error = {
				details: [{ message: 'I am a message', path: ['i', 'am', 'a', 'path'] }],
			}
			getHumanReadableErrorValidationMessage(error).should.equal('I am a message. Path = "i.am.a.path"')
		})
		it('Multiple errors should take first one', () => {
			const error = {
				details: [
					{ message: 'First message', path: ['p', '1'] },
					{ message: 'Second message', path: ['p', '2'] },
				],
			}
			getHumanReadableErrorValidationMessage(error).should.equal('First message. Path = "p.1"')
		})
	})
})