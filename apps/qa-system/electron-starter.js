const { app, BrowserWindow, shell } = require('electron');
const next = require('next');
const http = require('http');
const { parse } = require('url');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

let mainWindow;

// 检查端口是否可用
// function checkPort(port) {
//     return new Promise((resolve) => {
//         const testServer = http.createServer()
//             .listen(port, () => {
//                 testServer.close();
//                 resolve(true);
//             })
//             .on('error', () => {
//                 resolve(false);
//             });
//     });
// }

// 等待服务器准备就绪
function waitForServer(url, timeout = 30000, interval = 100) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        const check = () => {
            http.get(url, (res) => {
                console.log('Server is ready');
                resolve(true);
            }).on('error', (err) => {
                console.log('Server is not ready');
                if (Date.now() - startTime > timeout) {
                    reject(new Error('Server timeout'));
                    return;
                }
                setTimeout(check, interval);
            });
        };
        
        check();
    });
}

async function createWindow() {
    try {
        // 先准备 Next.js
        await nextApp.prepare();
        
        // 创建 HTTP 服务器
        const server = http.createServer((req, res) => {
            const parsedUrl = parse(req.url, true);
            handle(req, res, parsedUrl);
        });
        
        // 启动服务器
        server.listen(3000, async (err) => {
            if (err) throw err;
            
            // 等待服务器真正准备就绪
            await waitForServer('http://localhost:3000');
            
            mainWindow = new BrowserWindow({
                width: 800,
                height: 600,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                    preload: __dirname + '/preload.js'
                }
            });

            await mainWindow.loadURL('http://localhost:3000');

            mainWindow.on('closed', function () {
                mainWindow = null;
                server.close();
            });

            const handleRedirect = (e, url) => {
                if(url !== mainWindow.webContents.getURL()) {
                    e.preventDefault();
                    shell.openExternal(url);
                }
            };

            mainWindow.webContents.on('will-navigate', handleRedirect);
            mainWindow.webContents.on('new-window', handleRedirect);
        });
    } catch (error) {
        console.error('Error starting app:', error);
        app.quit();
    }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
