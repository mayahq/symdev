import { stdpath, yargs } from '../../deps.ts';
import { getManifest, updateManifest } from "../utils/manifest.ts";

export const removeSymbolArgs = (_: unknown) => {
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
    args: any
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
        Deno.removeSync(stdpath.dirname(symbolPath), { recursive: true })
    }
}