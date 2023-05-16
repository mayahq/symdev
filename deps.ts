export { parse } from "https://deno.land/std/flags/mod.ts"
export { default as inquirer } from 'npm:inquirer'
export { default as chalk } from 'npm:chalk'

import { default as beaut } from 'npm:js-beautify'
const js = beaut.js
export { js as beautify }

export { default as dedent } from 'npm:dedent-js'
export { default as ora } from 'npm:ora'
export { default as lodash } from 'npm:lodash'

export * as stdpath from 'https://deno.land/std@0.186.0/path/mod.ts'
export * as stdfs from 'https://deno.land/std@0.186.0/fs/mod.ts'