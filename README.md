![Made to be Plundered](https://img.shields.io/badge/Made%20to%20be%20Plundered-royalblue)
[![Latest version](https://img.shields.io/github/v/release/PaulioRandall/p69-files)](https://github.com/PaulioRandall/p69-files/releases)
[![Release date](https://img.shields.io/github/release-date/PaulioRandall/p69-files)](https://github.com/PaulioRandall/p69-files/releases)

# P69 Files

> IMPORTANT: Repository is no longer maintained. Project has been merged with [P69](https://github.com/PaulioRandall/p69). 

Provides **P69** file (CSS) and file watching.

- **P69**: https://github.com/PaulioRandall/p69
- **P69 Files**: https://github.com/PaulioRandall/p69-files
- **P69 Svelte**: https://github.com/PaulioRandall/p69-svelte
- **P69 Util**: https://github.com/PaulioRandall/p69-util

## Example

**src/tokens.js**

```js
// Must return a token map (object) or array of token maps.
export default {
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
```

**src/my-styles.p69**

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

**src/my-other-styles.p69**

```css
.another-class {
	font-size: $font.size.sm;
	width: $width('ms');
}
```

**src/p69-to-css.js**

```js
import P69Files from 'p69-files/files'

// Scans for
await P69Files('./src/tokens.js')
/*
	// Defaults options:
	P69Files("path-to-mappings.js", {
		p69Files: {
			src: "./src",
			dst: "./src/app.css",
		}
	} 

	// May provide multiple token files, each file must
	// return a token map or array of token maps.
	P69Files([
		"path-to-first-mapping.js",
		"path-to-second-mapping.js",
		"path-to-third-mapping.js",
		"etc",
	])
*/
```

**src/app.css**

```css
/* Order may vary */

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

## Options

```js
P69Files(
	mappings,
	options: {
		p69: {
			// See P69: https://github.com/PaulioRandall/p69
		},
		p69Files: {
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

			// If true, recompiles when either a token map
			// file or .p69 file is created, deleted, moved, or
			// changed.
			//
			// If using NodeJS, use
			// `process.env.NODE_ENV === 'development'` to enable
			// for development only.
			watch: false,

			// These are only applied if watch is true.
			//
			// These are the defaults. You may specify any of
			// Chokidar's options here (v5).
			// See https://github.com/paulmillr/chokidar.
			chokidar: {
				// Ignore everything except .p69 files.
				ignored: (path, stats) => {
					return stats?.isFile() && !path.endsWith('.p69')
				}

				// True to prevent recompile for each dir under
				// src during start up.
				ignoreInitial: true,

				// A little idiot proofing.
				followSymlinks: false,

				// I don't know what is suitable but seems to work
				// fine. Extend 'stabilityThreshold' if you
				// experience file update issues.
				awaitWriteFinish: {
					stabilityThreshold: 999,
					pollInterval: 200,
				},

				// Avoid triggering recompile twice when some tool
				// deletes and writes a file, rather than updating
				// it.
				atomic: 200,
			}
		}
	}
)
```
