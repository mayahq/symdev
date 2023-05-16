import yargs, {Argv} from "yargs";

import { addSymbolArgs, addSymbolCommand } from './commands/add-symbol'
import { initArgs, initCommand } from "./commands/init";
import { removeSymbolArgs, removeSymbolCommand } from "./commands/remove-symbol";

yargs
    .command('add-symbol', "Create a new symbol", addSymbolArgs, addSymbolCommand)
    .command('remove-symbol', "Remove a symbol", removeSymbolArgs, removeSymbolCommand)
    .command('init', "Initialise a new Maya Symbols project", initArgs, initCommand)
    .argv;
