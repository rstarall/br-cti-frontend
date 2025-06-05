'use client';

// 添加iframe高度自适应函数
function resizeIframe(frameId: string) {
  const iframe = document.getElementById(frameId) as HTMLIFrameElement;
  if (!iframe) return;
  
  try {
    // 尝试获取iframe内容高度
    const height = iframe.contentWindow?.document.body.scrollHeight;
    if (height) {
      iframe.style.height = `${height}px`;
    }
    
    // 添加消息监听，接收iframe内部发送的高度信息
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'resize-iframe' && event.data.frameId === frameId) {
        iframe.style.height = `${event.data.height}px`;
      }
    });
  } catch (e) {
    console.log('无法访问iframe内容，可能是跨域限制');
  }
}


const getCtiFrontendHost = () => {
  //判断当前页面域名是否为local
  if (typeof window !== 'undefined') {
    if(window.location.hostname.includes('localhost')||window.location.hostname.includes('127.0.0.1'))
    return 'http://127.0.0.1:3001';
  }
  return typeof window !== 'undefined' ? localStorage.getItem('ctiFrontendHost') || 'https://2.hb6dee21a.nyat.app:28607' : 'http://127.0.0.1:3001';
};

const ctiFrontendHost = getCtiFrontendHost();

export function CtiShare() {
  return (
    <div className="h-full w-full flex justify-center">
       <iframe
          id="shareFrame"
          src={ctiFrontendHost + "/client/local-data?hideNav=true&hideFooter=true"}
          title="情报共享"
          width="90%"
          height="800px"
          style={{border: 'none', overflow: 'auto'}}
          onLoad={() => resizeIframe('shareFrame')}
         />
    </div>
  );
}

export function CtiMarket() {
  return (
    <div className="p-4 w-full">
      <iframe
         id="marketFrame"
         src={ctiFrontendHost + "/cti-market?hideNav=true&hideFooter=true"}
         title="情报市场"
         width="100%"
         height="1800px"
         style={{border: 'none', overflow: 'auto'}}
         onLoad={() => resizeIframe('marketFrame')}
      />
    </div>
  );
}

export function CtiIncentive() {
  return (
    <div className="p-4 w-full">
      <iframe
        id="incentiveFrame"
        src= {ctiFrontendHost + "/client/incentive?hideNav=true&hideFooter=true"}
        title="激励机制"
        width="100%"
        height="1300px"
        style={{border: 'none', overflow: 'auto'}}
        onLoad={() => resizeIframe('incentiveFrame')}
      />
    </div>
  );
}

export function CtiKP() {
  return (
    <div className="p-4 w-full">
      <iframe 
        id="kpFrame"
        src= {ctiFrontendHost + "/knowledge-plane?hideNav=true&hideFooter=true"}
        title="知识平面"
        width="100%" 
        height="1500px"
        style={{border: 'none', overflow: 'auto'}}
        onLoad={() => resizeIframe('kpFrame')}
      />
    </div>
  );
}
