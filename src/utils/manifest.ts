import fs from 'fs'
import path from 'path'

export type Manifest = {
    moduleName: string
    repository: string
    symbols: Record<string, string>
}

export function getManifestPath() {
    let manifestPath = process.cwd()
    
    while (manifestPath !== '/') {
        const exists = fs.readdirSync(manifestPath).some((file) => file === 'manifest.json')
        if (exists) {
            return path.resolve(manifestPath)
        }
        manifestPath = path.join(manifestPath, '..')
    }

    throw new Error(`You are not in a Maya Symbol project.`)
}

export function getManifest(): Manifest {
    const manifestPath = getManifestPath()
    return JSON.parse(fs.readFileSync(manifestPath).toString())
}

export function updateManifest(manifest: Manifest) {
    const manifestPath = getManifestPath()
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 4))
}