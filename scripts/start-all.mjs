// scripts/start-all.mjs
const childProcess = require('child_process');

const apps = [
  { name: 'enter', port: 3000 },
  { name: 'project2', port: 3001 },
  { name: 'data-view', port: 8081 },
];

apps.forEach(({ name, port }) => {
  const proc = childProcess.spawn('pnpm', ['run', 'dev'], {
    cwd: `apps/${name}`,
    env: { ...process.env, PORT: port },
    stdio: 'inherit'
  });
  
  proc.on('error', (err) => {
    console.error(`启动 ${name} 失败:`, err);
  });
});