#!/usr/bin/env node
import { parse } from "../deps.ts";
import { addSymbolCommand } from './commands/add-symbol.ts'
import { initCommand } from "./commands/init.ts";
import { removeSymbolCommand } from "./commands/remove-symbol.ts";
// import { removeSymbolArgs, removeSymbolCommand } from "./commands/remove-symbol.ts";

const args = parse(Deno.args)
const command = args._[0]
console.log(args)

async function handleCommand() {
    switch (command) {
        case 'add-symbol': return addSymbolCommand()
        case 'init': return initCommand()
        case 'remove-symbol': return removeSymbolCommand({ name: args._[0] as string, hard: args.hard as boolean})
    }
}

await handleCommand()
