import React from 'react';

export function IncentiveMechanism() {
  return (
    <section id="incentive-mechanism" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">激励机制</h2>
          <div className="mt-2 h-1 w-20 bg-primary-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            B&R去中心化威胁情报共享平台采用创新的代币经济模型，激励用户积极参与情报的贡献和验证，形成良性循环的情报共享生态。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full mr-3">1</span>
              情报贡献奖励
            </h3>
            <p className="text-gray-600 mb-4">
              用户可以通过上传原创威胁情报获得代币奖励。奖励数量根据情报的质量、稀缺性和实用性进行动态计算。
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>原创情报上传：10-100 积分</li>
              <li>高质量情报额外奖励：最高 200 积分</li>
              <li>首次发现新威胁：额外 300 积分</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full mr-3">2</span>
              情报验证奖励
            </h3>
            <p className="text-gray-600 mb-4">
              用户可以通过验证其他用户提交的情报获得代币奖励。验证过程包括确认情报的准确性、完整性和时效性。
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>情报验证参与：5-20 积分</li>
              <li>发现错误情报：30-50 积分</li>
              <li>提供补充信息：10-30 积分</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full mr-3">3</span>
              模型贡献奖励
            </h3>
            <p className="text-gray-600 mb-4">
              用户可以通过上传和共享B&R检测和防御模型获得代币奖励。模型的性能和实用性将直接影响奖励数量。
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>模型上传：50-200 积分</li>
              <li>高性能模型：额外 100-300 积分</li>
              <li>模型被下载使用：每次 5 积分</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full mr-3">4</span>
              社区贡献奖励
            </h3>
            <p className="text-gray-600 mb-4">
              用户可以通过参与社区讨论、回答问题、提供反馈等方式获得代币奖励，促进社区的活跃度和知识共享。
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>回答问题：5-20 积分</li>
              <li>提供有价值的反馈：10-30 积分</li>
              <li>参与社区讨论：1-5 积分</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">积分使用</h3>
          <p className="text-gray-600 mb-4">
            用户可以使用获得的积分进行以下操作：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">购买情报</h4>
              <p className="text-gray-600">
                使用积分购买其他用户共享的高质量威胁情报，提升安全防御能力。
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">获取模型</h4>
              <p className="text-gray-600">
                使用积分下载和使用平台上的检测和防御模型，增强安全工具箱。
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">提升权限</h4>
              <p className="text-gray-600">
                使用积分提升账户权限等级，获取更多平台功能和资源访问权限。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
