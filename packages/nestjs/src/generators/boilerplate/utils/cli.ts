import yargs from 'yargs';
import { BoilerplateGeneratorCommand } from '../generate-boilerplate.command';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs
  .command(new BoilerplateGeneratorCommand())
  .strict()
  .help('h')
  .alias('h', 'help').argv;
