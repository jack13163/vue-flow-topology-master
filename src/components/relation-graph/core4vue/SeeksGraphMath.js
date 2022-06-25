var STAITC_MAP_ANGLE = 0
var SeeksGraphMath = {
  getRectPoint: function(x1, y1, x2, y2, n1w, n1h, n2w, n2h) {
    var fx = x1 + n1w / 2
    var fy = y1 + n1h / 2
    var tx = x2 + n2w / 2
    var ty = y2 + n2h / 2
    var _ar_x = fx < tx ? 1 : -1
    var _ar_y = fy < ty ? 1 : -1
    if (ty === fy) {
      return { x: fx + _ar_x * n1w / 2, y: fy }
    }
    var __tan = Math.abs((tx - fx) / (ty - fy))
    var rectAngle = n1w / n1h
    var __w = 0
    var __h = 0
    if (__tan < rectAngle) {
      __w = _ar_x * n1h / 2 * __tan
      __h = _ar_y * n1h / 2
    } else {
      __w = _ar_x * n1w / 2
      __h = _ar_y * n1w / 2 / __tan
    }
    return { x: fx + __w, y: fy + __h }
  },
  getRectPointBasic: function(x1, y1, x2, y2, n1w, n1h, n2w, n2h) {
    var fx = x1 + n1w / 2
    var fy = y1 + n1h / 2
    var tx = x2 + n2w / 2
    var ty = y2 + n2h / 2

    var __tanA = ty === fy ? 0 : (tx - fx) / (ty - fy)
    if (__tanA === 0)__tanA = (tx - fx) / (ty - fy + 1)
    var rectAngle = n1w / n2h
    var __w = 0
    var __h = 0
    var _case = '1'
    if ((-1 * rectAngle) < __tanA && __tanA < rectAngle) {
      _case = '2'
      if (fy < ty) {
        __w = n1h / 2 * __tanA
        __h = n1h / 2
      } else {
        __w = -1 * n1h / 2 * __tanA
        __h = -1 * n1h / 2
      }
    } else {
      if (fx < tx) {
        __w = 1 * n1w / 2
        __h = 1 * n1w / 2 / __tanA
      } else {
        __w = -1 * n1w / 2
        __h = -1 * n1w / 2 / __tanA
      }
      _case = '3'
    }
    return { x: fx + __w, y: fy + __h, _case }
  },
  getRectJoinPoint: function(x1, y1, x2, y2, n1w, n1h, n2w, n2h) {
    var _from_c_x = x1 + n1w / 2
    var _from_c_y = y1 + n1h / 2
    var _to_c_x = x2 + n2w / 2
    var _to_c_y = y2 + n2h / 2
    var _atan2 = parseInt(Math.atan2(_to_c_y - _from_c_y, _to_c_x - _from_c_x) * 180 / 3.14) + 135
    if (_atan2 >= 0 && _atan2 < 90) { // top
      return { x: x1 + n1w / 2, y: y1 - 5 }
    } else if (_atan2 >= 90 && _atan2 < 180) { // right
      return { x: x1 + n1w + 5, y: y1 + n1h / 2 }
    } else if (_atan2 >= 180 && _atan2 < 270) { // bottom
      return { x: x1 + n1w / 2, y: y1 + n1h + 5 }
    } else { // left
      return { x: x1 - 5, y: y1 + n1h / 2 }
    }
  },
  getRectHJoinPoint: function(x1, y1, x2, y2, n1w, n1h, n2w) {
    var _hH = n1h / 2
    if ((x1 + n1w) < x2) {
      return { x: x1 + n1w + 5, y: y1 + _hH }
    } else if ((x1 + n1w) < (x2 + n2w)) {
      return { x: x1 - 5, y: y1 + _hH }
    } else {
      return { x: x1 - 5, y: y1 + _hH }
    }
  },
  getRectVJoinPoint: function(x1, y1, x2, y2, n1w, n1h, n2w, n2h) {
    var _hW = n1w / 2
    if ((y1 + n1h) < y2) {
      return { y: y1 + n1h + 5, x: x1 + _hW }
    } else if ((y1 + n1h) < (y2 + n2h)) {
      return { y: y1 - 5, x: x1 + _hW }
    } else {
      return { y: y1 - 5, x: x1 + _hW }
    }
  },
  getBorderPoint: function(x1, y1, x2, y2, n1w, n1h, n2w, n2h, n1style) {
    if (n1style === 0) {
      return this.getCirclePoint(x1, y1, x2, y2, n1w, n1h, n2w, n2h)
    } else {
      return this.getRectPoint(x1, y1, x2, y2, n1w, n1h, n2w, n2h)
    }
  },
  getBorderPoint4MultiLine: function(x1, y1, x2, y2, n1w, n1h, n2w, n2h, n1style, isReserve, allSize, indexOfAll) {
    if (n1style === 0) {
      return this.getCirclePoint4MultiLine(x1, y1, x2, y2, n1w, n1h, n2w, n2h, isReserve, allSize, indexOfAll)
    } else {
      return this.getRectPoint(x1, y1, x2, y2, n1w, n1h, n2w, n2h)
    }
  },
  getCirclePoint: function(x1, y1, x2, y2, n1w, n1h, n2w, n2h) {
    var fx = x2 + n2w / 2
    var fy = y2 + n2h / 2
    var tx = x1 + n1w / 2
    var ty = y1 + n1h / 2
    var buff_h = fx - tx
    if (buff_h === 0) {
      return { x: tx, y: ty - (n1h / 2) * (fy < ty ? 1 : -1) }
    }
    var buff_v = fy - ty
    var k = buff_v / buff_h
    var __x = Math.sqrt(1 / ((1 / Math.pow(n1w / 2, 2)) + (k ** 2 / Math.pow(n1h / 2, 2)))) * (fx < tx ? 1 : -1)
    var __y = k * __x
    return { x: tx - __x, y: ty - __y }
  },
  getCirclePoint4MultiLine: function(x1, y1, x2, y2, n1w, n1h, n2w, n2h, isReserve, allSize, indexOfAll) {
    if (isReserve) {
      indexOfAll = allSize - indexOfAll - 1
    }
    var to_x = x2 + n2w / 2
    var to_y = y2 + n2h / 2
    var from_x = x1 + n1w / 2
    var from_y = y1 + n1h / 2
    var buff_h = to_x - from_x
    if (buff_h === 0) {
      return { x: from_x, y: from_y - (n1h / 2) * (to_y < from_y ? 1 : -1) }
    }
    var distance = ((40 / (allSize + 1)) * (indexOfAll + 1)) - 20
    var buff_v = to_y - from_y
    var b = Math.sqrt(Math.pow(buff_h, 2) + Math.pow(buff_v, 2)) * distance / buff_h
    var k = buff_v / buff_h
    var m = n1w / 2
    var n = n1h / 2
    var __wow = (to_x < from_x ? 1 : -1)
    var __x = (-1 * (m ** 2) * k * b + (m * n * Math.sqrt((n ** 2 + (k ** 2) * (m ** 2) - b ** 2), 2)) / __wow) / (n ** 2 + m ** 2 * k ** 2)
    var __y = k * __x + b
    return { x: from_x - __x, y: from_y - __y }
  },
  getCirclePointBasic: function(x1, y1, x2, y2, n1w, n1h, n2w, n2h, radius) {
    var fx = x1 + n1w / 2
    var fy = y1 + n1h / 2
    var tx = x2 + n2w / 2
    var ty = y2 + n2h / 2
    this.h = tx - fx
    this.s = ty - fy
    this.c = Math.sqrt(this.h * this.h + this.s * this.s)
    this.l = this.c - radius
    this.v = this.l * this.h / this.c * -1
    this.t = this.l * this.s / this.c * -1
    return { x: tx + this.v, y: ty + this.t }
  },
  getCirclePointPlus: function(x1, y1, x2, y2, n1w, n1h, n2w, n2h) {
    var fx = x1 + n1w / 2
    var fy = y1 + n1h / 2
    var tx = x2 + n2w / 2
    var ty = y2 + n2h / 2
    this.h = tx - fx
    this.s = ty - fy
    this.c = Math.sqrt(this.h * this.h + this.s * this.s)
    this.v = (this.c - n1w / 2) * this.h / this.c * -1
    this.t = (this.c - n1h / 2) * this.s / this.c * -1
    return { x: tx + this.v, y: ty + this.t }
  },
  getOvalPoint: function(c_x, c_y, c_r, c_i, c_n) {
    return {
      x: c_x + c_r * Math.sin((STAITC_MAP_ANGLE + (c_i * (360 / c_n)) + 0) * Math.PI / 180),
      y: c_y + c_r * Math.cos((STAITC_MAP_ANGLE + (c_i * (360 / c_n)) + 0) * Math.PI / 180) * -1
    }
  },
  getAngleType: function(buffer_x, buffer_y) {
    if (buffer_x >= 0 && buffer_y >= 0) { // 第一象限
      return 1
    } else if (buffer_x < 0 && buffer_y >= 0) { // 第二象限
      return 2
    } else if (buffer_x < 0 && buffer_y < 0) { // 第三象限
      return 3
    } else if (buffer_x >= 0 && buffer_y < 0) { // 第三象限
      return 4
    }
  },
  getTextAngle: function(fx, fy, tx, ty) {
    // 除数不能为0
    var tan = Math.atan(Math.abs((ty - fy) / (tx - fx))) * 180 / Math.PI

    // return tan
    if (tx > fx && ty > fy) { // 第一象限
    } else if (tx > fx && ty < fy) { // 第二象限
      tan = -tan
    } else if (tx < fx && ty > fy) { // 第三象限
      tan = 180 - tan
    } else {
      tan = tan - 180
    }
    if (Math.abs(tan) > 90) {
      tan = tan + 180
    }
    return parseInt(tan)
  },
  getTreePointFromTop: function(c_x, c_y, c_height, c_i, c_n, sizehelper) {
    if (!c_x) { // if root
      return {
        x: (sizehelper.canvas_width - sizehelper.node_width) / 2,
        y: (sizehelper.canvas_height - sizehelper.node_height) / 2 - 200
      }
    }
    var sssss = {
      x: c_x - 300 + (Math.max(600 / ((c_n === 1 ? 2 : c_n) - 1), 80)) * c_i,
      y: c_y + c_height
    }
    return sssss
  },
  getTreePointFromRight: function(c_x, c_y, c_height, c_i, c_n, sizehelper) {
    if (!c_x) { // if root
      return {
        x: (sizehelper.canvas_width - sizehelper.node_width) / 2 + 300,
        y: (sizehelper.canvas_height - sizehelper.node_height) / 2
      }
    }
    return {
      x: c_x - c_height,
      y: c_y - 200 + (Math.max(400 / ((c_n === 1 ? 2 : c_n) - 1), 80)) * c_i
    }
  },
  getTreePointFromBottom: function(c_x, c_y, c_height, c_i, c_n, sizehelper) {
    if (!c_x) { // if root
      return {
        x: (sizehelper.canvas_width - sizehelper.node_width) / 2,
        y: (sizehelper.canvas_height - sizehelper.node_height) / 2 + 200
      }
    }
    return {
      x: c_x - 300 + (Math.max(600 / ((c_n === 1 ? 2 : c_n) - 1), 80)) * c_i,
      y: c_y - c_height
    }
  },
  getTreePointFromLeft: function(c_x, c_y, c_height, c_i, c_n, sizehelper) {
    if (!c_x) { // if root
      return {
        x: (sizehelper.canvas_width - sizehelper.node_width) / 2 - 300,
        y: (sizehelper.canvas_height - sizehelper.node_height) / 2
      }
    }
    return {
      x: c_x + c_height,
      y: c_y - 200 + (Math.max(400 / ((c_n === 1 ? 2 : c_n) - 1), 80)) * c_i
    }
  },
  analysisNodes: function(willLayoutNodes, thisLevelNodes, thisDeep, analyticResult, config) {
    if (thisLevelNodes.length > analyticResult.max_length) {
      analyticResult.max_length = thisLevelNodes.length
    }
    if (thisDeep > analyticResult.max_deep) {
      analyticResult.max_deep = thisDeep
    }
    var __thisLOT_subling = {
      level: thisDeep,
      all_size: thisLevelNodes.length,
      all_strength: 0
    }
    var newLevelNodes = []
    thisLevelNodes.forEach(thisNode => {
      if (!thisNode.lot)thisNode.lot = {}
      thisNode.lot.eached = true
      thisNode.lot.subling = __thisLOT_subling
      thisNode.lot.level = thisDeep
      willLayoutNodes.push(thisNode)
    })
    var __thisLevel_index = 0
    thisLevelNodes.forEach(thisNode => {
      var __thisNode_child_size = 0
      if (thisNode.targetNodes) {
        let __thisTargetIndex = 0
        thisNode.targetNodes.forEach((thisTarget) => {
          if (!thisTarget.lot)thisTarget.lot = { eached: false }
          if (!thisTarget.lot.eached) {
            if (SeeksGraphMath.isAllowShowNode(thisTarget)) {
              thisTarget.lot.eached = true
              thisTarget.lot.parent = thisNode
              thisTarget.lot.index_of_parent = __thisTargetIndex++
              thisNode.lot.childs.push(thisTarget)
              newLevelNodes.push(thisTarget)
              __thisNode_child_size++
            } else {
              thisNode.lot.childs.push(thisTarget)
            }
          }
        })
      }
      thisNode.lot.strength = __thisNode_child_size > 0 ? __thisNode_child_size : 1
      __thisLOT_subling.all_strength += thisNode.lot.strength
      thisNode.lot.strength_plus = __thisLOT_subling.all_strength
      thisNode.lot.index_of_level = __thisLevel_index
      thisNode.lot.childs_size = __thisNode_child_size
      __thisLevel_index++
    })
    if (__thisLOT_subling.all_strength > analyticResult.max_strength) {
      analyticResult.max_strength = __thisLOT_subling.all_strength
    }
    if (newLevelNodes.length > 0) {
      this.analysisNodes(willLayoutNodes, newLevelNodes, thisDeep + 1, analyticResult, config)
    } else {
      willLayoutNodes.forEach(thisNode => {
        if (thisNode.lot.childs_size > 0) {
          thisNode.lot.strengthWithChilds = 0
        }
      })
      willLayoutNodes.forEach(thisNode => {
        if (thisNode.lot.childs_size === 0) {
          thisNode.lot.strengthWithChilds = 1
          this.conductStrengthToParents(thisNode)
        }
      })
      this.analysisDataTree([willLayoutNodes[0]], 0)
    }
  },
  analysisNodes4Didirectional: function(willLayoutNodes, thisLevelNodes, thisDeep, analyticResult, levelDirect) {
    if (thisLevelNodes.length > analyticResult.max_length) {
      analyticResult.max_length = thisLevelNodes.length
    }
    if (thisDeep > analyticResult.max_deep) {
      analyticResult.max_deep = thisDeep
    }
    var __thisLOT_subling = {
      level: thisDeep,
      all_size: thisLevelNodes.length,
      all_strength: 0
    }
    var newLevelNodes = []
    thisLevelNodes.forEach(thisNode => {
      if (!thisNode.lot)thisNode.lot = {}
      thisNode.lot.eached = true
      thisNode.lot.subling = __thisLOT_subling
      thisNode.lot.level = thisDeep
      willLayoutNodes.push(thisNode)
    })
    var __thisLevel_index = 0
    // var __prev_node
    thisLevelNodes.forEach(thisNode => {
      var __thisNode_child_size = 0
      if (levelDirect === 0) {
        let __thisTargetIndex = 0
        thisNode.targetNodes.forEach((thisTarget) => {
          if (!thisTarget.lot)thisTarget.lot = { eached: false }
          if (!thisTarget.lot.eached) {
            if (SeeksGraphMath.isAllowShowNode(thisTarget)) {
              thisTarget.lot.eached = true
              thisTarget.lot.parent = thisNode
              thisTarget.lot.index_of_parent = __thisTargetIndex++
              thisNode.lot.childs.push(thisTarget)
              newLevelNodes.push(thisTarget)
              __thisNode_child_size++
            } else {
              thisNode.lot.childs.push(thisTarget)
            }
          } else {
            // console.log('solved node:', thisTarget.text, 'from:', thisNode.text)
          }
        })
      } else if (levelDirect === -1) {
        let __thisTargetIndex = 0
        thisNode.targetFrom.forEach((thisTarget) => {
          if (!thisTarget.lot)thisTarget.lot = { eached: false }
          if (!thisTarget.lot.eached) {
            if (SeeksGraphMath.isAllowShowNode(thisTarget)) {
              thisTarget.lot.eached = true
              thisTarget.lot.parent = thisNode
              thisTarget.lot.index_of_parent = __thisTargetIndex++
              thisNode.lot.childs.push(thisTarget)
              newLevelNodes.push(thisTarget)
              __thisNode_child_size++
            } else {
              thisNode.lot.childs.push(thisTarget)
            }
          }
        })
      } else {
        let __thisTargetIndex = 0
        thisNode.targetTo.forEach((thisTarget) => {
          if (!thisTarget.lot)thisTarget.lot = { eached: false }
          if (!thisTarget.lot.eached) {
            if (SeeksGraphMath.isAllowShowNode(thisTarget)) {
              thisTarget.lot.eached = true
              thisTarget.lot.parent = thisNode
              thisTarget.lot.index_of_parent = __thisTargetIndex++
              thisNode.lot.childs.push(thisTarget)
              newLevelNodes.push(thisTarget)
              __thisNode_child_size++
            } else {
              thisNode.lot.childs.push(thisTarget)
            }
          }
        })
      }
      thisNode.lot.strength = __thisNode_child_size > 0 ? __thisNode_child_size : 1
      __thisLOT_subling.all_strength += thisNode.lot.strength
      thisNode.lot.strength_plus = __thisLOT_subling.all_strength
      thisNode.lot.index_of_level = __thisLevel_index
      thisNode.lot.childs_size = __thisNode_child_size
      __thisLevel_index++
    })
    if (__thisLOT_subling.all_strength > analyticResult.max_strength) {
      analyticResult.max_strength = __thisLOT_subling.all_strength
    }
    if (newLevelNodes.length > 0) {
      SeeksGraphMath.analysisNodes4Didirectional(willLayoutNodes, newLevelNodes, thisDeep + (levelDirect === -1 ? -1 : 1), analyticResult, levelDirect)
    } else {
      willLayoutNodes.forEach(thisNode => {
        if (thisNode.lot.childs_size > 0) {
          thisNode.lot.strengthWithChilds = 0
        }
      })
      willLayoutNodes.forEach(thisNode => {
        if (thisNode.lot.childs_size === 0) {
          thisNode.lot.strengthWithChilds = 1
          SeeksGraphMath.conductStrengthToParents(thisNode)
        }
      })
      SeeksGraphMath.analysisDataTree([willLayoutNodes[0]], 0, levelDirect)
    }
  },
  conductStrengthToParents(node) {
    if (node.lot.parent) {
      node.lot.parent.lot.strengthWithChilds += 1
      this.conductStrengthToParents(node.lot.parent)
    }
  },
  analysisDataTree: function(thisLevelNodes, thisDeep, levelDirect) {
    if (levelDirect === undefined) levelDirect = 1
    var newLevelNodes = []
    var currentLevelStrengthWidthChilds = 0
    thisLevelNodes.forEach(thisNode => {
      if (thisNode.lot.level === 0 || levelDirect === (thisNode.lot.level < 0 ? -1 : 1)) {
        if (thisNode.lot.childs_size > 0) {
          thisNode.lot.childs.forEach((thisTarget) => {
            newLevelNodes.push(thisTarget)
          })
        }
        if (thisNode.lot.parent && currentLevelStrengthWidthChilds < thisNode.lot.parent.lot.strengthWithChilds_from) {
          currentLevelStrengthWidthChilds = thisNode.lot.parent.lot.strengthWithChilds_from
        }
        thisNode.lot.strengthWithChilds_from = currentLevelStrengthWidthChilds
        currentLevelStrengthWidthChilds += thisNode.lot.strengthWithChilds
      }
    })
    if (newLevelNodes.length > 0) {
      this.analysisDataTree(newLevelNodes, thisDeep + levelDirect, levelDirect)
    }
  },
  isAllowShowNode: function(thisNode) {
    const _r = thisNode.isShow !== false && thisNode.isHide !== true && (!thisNode.lot.parent || this.isAllowShowNode(thisNode.lot.parent, false) === true)
    return _r
  }
}

export default SeeksGraphMath
