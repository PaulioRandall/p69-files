import chokidar from 'chokidar'

import compileFiles from './files.js'
import os from './os.js'

export default (tokenMaps, options = {}) => {
	const src = options.src || './src'
	const chokidarOptions = options.chokidar || {}

	const handler = (path) => compileFiles(tokenMaps, options)

	const watcher = chokidar
		.watch(`${src}/**/*.p69`, chokidarOptions) //
		.on('ready', handler) //
		.on('add', handler) //
		.on('change', handler) //
		.on('unlink', handler) //
		.on('addDir', handler) //
		.on('unlinkDir', handler) //
		.on('error', (e) => {
			os.stderr(`Watcher error: ${e}`) //
		})

	return watcher.close
}
