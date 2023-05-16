import fs from 'fs'
import path from 'path'
import yargs, { ArgumentsCamelCase, Argv } from "yargs";
import { getManifest, updateManifest } from "../utils/manifest";

export const removeSymbolArgs = (arg: Argv) => {
    return yargs
    .positional('name', {
        description: 'Name of the symbol (in snake_case) to remove.'
    })
    .option('hard', {
        alias: 'h',
        type: 'boolean',
        description: 'Delete the code file for the symbol as well.',
        default: false
    })
}

export const removeSymbolCommand = (
    args: ArgumentsCamelCase<{ name: string, hard: boolean }>
) => {
    const { name, hard } = args
    const manifest = getManifest()
    if (!manifest.symbols[name]) {
        throw new Error(`Symbol ${name} does not exist. Please check your manifest file.`)
    }
    
    const symbolPath = manifest.symbols[name]
    delete manifest.symbols[name]

    updateManifest(manifest)

    if (hard) {
        fs.rmdirSync(path.dirname(symbolPath), { recursive: true })
    }
}