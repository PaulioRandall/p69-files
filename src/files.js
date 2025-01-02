import path from 'path'
import P69 from '@paulio/p69'

import os from './os.js'
import listP69Files from './list_files.js'

export default async (tokenMaps, options = {}) => {
	const {
		src = './src', //
		dst = './src/app.css', //
	} = options

	let hasErrors = false
	let p69Files = []

	try {
		p69Files = await listP69Files(src)
	} catch (e) {
		os.stderr(e)
		return true
	}

	if (dst) {
		await os.deleteFile(dst)
	}

	for (const f of p69Files) {
		await compileFile(f, tokenMaps, dst, {
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

	css = P69.string(tokenMaps, css, options)
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
