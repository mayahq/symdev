import { dedent, lodash as _, beautify } from '../../deps.ts'

export function generateDepsCode() {
    const code = dedent(`
    export {
        Symbol,
        TypedInput,
        Field,
        Schema,
        SymbolDsl
    } from 'https://deno.land/x/maya_runtime/mod.ts'
    `)

    return beautify(code, {
        indent_size: 4, space_in_empty_paren: true
    })
}