// deployVercel.js
const { exec } = require('child_process');
const path = require('path');

async function deployVercel(dir, cfg) {
  if (!cfg.vercelToken || !cfg.vercelProject) {
    console.error('Missing vercelToken or vercelProject in config.json');
    process.exit(1);
  }

  // Wrap the directory in double quotes to handle spaces
  const command = `npx vercel --prod --confirm --token ${cfg.vercelToken} --cwd "${path.resolve(dir)}"`;
  console.log('Deploying to Vercel...');

  return new Promise((resolve, reject) => {
    const proc = exec(command, (err, stdout, stderr) => {
      if (err) return reject(err);
      console.log(stdout);
      if (stderr) console.error(stderr);
      resolve();
    });

    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
  });
}

module.exports = deployVercel;
