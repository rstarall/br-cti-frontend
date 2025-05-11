import React from 'react';

export function IncentiveMechanism() {
  return (
    <section id="incentive-mechanism" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">集成优势</h2>
          <div className="mt-2 h-1 w-20 bg-primary-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            智能博弈网络安全能力集成平台通过微前端架构将三大核心功能模块有机集成，实现了数据共享、功能协同和用户体验统一，为组织提供全方位的网络安全保障。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full mr-3">1</span>
              全面的安全防护
            </h3>
            <p className="text-gray-600 mb-4">
              通过集成风险发现、情报共享和智能防御三大功能，平台提供从威胁预警、情报分析到主动防御的全生命周期安全防护。
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>主动风险发现与预警</li>
              <li>多源情报整合与分析</li>
              <li>智能化攻击识别与防御</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full mr-3">2</span>
              数据共享与协同
            </h3>
            <p className="text-gray-600 mb-4">
              各功能模块之间实现数据无缝共享和协同工作，风险发现的结果可直接用于情报共享，情报分析结果可立即应用于智能防御。
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>跨模块数据实时共享</li>
              <li>威胁情报闭环处理</li>
              <li>安全策略自动联动</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full mr-3">3</span>
              灵活的扩展能力
            </h3>
            <p className="text-gray-600 mb-4">
              基于微前端架构的松耦合设计，平台具备极强的扩展性，可以根据需求灵活添加新功能模块或升级现有模块，而不影响整体系统稳定性。
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>模块化设计与独立部署</li>
              <li>按需扩展与定制</li>
              <li>技术栈灵活选择</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full mr-3">4</span>
              统一的用户体验
            </h3>
            <p className="text-gray-600 mb-4">
              尽管后台采用微前端架构实现模块独立，但用户界面保持统一的设计风格和交互模式，提供一致、流畅的用户体验。
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>统一的设计语言</li>
              <li>无缝的功能切换</li>
              <li>集中的用户认证</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">应用场景</h3>
          <p className="text-gray-600 mb-4">
            智能博弈网络安全能力集成平台适用于以下关键场景：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">企业安全防护</h4>
              <p className="text-gray-600">
                为企业提供全面的网络安全防护，从风险评估到主动防御，保障企业数字资产安全。
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">关键基础设施保护</h4>
              <p className="text-gray-600">
                为能源、金融、医疗等关键基础设施提供高级安全防护，抵御复杂网络攻击。
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">安全运营中心</h4>
              <p className="text-gray-600">
                为安全运营中心提供集成化工具平台，提升威胁发现、分析和响应能力。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
