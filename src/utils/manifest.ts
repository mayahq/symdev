import { stdpath } from '../../deps.ts'

export type Manifest = {
    moduleName: string
    repository: string
    symbols: Record<string, string>
}

export function getManifestPath() {
    let manifestPath = Deno.cwd()
    
    while (manifestPath !== '/') {
        let exists = false
        const dirs = Deno.readDirSync(manifestPath)

        for (const dir of dirs) {
            if (dir.isFile && dir.name === 'manifest.json') {
                exists = true
                break
            }
        }

        if (exists) {
            return stdpath.join(stdpath.resolve(manifestPath), 'manifest.json')
        }

        manifestPath = stdpath.join(manifestPath, '..')
    }

    throw new Error(`You are not in a Maya Symbol project.`)
}

export function getManifest(): Manifest {
    const manifestPath = getManifestPath()
    return JSON.parse(Deno.readTextFileSync(manifestPath))
}

export function updateManifest(manifest: Manifest) {
    const manifestPath = getManifestPath()
    Deno.writeTextFileSync(manifestPath, JSON.stringify(manifest, null, 4))
}