#!/usr/bin/env node
import { Command } from "commander";
import { addComponents } from "./add.js";
const program = new Command();
import pkg from "../package.json";

program.name(pkg.name).description(pkg.description).version(pkg.version);
program
  .command("add [components...]")
  .description("Add one or more components")
  .action((components: string[]) => {
    addComponents(components);
  });

program.parse();
