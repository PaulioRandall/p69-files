import prepOptions from './prepOptions.js'

describe('prepOptions.js', () => {
	test('No user options', () => {
		const act = prepOptions()

		expect(act).toEqual({
			p69Files: {
				src: './src', //
				dst: './src/app.css',
			},
		})
	})

	test('Custom dst', () => {
		const act = prepOptions({
			p69Files: {
				dst: './src/styles.css',
			},
		})

		expect(act).toEqual({
			p69Files: {
				src: './src', //
				dst: './src/styles.css',
			},
		})
	})

	test('P69 options', () => {
		const f = (err) => {
			// Do nothing
		}

		const act = prepOptions({
			p69: {
				onError: f,
			},
		})

		expect(act).toEqual({
			p69Files: {
				src: './src', //
				dst: './src/app.css',
			},
			p69: {
				onError: f,
			},
		})
	})
})
