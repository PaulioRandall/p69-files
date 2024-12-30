import testdata from './testdata.js'
import listFiles from './list_files.js'

describe('list_files.js', () => {
	test('correctly lists all .p69 testdata files', async () => {
		await testdata.reset()

		const act = await listFiles(testdata.testDir)
		const exp = testdata.files
			.filter((f) => f.format === 'p69')
			.map((f) => f.path)

		act.sort()
		exp.sort()

		expect(act).toEqual(exp)
	}, 2000)
})
