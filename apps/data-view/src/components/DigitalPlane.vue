<template>
  <div id="digital-flop">
    <div
      class="digital-flop-item"
      v-for="item in digitalFlopData"
      :key="item.title"
      >
      <div class="digital-flop-title">{{ item.title }}</div>
      <div class="digital-flop">
        <dv-digital-flop
          :config="item.number"
          style="width:100px;height:50px;"
           />
          <div class="unit">{{ item.unit }}</div>
      </div>
    </div>

    <dv-decoration-10 />
  </div>
</template>

<script>
import { deepCopy } from '@/util/index.js'

export default {
  name: 'DigitalPlane',
  props:{
    dataInput:{
      type:Object,
      default:{}
    }
  },
  data () {
    return {
      digitalPlaneData:{
            "blockHeight":{
              'title':'区块高度',
              'number':0,
              'fill_color':'#4d99fc',
              'unit':'块'
            },
            "blockTx":{
              'title':'区块交易', 
              'number':0,
              'fill_color':'#f46827',
              'unit':'笔'
            },
            "ctiValue":{
              'title':'情报价值',
              'number':0,
              'fill_color':'#40faee',
              'unit':'积分'
            },
            "ctiCount":{
              'title':'情报数量',
              'number':0,
              'fill_color':'#4d99fc',
              'unit':'条'
            },
            "ctiTx":{
              'title':'情报交易',
              'number':0,
              'fill_color':'#f46827',
              'unit':'笔'
            },
            "iocsCount":{
              'title':'IOCs数量',
              'number':0,
              'fill_color':'#4d99fc',
              'unit':'个'
            },
            "accountCount":{
              'title':'账户数量',
              'number':0,
              'fill_color':'#4d99fc',
              'unit':'个'
            }
      },
      digitalFlopData: [] // 添加digitalFlopData数据属性
    }
  },
  watch:{
    dataInput(newVal,oldVal){
      if(newVal!=undefined){
        console.log('newVal',newVal)
        let digitalPlaneData = this.processInputData(newVal)
        this.updataData(digitalPlaneData)
      }
    },
  },
  created(){
    if(this.dataInput!=undefined){
      this.processInputData(this.dataInput)
    }
    this.updataData(this.digitalPlaneData)
    
  },
  methods: {
    processInputData(dataInput){
      let newDigitalPlaneData = this.digitalPlaneData
      try {
        if(dataInput && dataInput.result) {
          newDigitalPlaneData['blockHeight']['number'] = dataInput.result.block_height || 0
          newDigitalPlaneData['blockTx']['number'] = dataInput.result.total_transactions || 0
          newDigitalPlaneData['ctiValue']['number'] = dataInput.result.cti_value || 0
          newDigitalPlaneData['ctiCount']['number'] = dataInput.result.cti_count || 0
          newDigitalPlaneData['ctiTx']['number'] = dataInput.result.cti_transactions || 0
          newDigitalPlaneData['iocsCount']['number'] = dataInput.result.iocs_count || 0
          newDigitalPlaneData['accountCount']['number'] = dataInput.result.account_count || 0
        } 
      } catch(e) {
        console.error("处理数字面板数据出错:", e)
        
      }
      this.digitalPlaneData = newDigitalPlaneData
      return newDigitalPlaneData
    },
    loopMockDigitalPlaneData(){
      //随机一些数据
      let newMockDigitalPlaneData = this.genMockDigitalPlaneData()
      //更新数据
      this.updataData(newMockDigitalPlaneData)
  
    },
    updataData (digitalPlaneData) {
      let newDigitalFlopData = []
      Object.keys(digitalPlaneData).forEach((key)=>{
        newDigitalFlopData.push({
          title: digitalPlaneData[key]['title'],
          number: {
            number: [digitalPlaneData[key]['number']],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: digitalPlaneData[key]['fill_color'],
              fontWeight: 'bold'
            }
          },
          unit: digitalPlaneData[key]['unit']
        })
      })
      this.digitalFlopData = newDigitalFlopData // 修改为digitalFlopData
    },
    randomExtend (minNum, maxNum) {
      if (arguments.length === 1) {
        return parseInt(Math.random() * minNum + 1, 10)
      } else {
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
      }
    }

  },
  mounted () {
  }
}
</script>

<style lang="less">
#digital-flop {
  position: relative;
  height: 48%;
  margin-bottom:2%;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(6, 30, 93, 0.5);

  .dv-decoration-10 {
    position: absolute;
    width: 95%;
    left: 2.5%;
    height: 5px;
    bottom: 0px;
  }

  .digital-flop-item {
    width: 11%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-left: 3px solid rgb(6, 30, 93);
    border-right: 3px solid rgb(6, 30, 93);
  }

  .digital-flop-title {
    font-size: 20px;
  }

  .digital-flop {
    display: flex;
  }

  .unit {
    margin-left: 10px;
    display: flex;
    align-items: flex-end;
    box-sizing: border-box;
    padding-bottom: 13px;
  }
}
</style>
