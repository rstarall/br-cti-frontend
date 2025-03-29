

import { Form, Input } from 'antd';
import { useState } from 'react';
import { CtiData } from '@/store/ctiStore';
import { useMessage } from '@/context/MessageProvider';
import { useWindowManager } from '@/context/WindowManager';
import { useCtiStore } from '@/store/ctiStore';
import { useUserStore } from '@/store/user';
import { UserEvaluateStake } from '@/store/user';
import { useLoading } from '@/context/LoadingProvider';
import { StakeStatusEnum,Transaction,TransactionTypeEnum } from '@/store/user';


const generateTransactionId = (): string => {
    // 获取当前时间的36进制表示
    const timeBase36 = Date.now().toString(36);
    
    // 生成安全随机数（兼容浏览器和Node.js）
    const crypto = window.crypto || (window as any).msCrypto;
    const randomBuffer = new Uint8Array(8);
    crypto.getRandomValues(randomBuffer);
    
    // 转换为36进制字符串
    const randomBase36 = Array.from(randomBuffer, byte => 
      byte.toString(36).padStart(2, '0')
    ).join('').slice(0, 10);
  
    // 组合成完整交易ID
    return `${timeBase36}${randomBase36}`.toLowerCase();
}

const EvaluateStakeModal = ({ cti, isOwner = false}: { cti: CtiData,isOwner?:boolean }) => {
  const { closeWindow } = useWindowManager();
  const { userInfo, addTransaction } = useUserStore();
  const { messageApi } = useMessage();
  const [form] = Form.useForm();
  const [reward, setReward] = useState(0);
  const [stake, setStake] = useState(0);
  const { updateCtiItem } = useCtiStore();
  const { showLoading, hideLoading } = useLoading();
  const calculateValues = (Q: number) => {
    const rewardValue = 0.9 * Math.log(1 + Q);
    const stakeValue = 0.1 * Math.log(1 + Q);
    setReward(Number(rewardValue.toFixed(2)));
    setStake(Number(stakeValue.toFixed(2)));
  };

  const createTokenTransaction = (from:string,to:string,amount:number) => {
    if(from ==''||to===''){
      return;
    }
    if(from === to){
      messageApi.error('不能给自己转账');
      return;
    }
    if(amount <= 0){
      messageApi.error('转账金额不能小于0');
      return;
    }
    if(from === 'platform'){
      messageApi.info(`收入${amount}积分`);
    }else{
      messageApi.info(`支出${amount}积分`);
    }
    const timestamp:string = new Date().toISOString()
    const outComeTransaction:Transaction = {
      transactionId: generateTransactionId(),
      transactionFrom: from,
      transactionTo: to,
      transactionToken: parseFloat(amount.toFixed(2)),
      transactionUserId: from,
      transactionType: TransactionTypeEnum.OUTCOME,
      timestamp: timestamp,
      refInfoId: cti.ctiId,
    }

    const inComeTransaction:Transaction = {
      transactionId: generateTransactionId(),
      transactionFrom: to,
      transactionTo: from,
      transactionToken: parseFloat(amount.toFixed(2)),
      transactionUserId: from,
      transactionType: TransactionTypeEnum.INCOME,
      timestamp: timestamp,
      refInfoId: cti.ctiId,
    }
    //支出
    addTransaction(from,outComeTransaction);
    //收入
    addTransaction(to,inComeTransaction);
  }


  const updateOwnerStake = (cti:CtiData) => {
    const requesterEvaluateList = cti.requesterEvaluateList || [];
    const currentCtiItem = cti;
    if(requesterEvaluateList.length >= 3 &&cti.stakeStatus === StakeStatusEnum.STAKING){
      //评论数量大于3，且提供者已进行评价，则判断评估者的分数决定是否扣除押金，否则添加及时奖励
      const ownerEvaluateQuality = cti.evaluateQuality||0;
      const avgEvaluateQuality = cti.avgEvaluateQuality||0;
      if(Math.abs(ownerEvaluateQuality - avgEvaluateQuality) > 0.3*avgEvaluateQuality){
        currentCtiItem.stakeStatus = StakeStatusEnum.DEDUCTED; //评估质量与平均评估质量相差超过30%，扣除押金
      }else{
        currentCtiItem.reward = parseFloat((currentCtiItem.reward + currentCtiItem.stake).toFixed(2));
        if(currentCtiItem.stakeStatus === StakeStatusEnum.RETURNED)return;
        currentCtiItem.stakeStatus = StakeStatusEnum.RETURNED; //评估质量与平均评估质量相差不超过30%，返回押金
        //押金转账
        createTokenTransaction('platform',currentCtiItem.walletId,currentCtiItem.stake);
      }
    }
    updateCtiItem(cti.ctiId, {
      ...currentCtiItem,
    });
  }

  const onFinish = (values: { Q: number }) => {
    
    const currentCtiItem = cti
    if (isOwner) {
      if(currentCtiItem.evaluateStatus){
        messageApi.info('不可重复评估');
        closeWindow("evaluate-stake-modal");
        return;
      };
      //评估后平台给予奖励
      if(currentCtiItem.stakeStatus === StakeStatusEnum.UNSTAKED){
        createTokenTransaction('platform',userInfo?.walletId,reward);
      }
      currentCtiItem.evaluateStatus = true;
      currentCtiItem.evaluateQuality = values.Q;
      currentCtiItem.reward = reward;
      currentCtiItem.stake = stake;
      currentCtiItem.stakeStatus = StakeStatusEnum.STAKING;
      currentCtiItem.requesterEvaluateList = cti.requesterEvaluateList || [];
      updateCtiItem(cti.ctiId, {
        ...currentCtiItem,
      });
      //更新提供者押金
      updateOwnerStake(currentCtiItem);
      messageApi.success('评估提交成功');
    }else{
      const requesterEvaluateList = currentCtiItem.requesterEvaluateList || [];
      const existEvaluate = requesterEvaluateList.find((item) => item.walletId === userInfo?.walletId);
      if(existEvaluate){
         messageApi.info('不可重复评估');
         closeWindow("evaluate-stake-modal");
         return;
      }
      const newEvaluate = {
        ctiId: cti.ctiId,
        walletId: userInfo?.walletId,
        evaluateQuality: values.Q,
        avgEvaluateQuality: 0,
        stake: parseFloat((0.1*values.Q).toFixed(2)),
        stakeStatus: StakeStatusEnum.STAKING,
      } as UserEvaluateStake
      requesterEvaluateList.push(newEvaluate);
      //押金转账
      createTokenTransaction(userInfo?.walletId, 'platform',newEvaluate.stake);
      messageApi.success('评估提交成功');
       let avgEvaluateQuality = requesterEvaluateList.reduce((acc, curr) => acc + curr.evaluateQuality, 0) / requesterEvaluateList.length;
       avgEvaluateQuality = parseFloat(avgEvaluateQuality.toFixed(2));
       requesterEvaluateList.forEach(item => {
          item.avgEvaluateQuality = avgEvaluateQuality;
          if(item.stakeStatus !== StakeStatusEnum.STAKING)return; //不可重复评估
          if(requesterEvaluateList.length > 3 &&Math.abs(item.evaluateQuality - avgEvaluateQuality) > 0.3*avgEvaluateQuality){
            item.stakeStatus = StakeStatusEnum.DEDUCTED; //评估质量与平均评估质量相差超过30%，扣除押金
          }else{
            item.stakeStatus = StakeStatusEnum.RETURNED; //评估质量与平均评估质量相差不超过30%，返回押金
            //押金转账
            if(item.walletId !== 'platform'){
              createTokenTransaction('platform',item.walletId,item.stake);
            }
          }
       });
      currentCtiItem.avgEvaluateQuality = avgEvaluateQuality;
      currentCtiItem.requesterEvaluateList = requesterEvaluateList;
      updateCtiItem(cti.ctiId, {
        ...currentCtiItem,
      });
      //更新提供者押金
      updateOwnerStake(currentCtiItem);
    }
    form.resetFields();
    closeWindow("evaluate-stake-modal");
    showLoading();
    setTimeout(() => {
      hideLoading();
    }, 500+Math.random()*1000);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className='bg-transparent flex flex-col space-y-2'
    >
      <Form.Item label="情报ID" name="ctiId">
        <Input disabled defaultValue={cti.ctiId} />
      </Form.Item>
      <Form.Item label="情报内容" name="data">
        <div className='bg-gray-100 p-2 rounded-md'>
          {cti.data||'{ this is an redos cti data }'} 
        </div>
      </Form.Item>

      <Form.Item 
        label="质量 Q (0-100)" 
        name="Q" 
        rules={[
          { required: true, message: '请输入质量评分' },
          {
            validator: (_, value) => {
              if (value < 0) {
                return Promise.reject('质量评分不能小于0');
              }
              if (value > 100) {
                return Promise.reject('质量评分不能大于100');
              }
              return Promise.resolve();
            }
          }
        ]}
      >
        <Input 
          type="number" 
          min={0}
          max={100}
          onChange={(e) => {
            let value = Number(e.target.value);
            // 自动修正超出范围的值
            if (value < 0) value = 0;
            if (value > 100) value = 100;
            calculateValues(value);
            form.setFieldsValue({ Q: value }); // 更新表单值
          }}
        />
      </Form.Item>

      {isOwner&&(
      <Form.Item label="及时奖励 Reward (0.9*ln(1+Q))">
        <Input value={reward} disabled />
      </Form.Item>)}

      <Form.Item label="预期抵押金 (0.1*ln(1+Q))">
        <Input value={stake} disabled />
      </Form.Item>

      <div className="text-red-500 text-sm mb-2">
        请正确评估质量，否则会扣除押金
      </div>

      <Form.Item  noStyle>
        <div className="flex justify-end space-x-2 mb-2">
          <div className='mx-2 bg-sky-800 text-white px-3 py-1 rounded shadow-sm cursor-pointer' onClick={() => form.resetFields()}>重置</div>
          <div className='mx-2 bg-green-500 text-white px-3 py-1 rounded  shadow-sm cursor-pointer' onClick={() => form.submit()}>确认</div>
        </div>
      </Form.Item>
    </Form>
  );
}

export default EvaluateStakeModal;
