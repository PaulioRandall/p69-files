import fs from 'fs'
import path from 'path'

const listFiles = async (file) => {
	const stat = await fs.promises.stat(file)

	if (stat.isDirectory()) {
		return listChildren(file)
	}

	return isP69(file) ? [file] : []
}

const listChildren = async (dir) => {
	let files = await fs.promises.readdir(dir)
	files = files.map((f) => listAbsFiles(dir, f))
	files = await Promise.all(files)
	return files.flat()
}

const listAbsFiles = (dir, f) => {
	f = absPath(dir, f)
	return listFiles(f)
}

const absPath = (dir, f) => {
	f = path.join(dir, f)
	return path.resolve(f)
}

const isP69 = (f) => {
	return path.extname(f) === '.p69'
}

export default listFiles
