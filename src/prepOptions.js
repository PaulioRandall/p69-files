const DEFAULT_OPTIONS = {
	p69Files: {
		src: './src', //
		dst: './src/app.css',
	},
}

export default function (userOptions) {
	const options = structuredClone(DEFAULT_OPTIONS)

	if (!userOptions) {
		return options
	}

	mergeUserOptions(options, userOptions, 'p69')
	mergeUserOptions(options, userOptions, 'p69Files')

	return options
}

function mergeUserOptions(options, userOptions, optionName) {
	if (!Object.hasOwn(userOptions, optionName)) {
		return
	}

	const opt = userOptions[optionName]

	if (!isObject(opt)) {
		throw new Error(`[P69-files] 'options.${optionName}' must be an object`)
	}

	if (!options[optionName]) {
		options[optionName] = {}
	}

	Object.assign(options[optionName], opt)
}

function isObject(v) {
	return (
		typeof v === 'object' && //
		!Array.isArray(v) &&
		v !== null
	)
}
