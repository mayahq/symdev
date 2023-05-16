import { 
    stdpath, 
    lodash as _,
    inquirer
} from '../../deps.ts'
import { generateSymbolCode } from '../codegen/getSymbolCode.ts'
import { Manifest, getManifest, getManifestPath, updateManifest } from '../utils/manifest.ts'
import { isSnakeCase } from '../utils/case.ts'
// import inquirer from 'inquirer'


export const addSymbolCommand = async () => {
    inquirer
    .prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Symbol name:',
            validate: (input: string) => {
                if (input !== '' && isSnakeCase(input)) {
                    return true
                } else {
                    return 'Symbol name must be in snake_case.'
                }
            }
        },
        {
            name: 'category',
            type: 'input',
            message: 'Category'
        },
        {
            name: 'description',
            type: 'input',

        }
    ])
    .then((answers: any) => {
        const manifestPath = getManifestPath()
        const manifest = getManifest()
    
        const { name, category, description } = answers
        const snakeCaseName = name
        if (manifest.symbols[snakeCaseName]) {
            throw new Error(`Symbol ${snakeCaseName} already exists at ${manifest.symbols[snakeCaseName]}`)
        }
    
        const finalFilePath =  stdpath.join(stdpath.dirname(manifestPath), `symbols/${snakeCaseName}/${snakeCaseName}.ts`)
        Deno.mkdirSync(
            stdpath.dirname(finalFilePath), { recursive: true }
        )
    
        const code = generateSymbolCode({ name: snakeCaseName, category, description })
        Deno.writeTextFileSync(finalFilePath, code)
        const newManifest: Manifest = {
            ...manifest,
            symbols: {
                ...manifest.symbols,
                [snakeCaseName]: `./symbols/${snakeCaseName}/${snakeCaseName}.ts`
            }
        }
    
        updateManifest(newManifest)
    })
}