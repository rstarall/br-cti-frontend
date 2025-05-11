<template>
  <div class="largeScreenMonitor" >
    <dv-full-screen-container>
      <div class="header-box" >
        <TitlePlane/>
        <DigitalPlane :dataInput="digitalPlaneData"/>
      </div>
      <div class="body-box">
          <div class="body-left-box">
              <UpchainTrendLineChart :dataInput="upchainTrendLineData"/>
          </div>
          <div class="body-center-box">
              <IOCsWorldMap/>
          </div>
          <div class="body-right-box">
              <OnchainCtiScrollBar :dataInput="onchainCtiScrollBarData"/>
          </div>
      </div>
      <div class="bottom-box">
        <div class="bottom-left-box">
              <AttackTypeRankingBoard :dataInput="attackTypeRankingData"/>
        </div>
          <div class="bottom-center-box">
              <AttackTypeLineChart :dataInput="attackTypeLineChartData"/>
          </div>
          <div class="bottom-right-box">
              <div class="right-box-1">
                <BlockchainStatusCards :dataInput="blockchainStatusData"/>
              </div>
              <div class="right-box-2">
                <IOCsPieChart :dataInput="iocsPieChartData"/>
              </div>
          </div>
      </div>
    </dv-full-screen-container>
     
  </div>
</template>

<script>
import TitlePlane from './TitlePlane.vue'
import DigitalPlane from './DigitalPlane.vue'
import UpchainTrendLineChart from './UpchainTrendLineChart.vue'
import IOCsWorldMap from './IOCsWorldMap.vue'
import OnchainCtiScrollBar from './OnchainCtiScrollBar.vue'
import AttackTypeRankingBoard from './AttackTypeRankingBoard.vue'
import AttackTypeLineChart from './AttackTypeLineChart.vue'
import BlockchainStatusCards from './BlockchainStatusCards.vue'
import IOCsPieChart from './IOCsPieChart.vue'

export default {
  name: 'CyberGamingSimulationPage',
  components: {
    TitlePlane,
    DigitalPlane,
    UpchainTrendLineChart,
    IOCsWorldMap,
    OnchainCtiScrollBar,
    AttackTypeRankingBoard,
    AttackTypeLineChart,
    BlockchainStatusCards,
    IOCsPieChart,
  },
  data() {
    return {
      blockchainServerHost:'http://localhost:7777',
      upchainTrendLineData:{},
      attackTypeRankingData:{},
      attackTypeLineChartData:{},
      blockchainStatusData:{},
      digitalPlaneData:{},
      iocsPieChartData:{},
      onchainCtiScrollBarData:{},
      queryTaskList:[ ]
    }
  },
  mounted() {
  },
  created() {
    this.initQueryTaskList()
    this.loopQueryDataViewData()
  },
  methods: {
    initQueryTaskList(){
      //初始化查询任务列表
      var newQueryTaskList=[
          {
            taskName:'attackTypeRankingData', 
            url:this.blockchainServerHost+'/dataStat/getAttackTypeRanking',
            method:'POST',
            intervalTime:10000,
            data:{}
          },
          {
            taskName:'attackTypeLineChartData',
            url:this.blockchainServerHost+'/dataStat/getAttackTypeRanking',
            method:'POST',
            intervalTime:2000,
            data:{}
          },
          {
            taskName:'blockchainStatusData',
            url:this.blockchainServerHost+'/dataStat/getDataStatistics',
            method:'POST', 
            intervalTime:10000,
            data:{}
          },
          {
            taskName:'digitalPlaneData',
            url:this.blockchainServerHost+'/dataStat/getSystemOverview',
            method:'POST',
            intervalTime:10000,
            data:{}
          },
          {
            taskName:'iocsPieChartData',
            url:this.blockchainServerHost+'/dataStat/getIOCsDistribution',
            method:'POST',
            intervalTime:10000,
            data:{}
          },
          {
            taskName:'onchainCtiScrollBarData',
            url:this.blockchainServerHost+'/dataStat/queryCTISummaryInfo',
            method:'POST',
            intervalTime:10000,
            data:{
              "limit":15
            }
          },
          {
            taskName:'upchainTrendLineData',
            url:this.blockchainServerHost+'/dataStat/getUpchainTrend',
            method:'POST',
            intervalTime:10000, //查询间隔时间，单位为毫秒
            data:{}
          }
          
      ]
      this.queryTaskList = newQueryTaskList
      newQueryTaskList.forEach(task=>{
        this.queryTaskData(task)
      })
    },
    loopQueryDataViewData(){
        //循环查询所有面板的数据
        this.queryTaskList.forEach(task=>{
          setInterval(()=>{
            this.queryTaskData(task)
          },task.intervalTime)
        })
    },
    queryTaskData(task){
      this.queryDataByUrl(task.url,task.method,task.data).then(res=>{
          this[task.taskName] = res
      }).catch(err => {
        console.error(`查询${task.taskName}数据失败:`, err)
      })
    },
    queryDataByUrl(url,method,data){
      //查询数据
      return new Promise((resolve,reject)=>{
        fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,body{
  background-color: transparent;
  width: 100%;
  height: 100%;
  /* 禁用html的滚动条，因为用的无框架窗口，默认就会有一个滚动条，所以去掉 */
  overflow-y: hidden;
  overflow-x: hidden;
}
.largeScreenMonitor{
  width: 100%;
  height: 100%;
  background-color: #030409;
  color: #fff;
}
#dv-full-screen-container {
    height:100%;
    width: 100%;
    background-image: url('@/assets/large_screen_bg.png');
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
}
/*头部*/
.largeScreenMonitor .header-box{
  height: 22%;
  width: 100%;
}
/*中部*/
.largeScreenMonitor .body-box{
  height: 45%;
  width: 100%;
  display:flex;
  align-items: center;
  justify-content:flex-start;
  margin-bottom: 10px
}
.body-box .body-left-box{
  height: 100%;
  width: 29%;
  margin-right: 10px;
}
.body-box .body-center-box{
  height: 100%;
  width: 33%;
  margin-right: 10px;
}
.body-box .body-right-box{
  height: 100%;
  width: 36%;
}
/*底部*/
.largeScreenMonitor .bottom-box{
  height: 30%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.bottom-box .bottom-left-box{
  height: 100%;
  width: 29%;
  margin-right: 10px;
}
.bottom-box .bottom-center-box{
  height: 100%;
  width:33%;
  margin-right: 10px;
}
.bottom-box .bottom-right-box{
  height: 100%;
  width:36%;
  display: flex;
  align-items: center;
  justify-content: flex-start
}
.bottom-right-box .right-box-1{
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 10px;
}
.bottom-right-box .right-box-2{
  height: 100%;
  width: 48%;
}
</style>
