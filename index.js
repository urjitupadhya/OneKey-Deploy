#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

// Import modules
const { initProject } = require('./init');
const deployAws = require('./deploy');          // optional if you use AWS
const deployGithub = require('./deployGithub'); // optional if you use GitHub
const deployVercel = require('./deployVercel');
const deployNetlify = require('./deployNetlify');
const destroy = require('./destroy');

const pkg = { version: '1.0.0' };
const program = new Command();

// Read config.json safely
const readConfig = () => {
  const f = path.join(process.cwd(), 'config.json');
  if (!fs.existsSync(f)) return null;
  try {
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch (err) {
    console.error('Invalid JSON in config.json:', err.message);
    return null;
  }
};

// CLI Setup
program
  .name('pulstack')
  .description('Deploy static sites to AWS/GitHub/Vercel/Netlify')
  .version(pkg.version);

// Init command
program
  .command('init')
  .description('Create config.json')
  .action(async () => { await initProject({}); });

// Deploy command
program
  .command('deploy')
  .description('Deploy site')
  .requiredOption('--dir <dir>', 'source dir')
  .requiredOption('--target <t>', 'aws|github|vercel|netlify')
  .action(async (opts) => {
    const dir = path.resolve(opts.dir);
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      console.error('Error: invalid --dir');
      process.exit(1);
    }

    const cfg = readConfig();
    if (!cfg) {
      console.error('Missing or invalid config.json. Run: pulstack init');
      process.exit(1);
    }

    switch (opts.target) {
      case 'aws':
        await deployAws(dir, cfg);
        break;
      case 'github':
        await deployGithub(dir, cfg);
        break;
      case 'vercel':
        await deployVercel(dir, cfg);
        break;
      case 'netlify':
        await deployNetlify(dir, cfg);
        break;
      default:
        console.error('Unknown target. Must be: aws|github|vercel|netlify');
        process.exit(1);
    }
  });

// Destroy command
program
  .command('destroy')
  .description('Tear down deployment')
  .action(async () => {
    const cfg = readConfig();
    if (!cfg) {
      console.error('Missing config.json. Run: pulstack init');
      process.exit(1);
    }
    await destroy(cfg);
  });

// Help examples
program.addHelpText('after', `
Examples:
  pulstack init
  pulstack deploy --dir site --target aws
  pulstack deploy --dir site --target github
  pulstack deploy --dir site --target vercel
  pulstack deploy --dir site --target netlify
  pulstack destroy
`);

program.showHelpAfterError();
program.parseAsync(process.argv).catch(e => {
  console.error(e.message || e);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', e => {
  console.error(e);
  process.exit(1);
});

module.exports = program;
