import { Link } from 'react-router-dom'

export const FooterLayout = () => {
  return (
    <footer className="bg-footer-600 text-footer-500 text-[14px]  cursor-default">
      <div className="w-[80%] pt-[20px] pb-[20px] pl-[10%] pr-[10%]">
        <div className="w-[100%] grid grid-cols-3 gap-8">
          <div className="flex flex-col gap-2 ">
            <p className="text-[1.2rem] text-white">平台描述</p>
            <p className="cti_copyrightCon">
              本平台是一个基于区块链技术构建的网络安全威胁情报（CTI）共享平台，旨在促进高质量CTI服务的可持续发展。
              本平台采用的是三方(用户、CTI提供方、平台方)共享付费的形式，并使用博弈论动态定价机制，最优化CTI价格，在保证CTI质量的同时，使得三方都获得良好收益。
            </p>
          </div>
          
          <div className="flex flex-col gap-2 pl-[20%]">
            <p className="text-[1.2rem] text-white">导航</p>
            <ul className="flex flex-col gap-1">
              <li><Link to="/index">首页</Link></li>
              <li><Link to="/introduction">平台介绍</Link></li>
              <li><Link to="/cti-market">CTI市场</Link></li>
              <li><Link to="/login">登录</Link></li>
              <li><Link to="/register">注册</Link></li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-2 pl-[10%]">
            <p className="text-[1.2rem] text-white">友情链接</p>
            <ul>
              <li><a href="https://blockchain-neu.com/" target="_blank" rel="noopener noreferrer">B&R课题组</a></li>
              <li><a href="http://wyy.gzhu.edu.cn" target="_blank" rel="noopener noreferrer">广大方班</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="pl-[10%] pr-[10%] text-[1rem] w-[100%] h-[50px] flex items-center " style={{ backgroundColor: '#242934' }}>
        <div className="grid grid-cols-3">
          <p className="text-white">团队:B&R课题组</p>
          <a 
            className="text-footer-text-500" 
            href="https://beian.miit.gov.cn" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#757980' }}
          >
            粤ICP备10012221号-1
          </a>
          <span className="text-footer-text-500" style={{ width: '400px' }}>
            如有问题请联系&nbsp;&nbsp;B&R@gzhu.edu.cn
          </span>
        </div>
      </div>
    </footer>
  )
}
