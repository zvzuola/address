import { labelHeight } from './common'

// 重点人员
var people_focus = {
  type: 'FeatureCollection',
  name: 'zdry',
  features: [
    {
      type: 'Feature',
      name: 'zdry',
      geometry: {
        type: 'LineString',
        coordinates: [
          [120.163629936, 30.2730375728, 21.12115],
          [
            120.1636310305,
            30.272950437,
            // 28.12115
            labelHeight
          ]
        ]
      },
      properties: {
        姓名: '许斌华',
        性别: '男',
        身份证号: '33010319880526161X',
        户籍属性: '户籍人口',
        分类: '其他人员',
        上报部门: '胭脂新村网格1',
        现居地址: '杭州市下城区天水街道小北门1幢1单元102室'
      }
    },
    {
      type: 'Feature',
      name: 'zdry',
      geometry: {
        type: 'LineString',
        coordinates: [
          [120.1621744937, 30.2740167143, 27.3791],
          [
            120.1621173867,
            30.2739453305,
            // 36.0791
            labelHeight
          ]
        ]
      },
      properties: {
        姓名: '吴加兰',
        性别: '女',
        身份证号: '330211193512270021',
        户籍属性: '户籍人口',
        分类: '涉邪人员',
        上报部门: '胭脂新村网格1',
        现居地址: '杭州市下城区天水街道小北门2幢4单元308室'
      }
    },
    {
      type: 'Feature',
      name: 'zdry',
      geometry: {
        type: 'LineString',
        coordinates: [
          [120.1620486717, 30.2746869642, 20.59326],
          [
            120.1619861333,
            30.2746797482,
            // 30.59326
            labelHeight
          ]
        ]
      },
      properties: {
        姓名: '张国良',
        性别: '男',
        身份证号: '330103194906220018',
        户籍属性: '户籍人口',
        分类: '信访人员',
        上报部门: '胭脂新村网格3',
        现居地址: '浙江省杭州市下城区胭脂新村9幢4单元103室'
      }
    },
    {
      type: 'Feature',
      name: 'zdry',
      geometry: {
        type: 'LineString',
        coordinates: [
          [120.1636850904, 30.2733507633, 0],
          [120.1636850904, 30.2734828192, 0]
        ]
      },
      properties: {
        姓名: '王如海',
        性别: '男',
        身份证号: '330102196801231215',
        户籍属性: '流动人口',
        分类: '归正人员',
        上报部门: '胭脂新村网格3',
        现居地址: '杭州市下城区天水街道胭脂新村天水巷11号3单元502室'
      }
    },
    {
      type: 'Feature',
      name: 'zdry',
      geometry: {
        type: 'LineString',
        coordinates: [
          [120.1631915682, 30.2746778447, 0],
          [120.1631832401, 30.2747789717, 0]
        ]
      },
      properties: {
        姓名: '陈沛欣',
        性别: '男',
        身份证号: '330103198505060752',
        户籍属性: '户籍人口',
        分类: '归正人员',
        上报部门: '胭脂新村网格1',
        现居地址: '杭州市下城区天水街道天水巷19号205室'
      }
    },
    {
      type: 'Feature',
      name: 'zdry',
      geometry: {
        type: 'LineString',
        coordinates: [
          [120.1626897801, 30.2731869162, 0],
          [120.1626775527, 30.2733458724, 0]
        ]
      },
      properties: {
        姓名: '沈蔓莉',
        性别: '女',
        身份证号: '330103196912011043',
        户籍属性: '户籍人口',
        分类: '归正人员',
        上报部门: '胭脂新村网格3',
        现居地址: '绿城兰园5幢1602室'
      }
    },
    {
      type: 'Feature',
      name: 'zdry',
      geometry: {
        type: 'LineString',
        coordinates: [
          [120.1638195918, 30.273634439, 0],
          [120.1638220373, 30.2737493765, 0]
        ]
      },
      properties: {
        姓名: '冸柏林',
        性别: '男',
        身份证号: '330103195703130738',
        户籍属性: '流动人口',
        分类: '涉毒人员',
        上报部门: '胭脂新村网格3'
      }
    },
    {
      type: 'Feature',
      name: 'zdry',
      geometry: {
        type: 'LineString',
        coordinates: [
          [120.1650404094, 30.274199573, 0],
          [120.1650308916, 30.2743661353, 0]
        ]
      },
      properties: {
        姓名: '陈龙英',
        性别: '女',
        身份证号: '330105194301111022',
        户籍属性: '户籍人口',
        分类: '涉邪人员',
        上报部门: '胭脂新村网格2'
      }
    },
    {
      type: 'Feature',
      name: 'zdry',
      geometry: {
        type: 'LineString',
        coordinates: [
          [120.1643206225, 30.2734440941, 0],
          [120.1643177671, 30.2733098925, 0]
        ]
      },
      properties: {
        姓名: '王新颜',
        性别: '男',
        身份证号: '33010319761124071x',
        户籍属性: '户籍人口',
        分类: '易肇精患',
        上报部门: '胭脂新村网格4'
      }
    },
    {
      type: 'Feature',
      name: 'zdry',
      geometry: {
        type: 'LineString',
        coordinates: [
          [120.1632418999, 30.2753130341, 0],
          [120.1631791744, 30.2756042594, 0]
        ]
      },
      properties: {
        姓名: '季伟',
        性别: '男',
        身份证号: '330103196409100735',
        户籍属性: '户籍人口',
        分类: '易肇精患',
        上报部门: '胭脂新村网格1'
      }
    },
    {
      type: 'Feature',
      name: 'zdry',
      geometry: {
        type: 'LineString',
        coordinates: [
          [120.164578794, 30.2727052715, 0],
          [120.1647287, 30.2728123472, 0]
        ]
      },
      properties: {
        姓名: '郑丽',
        性别: '女',
        身份证号: '330102195605011843',
        户籍属性: '户籍人口',
        分类: '其他人员',
        上报部门: '胭脂新村网格4'
      }
    },
    {
      type: 'Feature',
      name: 'zdry',
      geometry: {
        type: 'LineString',
        coordinates: [
          [120.1638880653, 30.2731086608, 0],
          [120.1639002927, 30.2729545956, 0]
        ]
      },
      properties: {
        姓名: '林斌',
        性别: '男',
        身份证号: '330123197406060512',
        户籍属性: '户籍人口',
        分类: '信访人员',
        上报部门: '胭脂新村网格3'
      }
    },
    {
      type: 'Feature',
      name: 'zdry',
      geometry: {
        type: 'LineString',
        coordinates: [
          [120.1654571477, 30.2744079817, 0],
          [120.165460136, 30.2745902671, 0]
        ]
      },
      properties: {
        姓名: '杜浩',
        性别: '男',
        身份证号: '33010319780720071x',
        户籍属性: '户籍人口',
        分类: '矫正人员',
        上报部门: '胭脂新村网格2'
      }
    },
    {
      type: 'Feature',
      name: 'zdry',
      geometry: {
        type: 'LineString',
        coordinates: [
          [120.1643448304, 30.2737276622, 0],
          [120.1645365477, 30.2737608932, 0]
        ]
      },
      properties: {
        姓名: '宋立翔',
        性别: '男',
        身份证号: '33010319990808071x',
        户籍属性: '户籍人口',
        分类: '矫正人员',
        上报部门: '胭脂新村网格4'
      }
    }
  ]
}

export default people_focus
