#!/usr/bin/env node
import { parse } from "../deps.ts";
import { addSymbolCommand } from './commands/add-symbol.ts'
import { initArgs, initCommand } from "./commands/init.ts";
// import { removeSymbolArgs, removeSymbolCommand } from "./commands/remove-symbol.ts";

const args = parse(Deno.args)
const command = args._[0]

async function handleCommand() {
    switch (command) {
        case 'add-symbol': return addSymbolCommand()
        case 'init': return initCommand()
    }
}


await handleCommand()
