import { stdpath } from '../../deps.ts';
import { getManifest, updateManifest } from "../utils/manifest.ts";

export type RemoveSymbolCommandArgs = {
    name: string,
    hard: boolean
}

export const removeSymbolCommand = (
    args: RemoveSymbolCommandArgs
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