// deployVercel.js
const { execSync } = require('child_process');
const path = require('path');

async function deployVercel(dir, cfg) {
  if (!cfg.vercelToken) {
    console.error('Missing vercelToken in config.json');
    process.exit(1);
  }
  const projectDir = path.resolve(dir);
  const cmd = `npx vercel deploy --prod --cwd "${projectDir}" --token ${cfg.vercelToken} --confirm`;

  console.log('Deploying to Vercel...');
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log('✅ Deployment finished!');
  } catch (err) {
    console.error('❌ Vercel deployment failed:', err.message);
    process.exit(1);
  }
}

module.exports = deployVercel;
