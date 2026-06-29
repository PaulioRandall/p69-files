import path from 'path'
import P69 from '@paulio/p69'

import prepOptions from './prepOptions.js'
import readTokenFiles from './readTokenFiles.js'
import os from './os.js'

// TODO: Rewrite

export default async (tokenMapFiles, userOptions = {}) => {
	const options = prepOptions

	let hasErrors = false
	let files = []

	try {
		files = os.listP69Files(options.src)
	} catch (e) {
		os.stderr(e)
		return true
	}

	if (options.dst) {
		try {
			await os.deleteFile(options.dst)
		} catch (e) {
			os.stderr(e)
			return true
		}
	}

	for (const f of files) {
		await compileFile(f, tokenMapFiles, options.dst, {
			ref: f,
			...options, //
		}).catch((e) => {
			hasErrors = true
			os.stderr(e, '\n')
		})
	}

	return hasErrors
}

export const compileFile = async (p69File, tokenMaps, dst, options) => {
	let [css, ok] = await os.readWholeFile(p69File)

	if (!ok) {
		throw new Error(`Unable to read file: ${p69File}`)
		return
	}

	css = P69(tokenMaps, css, options)
	css = css.trim()

	await writeCssToFile(p69File, css, dst)
}

const writeCssToFile = async (p69File, css, dst) => {
	if (dst) {
		await os.appendToFile(dst, css + '\n\n')
		return
	}

	const cssFile = os.replaceFileExt(p69File, 'css')
	await os.createOrReplaceFile(cssFile, css + '\n')
}
