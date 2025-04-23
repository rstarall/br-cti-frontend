<template>
  <div id="attack-type-ranking-board">
    <div class="attack-type-ranking-board-title">攻击类型排行</div>
    <dv-scroll-ranking-board :config="option" />
  </div>
</template>

<script>
import {deepCopy} from "@/util/index.js";
export default {
  name: 'AttackTypeRankingBoard',
  props:{
    dataInput:{
      type:Object,
      default:{}
    }
  },
  data () {
    return {
      option: {
        data: [
          {
            name: '流量攻击',
            value: 0
          },
          {
            name: '蜜罐攻击',
            value: 0
          },
          {
            name: 'Botnet',
            value: 0
          },
          {
            name: '应用层攻击',
            value: 0
          },
          {
            name: '其他攻击',
            value: 0
          }
        ],
        rowNum: 5
      }
    }
  },
  watch:{
    dataInput(newVal,oldVal){
      if(newVal!=undefined){
        let attackTypeRankData = this.processRankingData(newVal)
        this.updateOptionData(attackTypeRankData)
      }
    }
  },
  created() {

  },
  methods: {
    processRankingData(dataInput){
      // 处理数据
      let attackTypeRankData = {}
      if(dataInput && dataInput.result) {
        try {
          const result = JSON.parse(dataInput.result)
          if(result.rankings) {
            // 将攻击类型映射为中文名称
            const typeMap = {
              'TRAFFIC': '流量攻击',
              'HONEYPOT': '蜜罐攻击', 
              'BOTNET': 'Botnet',
              'APP_LAYER': '应用层攻击',
              'OTHER': '其他攻击'
            }
            
            // 转换数据格式
            result.rankings.forEach(item => {
              const name = typeMap[item.type] || item.type
              attackTypeRankData[name] = item.count
            })
          }
        } catch(e) {
          console.error('处理攻击类型排名数据出错:', e)
        }
      }
      return attackTypeRankData
    },
    updateOptionData(attackTypeRankData){
      if(!attackTypeRankData || Object.values(attackTypeRankData).length === 0){
        return
      }
      
      this.option = {
        data: Object.entries(attackTypeRankData).map(([name, value]) => ({
          name,
          value
        })),
        rowNum: Object.values(attackTypeRankData).length
      }
    },
    incrementAttackData() {
      // 深拷贝当前数据
      const currentData = deepCopy(this.option.data);
      
      // 为每个攻击类型增加随机数量
      const updatedData = {};
      currentData.forEach(item => {
        // 随机增加1-50的数量
        const increment = Math.floor(Math.random() * 50) + 1;
        updatedData[item.name] = item.value + increment;
      });
      
      this.updateOptionData(updatedData);
    }
  }
}
</script>

<style lang="less">
#attack-type-ranking-board {
  width: 100%;
  height: 100%;
  box-shadow: 0 0 3px blue;
  display: flex;
  flex-direction: column;
  background-color: rgba(6, 30, 93, 0.5);
  border-top: 2px solid rgba(1, 153, 209, .5);
  box-sizing: border-box;
  padding: 0px 30px;

  .attack-type-ranking-board-title {
    font-weight: bold;
    height: 50px;
    display: flex;
    align-items: center;
    font-size: 20px;
  }

  .dv-scroll-ranking-board {
    flex: 1;
    height: 90%;
  }
}
</style>
