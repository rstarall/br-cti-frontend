<template>
  <div id="cards">
    <div
      class="card-item"
      v-for="(card, i) in cards"
      :key="card.title"
      >
      <div class="card-header">
        <div class="card-header-left">{{ '0' + (i + 1) }}</div>
        <div class="card-header-right">{{ card.title }}</div>
        
      </div>
      <dv-charts class="ring-charts" :option="card.ring" />
    </div>
  </div>
</template>

<script>
import {deepCopy} from "@/util/index.js";
export default {
  name: 'BlockchainStatusCards',
  props:{
    dataInput:{
      type:Object,
      default:{}
    }
  },
  data () {
    return {
      cards: [],
      chartData: {
        ipfsSize: 128, // GB
        intelCount: 5678 // 情报数量
      }
    }
  },
  watch:{
    dataInput(newVal,oldVal){
      if(newVal!=undefined){
        console.log('blockchainStatusData newVal',newVal)
        let data = this.processInputData(newVal)
        //更新图表
        this.updateChartData(data)
      }
    }
  },
  created(){
  },
  methods: {
    processInputData(dataInput){
      //处理数据
      //处理数据
      let blockchainStatusData = {}
      if(dataInput!=undefined){
        try{
          //处理数据
          let jsonData = JSON.parse(dataInput.result)
          //将IPFS文件大小从bytes转为GB
          let ipfsData = this.getFileSizeUnit(jsonData.total_cti_data_size || 0)
          console.log('ipfsData',ipfsData)
          //获取情报总数
          let intelCount = jsonData.total_cti_data_num || 0
          
          blockchainStatusData = {
            ipfsSize: ipfsData,
            intelCount: {
              value:intelCount,
              unit:'条'
            }
          }
        } catch(e) {
          console.error("处理区块链状态数据出错:", e)
          blockchainStatusData = {
            "ipfsSize": {
              "value":0,
              "unit":'GB'
            },
            "intelCount": {
              "value":0,
              "unit":'条'
            }  
          }
        }
      }
      return blockchainStatusData
    },
    updateChartData (blockchainStatusData) {
      const charts_label_list = ['IPFS文件', '链上情报']
      const charts_unit_list = [blockchainStatusData.ipfsSize.unit, blockchainStatusData.intelCount.unit]
      const values = [blockchainStatusData.ipfsSize.value, blockchainStatusData.intelCount.value]
      
      this.cards = new Array(2).fill(0).map((foo, i) => ({
        title: charts_label_list[i],
        ring: {
          series: [
            {
              type: 'gauge',
              startAngle: -Math.PI / 2,
              endAngle: Math.PI * 1.5,
              arcLineWidth: 13,
              radius: '80%',
              data: [
                { name: '数量', value: values[i] }
              ],
              axisLabel: {
                show: false
              },
              axisTick: {
                show: false
              },
              pointer: {
                show: false
              },
              backgroundArc: {
                style: {
                  stroke: '#224590'
                }
              },
              details: {
                show: true,
                formatter: '{value}'+charts_unit_list[i],
                style: {
                  fill: '#1ed3e5',
                  fontSize: 20
                }
              }
            }
          ],
          color: ['#03d3ec']
        }
      }))
    },
    getFileSizeUnit(size){
      //输入大小为bytes
      //获取文件大小单位和格式化的数字
      let unit = 'B'
      let formattedSize = size
      if(size >= 1024*1024*1024*1024){
        unit = 'TB'
        formattedSize = (size/(1024*1024*1024*1024)).toFixed(2)
      }else if(size >= 1024*1024*1024){
        unit = 'GB'
        formattedSize = (size/(1024*1024*1024)).toFixed(2)
      }else if(size >= 1024*1024){
        unit = 'MB'
        formattedSize = (size/(1024*1024)).toFixed(2)
      }else if(size >= 1024){
        unit = 'KB'
        formattedSize = (size/1024).toFixed(2)
      }
      return {
        value: parseFloat(formattedSize),
        unit:unit
      }
    },
    randomExtend (minNum, maxNum) {
      if (arguments.length === 1) {
        return parseInt(Math.random() * minNum + 1, 10)
      } else {
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
      }
    }
  }
}
</script>

<style lang="less">
#cards {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  width: 100%;

  .card-item {
    background-color: rgba(6, 30, 93, 0.5);
    border-top: 2px solid rgba(1, 153, 209, .5);
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .card-header {
    display: flex;
    height: 20%;
    align-items: center;
    justify-content: flex-start;

    .card-header-left {
      height: 100%;
      font-size: 14px;
      font-weight: bold;
      font-size: 90%;
      margin-left: 20px;
      width: 10%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-header-right {
      height: 100%;
      margin-left: 5px;
      font-size: 14px;
      color: #03d3ec;
      width: 60%;
      text-align: left;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .ring-charts {
    height: 100%;
  }
}
</style>
