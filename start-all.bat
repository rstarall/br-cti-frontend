@echo off
echo 正在启动所有服务...

start cmd /k "cd /d d:\Work\program\Python\br-cti-frontend\br-cti-frontend\apps\enter && pnpm run dev"
timeout /t 5 /nobreak > nul

start cmd /k "cd /d d:\Work\program\Python\br-cti-frontend\br-cti-frontend\apps\qa-system && pnpm run dev"
timeout /t 5 /nobreak > nul

echo 所有服务已启动！
echo 访问地址：
echo - 情报共享平台: http://localhost:3000
echo - 安全智能问答系统: http://localhost:3002
pause