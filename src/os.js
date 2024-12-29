import fs from 'fs'
import path from 'path'

const TTY_RED = '\x1b[31m'
const TTY_YELLOW = '\x1b[33m'
const TTY_RESET = '\x1b[0m'

const stdout = (...msgs) => {
	const msg = msgs.join(' ')
	return process.stdout.write(`\n${TTY_YELLOW}${msg}${TTY_RESET}`)
}

const stderr = (...msgs) => {
	const msg = msgs.join(' ')
	return process.stderr.write(`\n${TTY_RED}${msg}${TTY_RESET}`)
}

const replaceFileExt = (f, newExt) => {
	const currExt = path.extname(f)
	f = f.slice(0, -currExt.length)
	return `${f}.${newExt}`
}

const readWholeFile = (f) => {
	return fs.promises
		.readFile(f, { encoding: 'utf-8' })
		.then(handleOK)
		.catch(handleErr)
}

const createOrReplaceFile = (f, content) => {
	return fs.promises
		.writeFile(f, content, { encoding: 'utf-8' })
		.then(handleOK)
		.catch(handleErr)
}

const appendToFile = (f, content) => {
	return fs.promises
		.appendFile(f, content, { encoding: 'utf-8' })
		.then(handleOK)
		.catch(handleErr)
}

const deleteFile = (f) => {
	return fs.promises.rm(f, { force: true }).then(handleOK).catch(handleErr)
}

const handleOK = (result) => {
	return [result, true]
}

const handleErr = (err) => {
	stderr(e)
	return [null, false]
}

export default {
	stdout,
	stderr,
	replaceFileExt,
	readWholeFile,
	createOrReplaceFile,
	appendToFile,
	deleteFile,
}
