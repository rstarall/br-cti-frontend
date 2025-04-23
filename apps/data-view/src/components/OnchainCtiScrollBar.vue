<template>
  <div id="scroll-board">
    <dv-scroll-board :config="option" />
  </div>
</template>

<script>
import {deepCopy} from "@/util/index.js";
export default {
  name: 'OnchainCtiScrollBoard',
  props: {
    dataInput:{
      type:Object,
      default:{}
    }
  },
  data () {
    return {
      option: {
        header: ['Tags', '时间', '链上Hash'],
        data: [
        ],
        index: true,
        columnWidth: [50, 200, 200,180],
        align: ['center'],
        rowNum: 6,
        headerBGC: '#1981f6',
        headerHeight: 45,
        oddRowBGC: 'rgba(0, 44, 81, 0.8)', 
        evenRowBGC: 'rgba(10, 29, 50, 0.8)',
        waitTime: 1500, // 轮播间隔时间,单位为毫秒
        carousel: 'single' // 开启单行轮播
      }
    }
  },
  watch:{
    dataInput(newVal,oldVal){
      if(newVal!=undefined){
        console.log('newVal',newVal)
        this.processInputData(newVal)
      }
    }
  },
  created() {
  },
  methods: {
    processInputData(dataInput){
      //处理数据
      try {
        const result = JSON.parse(dataInput.result)
        
        const newData = result.map(item => {
          return [
            item.tags.join(','),
            item.create_time,
            item.cti_hash.slice(0,10) + '...' + item.cti_hash.slice(-4)
          ]
        })
        //过滤新数据
        const newDataList = this.filterNewData(newData)
        if(newDataList.length==0) return
        //更新数据
        var currentData = this.option.data
        currentData.unshift(...newDataList) // 将新数据添加到头部
        currentData = currentData.slice(0,15) // 保持最多15条数据
        this.option = {
          ...this.option,
          data: currentData
        }
      } catch(e) {
        console.error('处理滚动数据出错:', e)
      }
    },
    filterNewData(dataList){
      var oldData = this.option.data
      var newDataList = []
      // 检查新数据是否已存在
      let hasNew = false
      for(let i = 0; i < dataList.length; i++){
        let found = false
        for(let j = 0; j < oldData.length; j++){
          if(dataList[i][2] === oldData[j][2]){ // 比较hash值
            found = true
            break
          }
        }
        if(!found){
          newDataList.push(dataList[i])
        }
      }
      return newDataList
    },
    mockNewData() {
      const tags = [
        'APT41,Malware',
        'Ransomware,Botnet', 
        'Phishing,Trojan',
        'APT28,Backdoor',
        'ZeroDay,Exploit',
        'DDoS,C2',
        'APT29,Rootkit',
        'Cryptojacking,RAT',
        'Spyware,Worm',
        'APT33,Keylogger',
        'Adware,Virus',
        'Malvertising,PUA'
      ];
      
      const now = new Date();
      const hash = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6);
      
      const newData = [
        tags[Math.floor(Math.random() * tags.length)],
        now.toLocaleString(),
        hash
      ];
      
      let currentData = this.option.data;
      currentData.unshift(newData);
      currentData = currentData.slice(0, 15);
      
      this.option = {
        ...this.option,
        data: currentData
      };
    }
  }
}
</script>

<style lang="less">
#scroll-board {
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  .dv-scroll-board{
    height: 100%;
    width: 100%;
  }
}
</style>
