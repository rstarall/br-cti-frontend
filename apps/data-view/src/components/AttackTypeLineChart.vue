<template>
  <div id="attack-type-line-chart">
    <div class="dv-charts-container" id="attackTypeLineChart" style="width: 100%; height: 100%;" ></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: 'AttackTypeLineChart',
  props: { 
    animation:{
      type:Boolean,
      default:true
    },
    darkTheme:{
      type:Boolean,
      default:true
    },
    dataInput:{
      type:Object,
      default:{}
    }
  },
  data () {
    return {
      option: {},
      lineChart:{},
      lineData: {
        timestamps: [],
        ddosAttacks: [],
        malware: [],
        phishing: [],
        botnet: [],
        appAttacks: []
      }
    }
  },
  watch:{
    dataInput(newVal,oldVal){
      if(newVal!=undefined)
        this.processAndAppendData(newVal)
    }
  },
  created() {
    this.$nextTick(() => {
      this.initLineChart()
      this.updateOptionData(this.lineData)
    });
  },
  methods: {
    processAndAppendData(inputData){
      try {
        const result = JSON.parse(inputData.result)
        const rankings = result.rankings
        
        // 获取当前时间
        const now = new Date().toLocaleTimeString('zh-CN', {hour12: false})
        
        // 添加新的时间戳
        this.lineData.timestamps.push(now)
        if(this.lineData.timestamps.length > 10) {
          this.lineData.timestamps.shift()
        }

        // 从rankings中获取各类型的count并添加到对应数组
        const trafficCount = rankings.find(r => r.type === 'TRAFFIC')?.count || 0
        const honeypotCount = rankings.find(r => r.type === 'HONEYPOT')?.count || 0  
        const botnetCount = rankings.find(r => r.type === 'BOTNET')?.count || 0
        const appLayerCount = rankings.find(r => r.type === 'APP_LAYER')?.count || 0
        const otherCount = rankings.find(r => r.type === 'OTHER')?.count || 0

        // 添加新数据并增加波动
        this.lineData.ddosAttacks.push(Math.floor(trafficCount + (10 + Math.random() * 20)))
        this.lineData.malware.push(Math.floor(honeypotCount + (10 + Math.random() * 20)))
        this.lineData.phishing.push(Math.floor(otherCount + (10 + Math.random() * 20)))
        this.lineData.botnet.push(Math.floor(botnetCount + (10 + Math.random() * 20)))
        this.lineData.appAttacks.push(Math.floor(appLayerCount + (10 + Math.random() * 20)))

        // 保持数组长度为20
        if(this.lineData.ddosAttacks.length > 30) {
          this.lineData.ddosAttacks.shift()
          this.lineData.malware.shift()
          this.lineData.phishing.shift()
          this.lineData.botnet.shift()
          this.lineData.appAttacks.shift()
        }

        this.updateOptionData(this.lineData)
      } catch(e) {
        console.error("处理攻击类型趋势数据出错:", e)
      }
    },
    initLineChart() {
      this.lineChart = echarts.init(document.getElementById('attackTypeLineChart'),this.darkTheme?'dark':'');
    },
    generateMockData() {
      const now = new Date()
      const timestamps = []
      const ddosAttacks = []
      const malware = []
      const phishing = []
      const botnet = []
      const appAttacks = []

      for(let i = 0; i < 10; i++) {
        timestamps.push(new Date(now - (9-i) * 3600000).toLocaleTimeString('zh-CN', {hour12: false}))
        ddosAttacks.push(this.randomExtend(50, 100))
        malware.push(this.randomExtend(30, 80))
        phishing.push(this.randomExtend(20, 60))
        botnet.push(this.randomExtend(10, 50))
        appAttacks.push(this.randomExtend(5, 40))
      }

      this.lineData = {
        timestamps,
        ddosAttacks,
        malware,
        phishing,
        botnet,
        appAttacks
      }
    },
    updateOptionData (data) {
      let option = {
        animation: this.animation,
        backgroundColor:'',
        title: {
          text: '攻击类型趋势',
          textStyle: {
            color: '#fff'
          },
          left: 15, // 使标题居中
          top: -5 // 添加top属性使标题上移
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['流量攻击', '蜜罐攻击', 'Botnet', '应用层攻击', '其他攻击'],
          textStyle: {
            color: '#fff'
          },
          top: 25 // 设置legend距离顶部的距离
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.timestamps
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '流量攻击',
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle:{
              color:'#c33b00'
            },
            data: data.ddosAttacks
          },
          {
            name: '蜜罐攻击',
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle:{
              color:'#e86a1d'
            },
            data: data.malware
          },
          {
            name: 'Botnet',
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle:{
              color:'#008ac3'
            },
            data: data.phishing
          },
          {
            name: '应用层攻击',
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle:{
              color:'#52b3e1'
            },
            data: data.botnet
          },
          {
            name: '其他攻击',
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle:{
              color:'#a1d9e8'
            },
            data: data.appAttacks
          }
        ]
      }
      this.option = option
      this.lineChart.setOption(option)
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
#attack-type-line-chart {
  width: 100%;
  height: 100%;
  background-color: rgba(6, 30, 93, 0.5);
  border-top: 2px solid rgba(1, 153, 209, .5);
  box-sizing: border-box;

  .dv-charts-container {
    padding-top: 20px;
    height: 120%;
  }
}
</style>