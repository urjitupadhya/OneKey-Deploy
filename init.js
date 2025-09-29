// init.js
const fs = require('fs');
const path = require('path');       // ✅ must include
const readline = require('readline');

const ask = q => new Promise(r => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(q, ans => { rl.close(); r(ans.trim()); });
});

async function initProject() {
  const cfgPath = path.join(process.cwd(), 'config.json');
  const def = fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : {};

  const name = (await ask(`Project name [${def.name || 'pulstack-app'}]: `)) || def.name || 'pulstack-app';
  const target = (await ask(`Default target (aws|github|vercel) [${def.target || 'aws'}]: `)) || def.target || 'aws';
  const region = (await ask(`AWS region [${def.region || 'us-east-1'}]: `)) || def.region || 'us-east-1';
  const bucket = (await ask(`AWS S3 bucket name [${def.bucket || `${name}-site`}]: `)) || def.bucket || `${name}-site`;
  const repo = (await ask(`GitHub repo (owner/name) [${def.repo || ''}]: `)) || def.repo || '';
  const ghToken = (await ask(`GitHub token (leave blank to skip) [hidden]: `)) || def.ghToken || '';
  const vercelToken = (await ask(`Vercel token (leave blank to skip) [hidden]: `)) || def.vercelToken || '';
  const vercelProject = (await ask(`Vercel project name [${def.vercelProject || name}]: `)) || def.vercelProject || name;
  const stack = (await ask(`Pulumi stack name [${def.stack || 'dev'}]: `)) || def.stack || 'dev';
  const s3Prefix = (await ask(`S3 key prefix (optional) [${def.s3Prefix || ''}]: `)) || def.s3Prefix || '';
  const cloudfront = ((await ask(`Use CloudFront? (y/n) [${def.cloudfront ? 'y':'n'}]: `)) || (def.cloudfront ? 'y' : 'n')).toLowerCase().startsWith('y');

  const cfg = { name, target, region, bucket, repo, ghToken, vercelToken, vercelProject, stack, s3Prefix, cloudfront };
  fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));
  console.log('Saved config.json:');
  console.log(cfg);

  if (target === 'github' && !repo) console.log('Tip: set repo "owner/name" to enable GitHub deploy.');
  if (target === 'aws') console.log('Ensure AWS credentials are configured for aws-sdk and Pulumi.');
  if (target === 'vercel') console.log('Ensure VERCEL token has access to your account.');
}

function createSample() {
  const p = path.join(process.cwd(), 'site');
  if (!fs.existsSync(p)) fs.mkdirSync(p);
  const f = path.join(p, 'index.html');
  if (!fs.existsSync(f)) fs.writeFileSync(f, '<h1>Hello Pulstack</h1>');
}

module.exports = { initProject, createSample };

// auto-run if called directly
if (require.main === module) {
  initProject().then(() => createSample()).catch(e => { console.error(e); process.exit(1); });
}
