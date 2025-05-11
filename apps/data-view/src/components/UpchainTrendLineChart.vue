<template>
  <div id="upchain-trend-line-chart">
    <div class="dv-charts-container" id="upchainTrendLineChart" style="width: 100%; height: 100%;" ></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: 'UpchainTrendLineChart',
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
      lineChart:null,
      trendLineData: {
        timestamps: [],
        ctiTrades: [],
        modelTrades: []
      }
    }
  },
  watch:{
    dataInput(newVal,oldVal){
      if(newVal!=undefined){
        console.log('trendLineData newVal',newVal)
        this.processInputData(newVal)
      }
    }
  },
  created() {
    this.$nextTick(()=>{
      this.initLineChart()
      this.updateChart()
    })
  },
  
  methods: {
    initLineChart() {
      this.lineChart = echarts.init(document.getElementById('upchainTrendLineChart'),this.darkTheme?'dark':'');
    },
    processInputData(dataInput){
      // 处理数据
      try {
        if(!dataInput || !dataInput.result) return;
        
        const result = JSON.parse(dataInput.result);
        const now = new Date();
        const timestamps = [];
        const ctiData = [];
        const modelData = [];
        
        // 生成最近24小时的时间点
        for(let i = 23; i >= 0; i--) {
          const time = new Date(now - i * 3600 * 1000);
          const hour = time.getHours();
          const dateStr = time.toISOString().split('T')[0];
          const timeKey = `${dateStr} ${hour}`;
          
          timestamps.push(time.toLocaleTimeString('zh-CN', {hour12: false}));
          ctiData.push(result.cti_upchain[timeKey] || 0);
          modelData.push(result.model_upchain[timeKey] || 0);
        }
        
        this.trendLineData = {
          timestamps,
          ctiTrades: ctiData,
          modelTrades: modelData
        };
        
        this.updateChart();
      } catch(e) {
        console.error('处理上链趋势数据出错:', e);
      }
    },
   
    generateMockData() {
      // 生成最近24小时的时间戳
      const now = new Date()
      for(let i = 23; i >= 0; i--) {
        const time = new Date(now - i * 3600 * 1000)
        this.trendLineData.timestamps.push(time.toLocaleTimeString())
        this.trendLineData.ctiTrades.push(Math.floor(Math.random() * 100))
        this.trendLineData.modelTrades.push(Math.floor(Math.random() * 50))
      }
      this.updateChart()
    },
    startMockDataUpdate() {
      setInterval(() => {
        // 移除最早的数据点
        this.trendLineData.timestamps.shift()
        this.trendLineData.ctiTrades.shift()
        this.trendLineData.modelTrades.shift()
        
        // 添加新的数据点
        const now = new Date()
        this.trendLineData.timestamps.push(now.toLocaleTimeString())
        this.trendLineData.ctiTrades.push(Math.floor(Math.random() * 100))
        this.trendLineData.modelTrades.push(Math.floor(Math.random() * 50))
        
        this.updateChart()
      }, 3000)
    },
    updateChart() {
      this.option = {
        animation: this.animation,
        backgroundColor:'transparent',
        grid:{
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '20%',
          containLabel: true
        },
        title: {
          text: '上链趋势监控',
          subtext: '情报上链数量',
          left: '3%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.trendLineData.timestamps
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: 'black',
              width: 1,
              type: 'solid'
            }
          },
          axisLabel: {
            formatter: '{value} txs'
          }
        },
        legend: {
          data: ['情报上链数量', "模型上链数量"],
          right: '5%',
          top: '8%',
          padding: [0, 0, 0, 20],
          // orient: 'vertical'
        },
        series: [
          {
            name: '情报上链数量',
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle:{
              color:'rgba(57, 134, 215, 0.807)'
            },
            areaStyle: {
              color:'rgba(57, 134, 215, 0.807)'
            },
            data: this.trendLineData.ctiTrades
          },
          {
            name: '模型上链数量',
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle:{
              color:'rgba(0, 255, 255, 0.807)'
            },
            areaStyle: {
              color:'rgba(0, 255, 255, 0.807)' 
            },
            data: this.trendLineData.modelTrades
          }
        ]
      }
      if(this.lineChart!=null)
        this.lineChart.setOption(this.option,true)
    }
  },
  mounted () {
  }
}
</script>

<style lang="less">
#upchain-trend-line-chart {
  width: 100%;
  height: 100%;
  background-color: rgba(6, 30, 93, 0.5);
  border-top: 2px solid rgba(1, 153, 209, .5);
  box-sizing: border-box;
  margin-right: 10px;

  .dv-charts-container {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
</style>
