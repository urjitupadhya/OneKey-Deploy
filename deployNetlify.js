// deployNetlify.js
const { spawn } = require('child_process');
const path = require('path');

module.exports = async (dir, cfg) => {
  if (!cfg.netlifyToken) throw new Error('Missing Netlify token in config.json (netlifyToken).');
  const args = ['netlify','deploy','--prod','--dir', path.resolve(dir), '--auth', cfg.netlifyToken];
  if (cfg.netlifySiteId) args.push('--site', cfg.netlifySiteId);
  console.log('Running:', 'npx', args.join(' '));
  const proc = spawn('npx', args, { stdio: ['ignore','pipe','pipe'] });
  let out = '', err = '';
  proc.stdout.on('data', d=>{ process.stdout.write(d); out += d.toString(); });
  proc.stderr.on('data', d=>{ process.stderr.write(d); err += d.toString(); });
  const urlRe = /(Live URL|Website Draft URL):\s*(https?:\/\/[^\s]+)/i;
  const res = await new Promise((resolve,reject)=>{
    proc.on('close', code=>{ code===0?resolve({code:0}):reject(new Error('Netlify CLI failed')); });
    proc.on('error', reject);
  });
  const m = out.match(urlRe);
  const url = m? m[2] : '';
  if (!url) console.log('Netlify deploy finished, URL may be above.'); else console.log('Netlify URL:', url);
  return url;
};

if (require.main===module){
  const fs = require('fs');
  const cfg = JSON.parse(fs.readFileSync(path.join(process.cwd(),'config.json'),'utf8'));
  const dir = process.argv[2]||'site';
  module.exports(path.resolve(dir), cfg).catch(e=>{ console.error(e); process.exit(1); });
}
