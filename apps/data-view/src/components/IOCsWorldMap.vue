<template>
  <div id="iocs-world-map">
    <div class="iocs-world-map-title">全球IOCs分布</div>
    <div id="worldMap"></div>
  </div>
</template>

<script>
import worldMap from "@/assets/map/world-asia-center.json"
import { geoCoordMap, countryNameZH } from "@/assets/map/data.js";
import * as echarts from "echarts";
import { deepCopy } from "@/util";

echarts.registerMap("world", worldMap);

export default {
  name: 'IOCsWorldMap',
  data () {
    return {
      myMapChart: null,
      nameMap: {
          Afghanistan: "阿富汗",
          Singapore: "新加坡",
          Angola: "安哥拉",
          Albania: "阿尔巴尼亚",
          "United Arab Emirates": "阿联酋",
          Argentina: "阿根廷",
          Armenia: "亚美尼亚",
          "French Southern and Antarctic Lands": "法属南半球和南极领地",
          Australia: "澳大利亚",
          Austria: "奥地利",
          Azerbaijan: "阿塞拜疆",
          Burundi: "布隆迪",
          Belgium: "比利时",
          Benin: "贝宁",
          "Burkina Faso": "布基纳法索",
          Bangladesh: "孟加拉国",
          Bulgaria: "保加利亚",
          "The Bahamas": "巴哈马",
          "Bosnia and Herzegovina": "波斯尼亚和黑塞哥维那",
          Belarus: "白俄罗斯",
          Belize: "伯利兹",
          Bermuda: "百慕大",
          Bolivia: "玻利维亚",
          Brazil: "巴西",
          Brunei: "文莱",
          Bhutan: "不丹",
          Botswana: "博茨瓦纳",
          "Central African Republic": "中非共和国",
          Canada: "加拿大",
          Switzerland: "瑞士",
          Chile: "智利",
          China: "中国",
          "Ivory Coast": "象牙海岸",
          Cameroon: "喀麦隆",
          "Democratic Republic of the Congo": "刚果民主共和国",
          "Republic of the Congo": "刚果共和国",
          Colombia: "哥伦比亚",
          "Costa Rica": "哥斯达黎加",
          Cuba: "古巴",
          "Northern Cyprus": "北塞浦路斯",
          Cyprus: "塞浦路斯",
          "Czech Republic": "捷克共和国",
          Germany: "德国",
          Djibouti: "吉布提",
          Denmark: "丹麦",
          "Dominican Republic": "多明尼加共和国",
          Algeria: "阿尔及利亚",
          Ecuador: "厄瓜多尔",
          Egypt: "埃及",
          Eritrea: "厄立特里亚",
          Spain: "西班牙",
          Estonia: "爱沙尼亚",
          Ethiopia: "埃塞俄比亚",
          Finland: "芬兰",
          Fiji: "斐",
          "Falkland Islands": "福克兰群岛",
          France: "法国",
          Gabon: "加蓬",
          "United Kingdom": "英国",
          Georgia: "格鲁吉亚",
          Ghana: "加纳",
          Guinea: "几内亚",
          Gambia: "冈比亚",
          "Guinea Bissau": "几内亚比绍",
          Greece: "希腊",
          Greenland: "格陵兰",
          Guatemala: "危地马拉",
          "French Guiana": "法属圭亚那",
          Guyana: "圭亚那",
          Honduras: "洪都拉斯",
          Croatia: "克罗地亚",
          Haiti: "海地",
          Hungary: "匈牙利",
          Indonesia: "印度尼西亚",
          India: "印度",
          Ireland: "爱尔兰",
          Iran: "伊朗",
          Iraq: "伊拉克",
          Iceland: "冰岛",
          Israel: "以色列",
          Italy: "意大利",
          Jamaica: "牙买加",
          Jordan: "约旦",
          Japan: "日本",
          Kazakhstan: "哈萨克斯坦",
          Kenya: "肯尼亚",
          Kyrgyzstan: "吉尔吉斯斯坦",
          Cambodia: "柬埔寨",
          Kosovo: "科索沃",
          Kuwait: "科威特",
          Laos: "老挝",
          Lebanon: "黎巴嫩",
          Liberia: "利比里亚",
          Libya: "利比亚",
          "Sri Lanka": "斯里兰卡",
          Lesotho: "莱索托",
          Lithuania: "立陶宛",
          Luxembourg: "卢森堡",
          Latvia: "拉脱维亚",
          Morocco: "摩洛哥",
          Moldova: "摩尔多瓦",
          Madagascar: "马达加斯加",
          Mexico: "墨西哥",
          Macedonia: "马其顿",
          Mali: "马里",
          Myanmar: "缅甸",
          Montenegro: "黑山",
          Mongolia: "蒙古",
          Mozambique: "莫桑比克",
          Mauritania: "毛里塔尼亚",
          Malawi: "马拉维",
          Malaysia: "马来西亚",
          Namibia: "纳米比亚",
          "New Caledonia": "新喀里多尼亚",
          Niger: "尼日尔",
          Nigeria: "尼日利亚",
          Nicaragua: "尼加拉瓜",
          Netherlands: "荷兰",
          Norway: "挪威",
          Nepal: "尼泊尔",
          "New Zealand": "新西兰",
          Oman: "阿曼",
          Pakistan: "巴基斯坦",
          Panama: "巴拿马",
          Peru: "秘鲁",
          Philippines: "菲律宾",
          "Papua New Guinea": "巴布亚新几内亚",
          Poland: "波兰",
          "Puerto Rico": "波多黎各",
          "North Korea": "北朝鲜",
          Portugal: "葡萄牙",
          Paraguay: "巴拉圭",
          Qatar: "卡塔尔",
          Romania: "罗马尼亚",
          Russia: "俄罗斯",
          Rwanda: "卢旺达",
          "Western Sahara": "西撒哈拉",
          "Saudi Arabia": "沙特阿拉伯",
          Sudan: "苏丹",
          "South Sudan": "南苏丹",
          Senegal: "塞内加尔",
          "Solomon Islands": "所罗门群岛",
          "Sierra Leone": "塞拉利昂",
          "El Salvador": "萨尔瓦多",
          Somaliland: "索马里兰",
          Somalia: "索马里",
          "Republic of Serbia": "塞尔维亚",
          Suriname: "苏里南",
          Slovakia: "斯洛伐克",
          Slovenia: "斯洛文尼亚",
          Sweden: "瑞典",
          Swaziland: "斯威士兰",
          Syria: "叙利亚",
          Chad: "乍得",
          Togo: "多哥",
          Thailand: "泰国",
          Tajikistan: "塔吉克斯坦",
          Turkmenistan: "土库曼斯坦",
          "East Timor": "东帝汶",
          "Trinidad and Tobago": "特里尼达和多巴哥",
          Tunisia: "突尼斯",
          Turkey: "土耳其",
          "United Republic of Tanzania": "坦桑尼亚",
          Uganda: "乌干达",
          Ukraine: "乌克兰",
          Uruguay: "乌拉圭",
          "United States": "美国",
          Uzbekistan: "乌兹别克斯坦",
          Venezuela: "委内瑞拉",
          Vietnam: "越南",
          Vanuatu: "瓦努阿图",
          "West Bank": "西岸",
          Yemen: "也门",
          "South Africa": "南非",
          Zambia: "赞比亚",
          Korea: "韩国",
          Tanzania: "坦桑尼亚",
          Zimbabwe: "津巴布韦",
          Congo: "刚果",
          "Central African Rep.": "中非",
          Serbia: "塞尔维亚",
          "Bosnia and Herz.": "波黑",
          "Czech Rep.": "捷克",
          "W. Sahara": "西撒哈拉",
          "Lao PDR": "老挝",
          "Dem.Rep.Korea": "朝鲜",
          "Falkland Is.": "福克兰群岛",
          "Timor-Leste": "东帝汶",
          "Solomon Is.": "所罗门群岛",
          Palestine: "巴勒斯坦",
          "N. Cyprus": "北塞浦路斯",
          Aland: "奥兰群岛",
          "Fr. S. Antarctic Lands": "法属南半球和南极陆地",
          Mauritius: "毛里求斯",
          Comoros: "科摩罗",
          "Eq. Guinea": "赤道几内亚",
          "Guinea-Bissau": "几内亚比绍",
          "Dominican Rep.": "多米尼加",
          "Saint Lucia": "圣卢西亚",
          Dominica: "多米尼克",
          "Antigua and Barb.": "安提瓜和巴布达",
          "U.S. Virgin Is.": "美国原始岛屿",
          Montserrat: "蒙塞拉特",
          Grenada: "格林纳达",
          Barbados: "巴巴多斯",
          Samoa: "萨摩亚",
          Bahamas: "巴哈马",
          "Cayman Is.": "开曼群岛",
          "Faeroe Is.": "法罗群岛",
          "IsIe of Man": "马恩岛",
          Malta: "马耳他共和国",
          Jersey: "泽西",
          "Cape Verde": "佛得角共和国",
          "Turks and Caicos Is.": "特克斯和凯科斯群岛",
          "St. Vin. and Gren.": "圣文森特和格林纳丁斯",
      },
      mockData: {
        nodes: {
          'us': {
            id: 'us',
            name: '美国',
            longitude: -95.7129,
            latitude: 37.0902,
            count: 263
          },
          'cn': {
            id: 'cn',
            name: '中国', 
            longitude: 116.4074,
            latitude: 39.9042,
            count: 12315
          },
          'ru': {
            id: 'ru',
            name: '俄罗斯',
            longitude: 37.6173,
            latitude: 55.7558,
            count: 1234
          },
          'uk': {
            id: 'uk',
            name: '英国',
            longitude: -0.1278,
            latitude: 51.5074,
            count: 890
          },
          'de': {
            id: 'de',
            name: '德国',
            longitude: 13.4050,
            latitude: 52.5200,
            count: 678
          },
          'ws': {
            id: 'ws',
            name: '萨摩亚',
            longitude: -172.1046,
            latitude: -13.7590,
            count: 297
          },
          'ua': {
            id: 'ua', 
            name: '乌克兰',
            longitude: 30.5234,
            latitude: 50.4501,
            count: 195
          },
          'vn': {
            id: 'vn',
            name: '越南',
            longitude: 105.8342,
            latitude: 21.0285,
            count: 315
          },
          'nz': {
            id: 'nz',
            name: '新西兰',
            longitude: 174.7633,
            latitude: -41.2865,
            count: 844
          },
          'mx': {
            id: 'mx',
            name: '墨西哥',
            longitude: -99.1332,
            latitude: 19.4326,
            count: 403
          },
          'pa': {
            id: 'pa',
            name: '巴拿马',
            longitude: -79.5167,
            latitude: 8.9833,
            count: 268
          },
          'au': {
            id: 'au',
            name: '澳大利亚',
            longitude: 149.1300,
            latitude: -35.2809,
            count: 5
          }
        }
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.initMap();
      this.updateMap();
      
      // 每30秒更新一次数据
      setInterval(() => {
        this.mockRandomData();
        this.updateMap();
      }, 30000);
    })
  },
  methods: {
    mockRandomData() {
      Object.values(this.mockData.nodes).forEach(node => {
        // 随机增减IOCs数量
        node.count += Math.floor(Math.random() * 200) - 100;
        if(node.count < 0) node.count = 0;
      });
    },
    getColorByCount(count) {
      if(count > 1000) return "#89c5ff";
      if(count >= 500) return "#6aa3f7";
      if(count >= 100) return "#4f83d4";
      if(count >= 10) return "#3c64a6";
      if(count >= 1) return "#2a4a7f";
      return "#1a365d";
    },
    createMapNodes() {
      return Object.values(this.mockData.nodes).map(item => ({
        name: item.name,
        value: item.count,
        symbolSize: Math.sqrt(item.count) / 5,
        itemStyle: {
          color: this.getColorByCount(item.count),
        },
        label: {
          show: true,
          formatter: `${item.name}\n${item.count}个IOCs`,
          position: 'right',
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        }
      }));
    },
    updateMap() {
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0,0,0,0.8)',
          borderColor: "transparent",
          textStyle: {
            color: '#fff'
          },
          formatter: params => {  
            if(params.value !== undefined) {
              return `${params.name}<br/>IOCs数量: ${params.value}`;
            }
            return `${params.name}<br/>IOCs数量: 0`;
          }
        },
        visualMap: {
          min: 0,
          max: 10000,
          orient: "vertical", 
          left: 0,
          bottom: 20,
          showLabel: true,
          precision: 0,
          itemWidth: 12,
          itemHeight: 10,
          textGap: 10,
          inverse: false,
          hoverLink: true,
          inRange: {
            color: ["#1a365d", "#2a4a7f", "#3c64a6", "#4f83d4", "#6aa3f7", "#89c5ff"],
          },
          pieces: [
            { gt: 1000, label: ">1000", color: "#89c5ff" },
            { gte: 500, lte: 1000, label: "500-1000", color: "#6aa3f7" },
            { gte: 100, lte: 499, label: "100-499", color: "#4f83d4" },
            { gte: 10, lte: 99, label: "10-99", color: "#3c64a6" },
            { gte: 1, lte: 9, label: "1-9", color: "#2a4a7f" },
            { lte: 0, label: "0", color: "#1a365d" }
          ],
          textStyle: {
            color: "#fff",
            fontSize: 11,
            fontWeight: 500
          }
        },
        geo: {
          map: 'world',
          roam: true,
          zoom: 1.1,
          nameMap: countryNameZH,
          itemStyle: {
            areaColor: '#1a365d',
            borderColor: '#2a4a7f',
            borderWidth: 1
          },
          emphasis: {
            itemStyle: {
              areaColor: '#4306fe'
            },
            label: {
              show: true,
              color: '#fff'
            }
          },
          select: {
            itemStyle: {
              areaColor: '#4306fe'
            }
          },
          label: {
            show: false,
            color: '#fff',
            fontSize: 10
          }
        },
        series: [
          {
            name: 'IOCs分布',
            type: 'map',
            geoIndex: 0,
            data: [
              ...this.createMapNodes(),
              ...Object.entries(countryNameZH).map(([en, zh]) => ({
                name: zh,
                value: 0
              }))
            ],
            label: {
              show: false,
              textStyle: {
                color: '#fff',
                fontSize: 11,
                fontFamily: 'Arial'
              }
            },
            nameMap:this.nameMap
          }
        ]
      };

      this.myMapChart.setOption(option);
    },
    initMap() {
      this.myMapChart = echarts.init(document.getElementById("worldMap"));
    }
  }
}
</script>

<style lang="less">
#iocs-world-map {
  width: 100%;
  height: 100%;
  background-color: rgba(6, 30, 93, 0.5);
  border-top: 2px solid rgba(243, 71, 14, 0.886);
  box-sizing: border-box;
  
  .iocs-world-map-title {
    height: 50px;
    font-weight: bold;
    text-indent: 20px;
    font-size: 20px;
    display: flex;
    align-items: center;
    color: #fff;
  }

  #worldMap {
    height: calc(~"100% - 50px");
    width: 100%;
  }
}
</style>
