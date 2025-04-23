<template>
  <div id="iocs-pie-chart">
    <div class="iocs-pie-chart-title">IOCs类型分布</div>
    <dv-charts :option="option" />
  </div>
</template>

<script>
export default {
  name: 'IOCsPieChart',
  props: {
    dataInput:{
      type:Object,
      default:{}
    }
  },
  data () {
    return {
      option: {
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: [
              {name: 'IP', value: 120},
              {name: '端口', value: 80}, 
              {name: 'Hash', value: 150},
              {name: 'URL', value: 100},
              {name: 'CVE', value: 90}
            ],
            insideLabel: {
              show: false
            },
            outsideLabel: {
              formatter: '{name} {percent}%',
              labelLineEndLength: 20,
              style: {
                fill: '#fff'
              },
              labelLineStyle: {
                stroke: '#fff'
              }
            }
          }
        ],
        color: ['#a1d9e8', '#52b3e1', '#008ac3', '#e86a1d', '#c33b00']
      }
    }
  },
  watch:{
    dataInput(newVal,oldVal){
      if(newVal!=undefined){
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
        const countMap = result.total_count_map
        
        const option = {
          series: [
            {
              type: 'pie',
              radius: '50%',
              data: [
                {name: 'IP', value: countMap.ip || 0},
                {name: '端口', value: countMap.port || 0}, 
                {name: 'Hash', value: countMap.hash || 0},
                {name: 'URL', value: countMap.url || 0},
                {name: 'Payload', value: countMap.payload || 0},
                {name: '流量特征', value: countMap.flow_feature || 0}
              ],
              insideLabel: {
                show: false
              },
              outsideLabel: {
                formatter: '{name} {percent}%',
                labelLineEndLength: 20,
                style: {
                  fill: '#fff'
                },
                labelLineStyle: {
                  stroke: '#fff'
                }
              }
            }
          ],
          color: ['#a1d9e8', '#52b3e1', '#008ac3', '#e86a1d', '#c33b00', '#9932CC']
        }
        this.option = option
      } catch(e) {
        console.error('处理IOCs饼图数据出错:', e)
      }
    },
    genMockData(){
      const option = {
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: [
              {name: 'IP', value: this.randomExtend(100, 200)},
              {name: '端口', value: this.randomExtend(50, 100)},
              {name: 'Hash', value: this.randomExtend(120, 180)},
              {name: 'URL', value: this.randomExtend(80, 150)},
              {name: 'Playload', value: this.randomExtend(60, 120)}
            ],
            insideLabel: {
              show: false
            },
            outsideLabel: {
              formatter: '{name} {percent}%',
              labelLineEndLength: 20,
              style: {
                fill: '#fff'
              },
              labelLineStyle: {
                stroke: '#fff'
              }
            }
          }
        ],
        color: ['#a1d9e8', '#52b3e1', '#008ac3', '#e86a1d', '#c33b00']
      }
      this.option = option;
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
#iocs-pie-chart {
  width: 100%;
  height: 100%;
  background-color: rgba(6, 30, 93, 0.5);
  border-top: 2px solid rgba(229, 60, 27, 0.807);
  box-sizing: border-box;

  .iocs-pie-chart-title {
    height: 50px;
    font-weight: bold;
    text-indent: 20px;
    font-size: 20px;
    font-size: 20px;
    display: flex;
    align-items: center;
  }

  .dv-charts-container {
    height: calc(~"100% - 50px");
  }
}
</style>
