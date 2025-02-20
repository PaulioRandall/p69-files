import fs from 'fs'

import testdata from './testdata.js'
import compileFiles from './files.js'

const expectedCSS = [
	{
		path: testdata.testDir + '/alpha/alpha.css',
		content: '.alpha {\n\tcolor: blue;\n}\n',
	},
	{
		path: testdata.testDir + '/alpha/beta/beta.css',
		content: '.beta {\n\tpadding: 2rem;\n}\n',
	},
	{
		path: testdata.testDir + '/alpha/charlie/charlie.css',
		content: '.charlie {\n\tcolor: blue;\n\tpadding: 2rem;\n}\n',
	},
]

describe('files.js', () => {
	test('processes testdata from .p69 to .css', async () => {
		await testdata.reset()

		const tokenMap = {
			color: 'blue',
			pad: '2rem',
		}

		const hasErrors = await compileFiles(tokenMap, {
			src: testdata.testDir,
			dst: null,
		})

		expect(hasErrors).toEqual(false)

		for (const f of expectedCSS) {
			await testdata.expectFileContains(f.path, f.content)
		}
	}, 2000)

	test('processes AND amalgamtes testdata from .p69 to .css', async () => {
		await testdata.reset()

		const dst = testdata.testDir + '/global.css'
		const tokenMap = {
			color: 'blue',
			pad: '2rem',
		}

		const hasErrors = await compileFiles(tokenMap, {
			src: testdata.testDir,
			dst: dst,
		})

		expect(hasErrors).toEqual(false)

		const exp = expectedCSS.reduce((acc, f) => {
			return `${acc}${f.content}\n`
		}, '')

		await testdata.expectFileContains(dst, exp)
	}, 2000)
})
