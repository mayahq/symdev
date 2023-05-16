import { Manifest } from '../utils/manifest.ts'
import { generateDepsCode } from '../codegen/getDenoDeps.ts'
import { 
    inquirer,
    ora,
    chalk,
    yargs,
    lodash as _
} from '../../deps.ts'

type SetupArgs = {
    moduleName: string;
    repoUrl: string;
}

function isKebabCase(str: string) {
    return /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/.test(str)
}

function denoIsInstalled(): boolean {
    try {
        const cmd = new Deno.Command("deno", { args: ['--version'] })
        const output = cmd.outputSync()
        if (output.code !== 0) {
            return false
        }
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
      

    Deno.writeTextFileSync('./manifest.json', JSON.stringify(manifest, null, 4))
    Deno.writeTextFileSync('./deps.ts', generateDepsCode())
    Deno.writeTextFileSync('./deno.jsonc', JSON.stringify(denoSettings, null, 4))

    Deno.mkdirSync('./symbols', { recursive: true })

    const spinner = ora('Setting up the project.').start()

    const cmd = new Deno.Command('deno', { args: ['task', 'get_deps'] })
    const output = cmd.outputSync()
    if (output.code !== 0) {
        spinner.fail('Failed.')
        throw new Error('There was an unexpected error initialising the project.')
    }

    spinner.succeed('Done!')

    console.log(initSuccessMessage)
}

export const initArgs = (yargs: unknown) => yargs

export const initCommand = async () => {
    inquirer
    .prompt([
        {
            name: 'moduleName',
            type: 'input',
            message: 'Module name:',
            validate: function(input: string) {
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
            validate: function(input: string) {
                if (input === '') return true
                try {
                    new URL(input)
                    return true
                } catch (_) { return false }
            }
        }
    ])
    .then((answers: any) => {
        setupProject(answers)
    })
}