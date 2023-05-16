import _ from 'lodash'
import { Argv, ArgumentsCamelCase } from 'yargs'
import fs from 'fs'
import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import { execSync } from 'child_process'

import { Manifest } from '../utils/manifest'
import { generateDepsCode } from '../codegen/getDenoDeps'

type SetupArgs = {
    moduleName: string;
    repoUrl: string;
}

function isKebabCase(str: string) {
    return /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/.test(str)
}

function denoIsInstalled(): boolean {
    try {
        execSync('deno --version', { encoding: 'utf8' })
        return true
    } catch (_) {
        return false
    }
}

const initSuccessMessage = `
${chalk.bgBlue('Project initialised!')}

You can now develop symbols and push them to github
to make them immediately available for testing.

Run the following command to bootstrap a new symbol - 

    ${chalk.italic('symdev add-symbol [symbol-name]')}

`

async function setupProject(setupArgs: SetupArgs) {
    if (!denoIsInstalled()) {
        console.log(
            chalk.bgRed('Deno is not installed.'),
            'You can install it from here: https://deno.com/manual/getting_started/installation\n'
        )
        throw new Error('Deno is not installed.')
    }

    const manifest: Manifest = {
        moduleName: setupArgs.moduleName,
        repository: setupArgs.repoUrl,
        symbols: {}
    }

    const denoSettings = {
        tasks: {
          get_deps: "deno check deps.ts"
        },
        fmt: {
          indentWidth: 4,
          singleQuote: true,
          semiColons: false,
          lineWidth: 120
        },
        lint: {
          rules: {
            exclude: ["require-await"]
          }
        }
      }
      

    fs.writeFileSync('./manifest.json', JSON.stringify(manifest, null, 4))
    fs.writeFileSync('./deps.ts', generateDepsCode())
    fs.writeFileSync('./deno.jsonc', JSON.stringify(denoSettings, null, 4))

    fs.mkdirSync('./symbols')

    const spinner = ora('Setting up the project.').start()
    execSync('deno task get_deps', { encoding: 'utf8' })
    spinner.succeed('Done!')

    console.log(initSuccessMessage)
}

export const initArgs = (yargs: Argv) => yargs

export const initCommand = (argv: ArgumentsCamelCase) => {
    inquirer
    .prompt([
        {
            name: 'moduleName',
            type: 'input',
            message: 'Module name:',
            validate: function(input) {
                if (isKebabCase(input)) {
                    return true
                } else {
                    return 'Module name must be a single word or in kebab-case :)'
                }
            }
        },
        {
            name: 'repoUrl',
            type: 'input',
            message: 'Repository URL:',
            default: '',
            validate: function(input) {
                if (input === '') return true
                try {
                    new URL(input)
                    return true
                } catch (_) { return false }
            }
        }
    ])
    .then((answers) => {
        setupProject(answers)
    })
}