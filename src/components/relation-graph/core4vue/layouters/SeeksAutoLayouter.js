import SeeksGraphMath from '../SeeksGraphMath'

function SeeksAutoLayouter(layoutSetting, graphSetting) {
  this.graphSetting = graphSetting
  this.config = layoutSetting || {}
  this.rootNode = null
  this.allNodes = []
  this.__origin_nodes = []
  this.refresh = function() {
    this.placeNodes(this.__origin_nodes, this.rootNode)
  }
  this.placeNodes = function(allNodes, rootNode) {
    if (!rootNode) {
      console.log('root is null:', rootNode)
      return
    } else {
      if (window.SeeksGraphDebug) console.log('layout by root:', rootNode)
    }
    this.__origin_nodes = allNodes
    this.rootNode = rootNode
    allNodes.forEach(thisNode => {
      thisNode.lot.eached = false
      thisNode.lot.notLeafNode = false
      thisNode.lot.childs = []
      thisNode.lot.index_of_parent = 0
      thisNode.lot.strength = 0
      thisNode.lot.prevNode = undefined
      thisNode.lot.nextNode = undefined
      thisNode.lot.placed = false
    })
    this.allNodes = []
    var analyticResult = {
      max_deep: 1,
      max_length: 1
    }
    SeeksGraphMath.analysisNodes4Didirectional(this.allNodes, [this.rootNode], 0, analyticResult, 0)
    if (window.SeeksGraphDebug) console.log('调整画布大小')
    var __mapWidth = this.graphSetting.viewSize.width
    var __mapHeight = this.graphSetting.viewSize.height
    rootNode.lot.x = parseInt((__mapWidth - rootNode.el.offsetWidth) / 2)
    rootNode.lot.y = parseInt((__mapHeight - rootNode.el.offsetHeight) / 2)
    if (window.SeeksGraphDebug) console.log('[layout canvasOffset]', this.graphSetting.viewSize, this.graphSetting.canvasSize)
    this.placeRelativePosition(this.rootNode)
    this.allNodes.forEach(thisNode => {
      if (thisNode.fixed === true) return
      if (!SeeksGraphMath.isAllowShowNode(thisNode)) return
      thisNode.x = thisNode.lot.x
      thisNode.y = thisNode.lot.y
      thisNode.lot.placed = true
    })
    if (window.SeeksGraphDebug) console.log('Start Auto Layout.....')
    this.autoLayout(true)
  }
  this.placeRelativePosition = function(rootNode) {
    var __level1_r = 80
    this.allNodes.forEach(thisNode => {
      if (thisNode.lot.subling.level === 1) {
        __level1_r = thisNode.lot.subling.all_size * 20 / Math.PI / 2
        if (__level1_r < 80)__level1_r = 80
        const _point = SeeksGraphMath.getOvalPoint(rootNode.lot.x, rootNode.lot.y, thisNode.lot.subling.level * __level1_r, thisNode.lot.strength_plus - (thisNode.lot.strength / 2), thisNode.lot.subling.all_strength)
        thisNode.lot.x = _point.x
        thisNode.lot.y = _point.y
      }
    })
    this.allNodes.forEach(thisNode => {
      if (thisNode.lot.subling.level > 1) {
        var __area_start = thisNode.lot.parent.lot.strength_plus - thisNode.lot.parent.lot.strength
        var __area_end = thisNode.lot.parent.lot.strength_plus
        var __buff = (__area_end - __area_start) / (thisNode.lot.parent.lot.childs_size + 1) * (thisNode.lot.index_of_parent + 1)
        const _point = SeeksGraphMath.getOvalPoint(rootNode.lot.x, rootNode.lot.y, (thisNode.lot.subling.level - 1) * 80 + __level1_r, __area_start + __buff, thisNode.lot.parent.lot.subling.all_strength)
        thisNode.lot.x = _point.x
        thisNode.lot.y = _point.y
      }
    })
  }
  this.layoutTimes = 0
  this.autoLayout = function(forceLayout) {
    if (forceLayout) {
      this.layoutTimes = 0
    }
    if (window.SeeksGraphDebug) console.log('this.layoutTimes:', this.layoutTimes)
    if (this.layoutTimes > 300) {
      this.graphSetting.autoLayouting = false
      return
    }
    this.layoutTimes++
    this.__origin_nodes.forEach(thisNode => {
      thisNode.Fx = 0
      thisNode.Fy = 0
    })
    var __by_node = true // parseInt(this.layoutTimes / 10) % 2 === 1
    var __by_line = true // parseInt(this.layoutTimes / 10) % 2 === 0
    if (__by_node) {
      for (const i in this.__origin_nodes) {
        var __node1 = this.__origin_nodes[i]
        if (__node1.lot.placed === true) {
          // 循环点，综合点与其他所有点点斥力及方向
          for (var j in this.__origin_nodes) {
            var __node2 = this.__origin_nodes[j]
            if (__node2.lot.placed === true) {
              // 循环点，计算i点与j点点斥力及方向
              if (i !== j) {
                this.addGravityByNode(__node1, __node2)
              }
            }
          }
        }
      }
    }
    if (__by_line) {
      for (const i in this.__origin_nodes) {
        // 循环线,设置每个点承受点力及力点方向
        if (this.__origin_nodes[i].lot.parent) {
          this.addElasticByLine(this.__origin_nodes[i].lot.parent, this.__origin_nodes[i])
        }
      }
    }
    for (const i in this.__origin_nodes) {
      this.applyToNodePosition(this.__origin_nodes[i])
    }
    window.setTimeout(function() { this.autoLayout() }.bind(this), 30)
  }
  this.stop = function() {
    this.layoutTimes = 1000
  }
  this.addElasticByLine = function(node1, node2) {
    var length = Math.sqrt(Math.pow((node1.y - node2.y), 2) + Math.pow((node1.x - node2.x), 2))
    if (length > 1000) {
      length = 1000
    }
    var Kf = length < 30 ? 0 : ((length - 30) * 0.05)
    var Kf_1 = Kf
    var Kf_2 = Kf
    var _buff_x = (node1.x - node2.x) / length
    var _buff_y = (node1.y - node2.y) / length
    this.addFtoNode(node1, _buff_x * Kf_1 * -1, _buff_y * Kf_1 * -1, 1)
    this.addFtoNode(node2, _buff_x * Kf_2, _buff_y * Kf_2, 1)
  }
  this.addGravityByNode = function(node1, node2) {
    var length = Math.sqrt(Math.pow((node1.y - node2.y), 2) + Math.pow((node1.x - node2.x), 2))
    var zero_length = 300
    var Kf = length > zero_length ? 0 : ((zero_length - length) * 0.03)
    if (zero_length < 30) {
      Kf = Kf * 100
    }
    var _buff_x = (node1.x - node2.x) / length
    var _buff_y = (node1.y - node2.y) / length
    this.addFtoNode(node1, _buff_x * Kf, _buff_y * Kf, 0)
    this.addFtoNode(node2, _buff_x * Kf * -1, _buff_y * Kf * -1, 0)
  }
  this.getNodeFWeight = function(node) {
    var level = node.lot.level
    if (level > 7)level = 7
    if (level < 0)level = 0
    return (8 - level) / 8
  }
  this.addFtoNode = function(node, x, y) {
    if (isNaN(x) || isNaN(y)) {
      return
    }
    x = x / node.lot.strength
    y = y / node.lot.strength
    if (x > 50)x = 50
    if (y > 50)y = 50
    if (x < -50)x = -50
    if (y < -50)y = -50
    node.Fx += x
    node.Fy += y
  }
  this.applyToNodePosition = function(node) {
    const __buff_x = parseInt(node.Fx)
    const __buff_y = parseInt(node.Fy)
    node.x = node.x + __buff_x
    node.y = node.y + __buff_y
    node.Fx = 0
    node.Fy = 0
  }
}

export default SeeksAutoLayouter
