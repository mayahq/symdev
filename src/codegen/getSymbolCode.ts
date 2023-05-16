import dedent from 'dedent-js'
import _ from 'lodash'
import { getManifest } from '../utils/manifest'
import { js as beautify } from 'js-beautify'

type GenerateSymbolCodeArgs = {
    name: string
    category: string
    description: string
}

export function generateSymbolCode({ name, category, description }: GenerateSymbolCodeArgs) {
    const paletteLabel = _.startCase(name)
    const className = paletteLabel.split(' ').join('')

    const code = dedent(`
    import { Symbol } from '../deps.ts'

    class ${className} extends Symbol {
        static schema = {
            propertiesSchema: {
                // Define the properties this symbol should expect, here.
            },
            editorProperties: {
                category: '${category}',
                icon: '',
                color: 'green',
                paletteLabel: '${paletteLabel}',
            },
        }

        onInit: Symbol['onInit'] = async (sendMessage) => {
            // Define what should happen when this symbol is deployed.
        }

        onMessage: Symbol['onMessage'] = async (msg, vals, sendMessage) => {
            // Define what should happen when this symbol receives a message.
        }
    }

    export default ${className}
    `)

    const beautifiedCode = beautify(code, {
        indent_size: 4, space_in_empty_paren: true
    })

    return beautifiedCode
}