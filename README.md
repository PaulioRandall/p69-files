![Made to be Plundered](https://img.shields.io/badge/Made%20to%20be%20Plundered-royalblue)
[![Latest version](https://img.shields.io/github/v/release/PaulioRandall/p69-files)](https://github.com/PaulioRandall/p69-files/releases)
[![Release date](https://img.shields.io/github/release-date/PaulioRandall/p69-files)](https://github.com/PaulioRandall/p69-files/releases)

# P69 Files

Extends **P69** to support compiling CSS files and file watching. See https://github.com/PaulioRandall/p69 for information on **P69**.

## Contents

- [Example](#example)
- [Options](#options)
- [Watching](#watching)
  - [Options](#watch-options)

## Example

**Given** `my-styles.p69` some where under `/src`:

```css
.my-class {
	color: $color.normal;
	font-weight: bold;

	font-size: $font.size.md;
	width: $width('lg');
}

.my-class:hover {
	color: &color.highlight;
}
```

**And** `more-styles.p69` some where under `/src`:

```css
.another-class {
	font-size: $font.size.sm;
	width: $width('ms');
}
```

**Then** executing `p69-to-css.js`:

```js
import P69 from 'p69-files'

const mappings = {
	color: {
		normal: 'burlywood',
		highlight: 'crimson ',
	},
	font: {
		size: {
			sm: '0.8rem',
			md: '1rem',
			lg: '1.2rem',
		},
	},
	width: (size = 'md') => {
		const sizes = {
			xs: '5rem',
			sm: '10rem',
			md: '15rem',
			lg: '20rem',
			xl: '25rem',
		}

		return sizes[md]
	},
}

await P69.file(tokens)
/*
	await P69.files(mappings, {
		src: './src',
		dst: './src/app.css',
	})
*/
```

> You can pass multiple mappings. It will search each mapping in order until it finds a value, e.g. `P69.file([fonts, colors])`

**Produces** `src/app.css`:

```css
/* Note: order may vary */
.my-class {
	color: burlywood;
	font-size: 1rem;
	width: 20rem;
}

.my-class:hover {
	color: crimson;
}

.another-class {
	font-size: 0.8rem;
	width: 10rem;
}
```

[^Back to contents](#contents)

## Options

```js
P69(
	mappings,
	options: {
		// onError is called when an error occurs.
		//
		// If the error isn't thrown then processing will
		// continue for the remaining tokens.
		//
		// By default, logs the error and carries on.
		onError: (err, token) => {},

		// Directory to scan for .p69 files.
		src: "./src",

		// Output file. Amalgamates all compiled .p69
		// CSS into one file.
		//
		// If set as undefined, null, or empty string,
		// each .p69 file will be written as a .css file
		// in the same folder. It will overwrite if
		// already exists.
		dst: "./src/app.css"
	}
)
```

[^Back to contents](#contents)

## Watching

Unfortunatly, I've had little success in getting a JavaScript token file **and its dependencies** to reload on change. ECMAScript modules were designed to load once and once only.

```js
import P69 from 'p69'

const mappings = {
	...
}

// Does not block.
// Currently uses chokidar.
const stopWatching = P69.watch(mappings)

// ...

await stopWatching()
```

### Watch Options

```js
P69.watch(
	mappings,
	options: {
		// onError is called when an error occurs.
		//
		// If the error isn't thrown then processing will
		// continue for the remaining tokens.
		//
		// By default, logs the error and carries on.
		onError: (err, token) => {},

		// Directory to scan for .p69 files.
		src: "./src",

		// Output file. Amalgamates all compiled .p69
		// CSS into one file.
		//
		// If set as undefined, null, or empty string,
		// each .p69 file will be written as a .css file
		// in the same folder. It will overwrite if
		// already exists.
		dst: "./src/app.css",

		// Options to file watching package: Chokidar.
		//
		// These are the defaults. They extend Chokidar's (v4)
		// defaults, see https://github.com/paulmillr/chokidar.
		chokidar: {
			// Ignore everything except .p69 files.
			ignored: (path, stats) => stats?.isFile() && !path.endsWith('.p69'),

			// Otherwise recompile triggers for each dir under src during start up.
			ignoreInitial: true,

			// A little idiot proofing.
			followSymlinks: false,

			// I don't know what is suitable but seems to work fine.
			// Extend 'stabilityThreshold' if you experience file update issues.
			awaitWriteFinish: {
				stabilityThreshold: 999,
				pollInterval: 200,
			},

			// Avoid triggering recompile twice when some tool deletes and
			// writes a file, rather than updating it.
			atomic: 200,
		},
	}
)
```

[^Back to contents](#contents)
