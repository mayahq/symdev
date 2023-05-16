import _ from 'lodash'
import { Argv, ArgumentsCamelCase } from 'yargs'
import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import { generateSymbolCode } from '../codegen/getSymbolCode'
import { Manifest, getManifest, getManifestPath, updateManifest } from '../utils/manifest'
import { isSnakeCase } from '../utils/case'

export const addSymbolArgs = (yargs: Argv) => yargs

export const addSymbolCommand = (argv: ArgumentsCamelCase) => {
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
    .then((answers) => {
        const manifestPath = getManifestPath()
        const manifest = getManifest()
    
        const { name, category, description } = answers
        const snakeCaseName = name
        if (manifest.symbols[snakeCaseName]) {
            throw new Error(`Symbol ${snakeCaseName} already exists at ${manifest.symbols[snakeCaseName]}`)
        }
    
        const finalFilePath =  path.join(path.dirname(manifestPath), `symbols/${snakeCaseName}/${snakeCaseName}.ts`)
        fs.mkdirSync(
            path.dirname(finalFilePath), { recursive: true }
        )
    
        const code = generateSymbolCode({ name: snakeCaseName, category, description })
        fs.writeFileSync(finalFilePath, code)
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