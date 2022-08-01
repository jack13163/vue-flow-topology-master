import SeeksGraphMath from '../SeeksGraphMath'

function SeeksBidirectionalTreeLayouter(layoutSetting, graphSetting) {
  this.graphSetting = graphSetting
  this.config = layoutSetting || {}
  console.log('new SeeksBidirectionalTreeLayouter:', this.config)
  if (!this.config.from) this.config.from = 'left'
  if (this.config.levelDistance && typeof this.config.levelDistance === 'string') {
    this.config.levelDistanceArr = this.config.levelDistance.split(',').map(thisNum => parseInt(thisNum))
  }
  this.rootNode = null
  this.allNodes = []
  this.__origin_nodes = []
  this.refresh = function() {
    console.log('SeeksBidirectionalTreeLayouter:refresh:nodes:', this.__origin_nodes.length)
    this.placeNodes(this.__origin_nodes, this.rootNode)
  }
  this.analysisNodes4Didirectional = function(willLayoutNodes, thisLevelNodes, thisDeep, analyticResult, levelDirect) {
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
      if (levelDirect === -1) {
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
      this.analysisNodes4Didirectional(willLayoutNodes, newLevelNodes, thisDeep + levelDirect, analyticResult, levelDirect)
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
  }
  this.placeNodes = function(allNodes, rootNode) {
    console.log('SeeksBidirectionalTreeLayouter:placeNodes')
    if (!rootNode) {
      console.error('root is null')
      return
    } else {
      console.log('layout by root:', rootNode)
    }
    this.__origin_nodes = allNodes
    this.rootNode = rootNode
    allNodes.forEach(thisNode => {
      thisNode.lot.eached = false
      thisNode.lot.notLeafNode = false
      thisNode.lot.childs = []
      thisNode.lot.index_of_parent = 0
      thisNode.lot.strength = 0
      thisNode.lot.strengthWithChilds_from = 0
      thisNode.lot.strengthWithChilds = 0
      thisNode.lot.prevNode = undefined
      thisNode.lot.nextNode = undefined
      thisNode.lot.placed = false
    })
    this.allNodes = []
    var analyticResult = {
      max_deep: 1,
      max_length: 1,
      max_strength: 1
    }
    this.analysisNodes4Didirectional(this.allNodes, [this.rootNode], 0, analyticResult, -1)
    this.placeNodesPosition(this.rootNode, this.allNodes, analyticResult)
    this.allNodes = []
    analyticResult = {
      max_deep: 1,
      max_length: 1,
      max_strength: 1
    }
    this.analysisNodes4Didirectional(this.allNodes, [this.rootNode], 0, analyticResult, 1)
    this.placeNodesPosition(this.rootNode, this.allNodes, analyticResult)
  }
  this.placeNodesPosition = function(rootNode, allNodes, analyticResult) {
    var __mapWidth = this.graphSetting.viewSize.width
    var __mapHeight = this.graphSetting.viewSize.height
    var __offsetX = rootNode.offset_x || 0
    var __offsetY = rootNode.offset_y || 0
    console.log('固定位置的rootNode:', rootNode.text, rootNode.x, rootNode.y)
    if (rootNode.origin_x === undefined) {
      rootNode.origin_x = rootNode.x
      rootNode.origin_y = rootNode.y
    }
    rootNode.lot.x = rootNode.origin_x
    rootNode.lot.y = rootNode.origin_y
    rootNode.x = rootNode.lot.x + __offsetX
    rootNode.y = rootNode.lot.y + __offsetY
    rootNode.lot.placed = true
    var dynamicSizeConfig = {
      __mapWidth,
      __mapHeight
    }
    this.placeRelativePosition(rootNode, analyticResult, dynamicSizeConfig)
    allNodes.forEach(thisNode => {
      if (thisNode.fixed === true) {
        thisNode.lot.placed = true
        return
      }
      if (!SeeksGraphMath.isAllowShowNode(thisNode)) return
      var __offsetX = thisNode.offset_x || 0
      var __offsetY = thisNode.offset_y || 0
      thisNode.x = thisNode.offset_x + thisNode.lot.x + __offsetX
      thisNode.y = thisNode.offset_y + thisNode.lot.y + __offsetY
      thisNode.lot.placed = true
    })
  }
  this.placeRelativePosition = function(rootNode, analyticResult, dynamicSizeConfig) {
    if (this.config.from === 'left' || this.config.from === 'right') {
      const __min_per_height = this.config.min_per_height || 80
      const __max_per_height = this.config.max_per_height || 400
      const __min_per_width = this.config.min_per_width || 430
      const __max_per_width = this.config.max_per_width || 650
      let __per_width = parseInt((dynamicSizeConfig.__mapWidth - 10) / (analyticResult.max_deep + 2))
      if (__per_width < __min_per_width)__per_width = __min_per_width
      if (__per_width > __max_per_width)__per_width = __max_per_width
      let __per_height = parseInt(dynamicSizeConfig.__mapHeight / (analyticResult.max_strength + 1))
      if (__per_height < __min_per_height)__per_height = __min_per_height
      if (__per_height > __max_per_height)__per_height = __max_per_height
      this.allNodes.forEach(thisNode => {
        if (thisNode.fixed === true) return
        if (thisNode.lot.placed === true) return
        if (thisNode === rootNode) return
        if (this.config.from === 'right') {
          thisNode.lot.x = rootNode.lot.x - this.getLevelDistance(thisNode, thisNode.lot.subling.level, __per_width)
        } else {
          thisNode.lot.x = rootNode.lot.x + this.getLevelDistance(thisNode, thisNode.lot.subling.level, __per_width)
        }
      })
      this.allNodes.forEach(thisNode => {
        if (thisNode.fixed === true) return
        if (thisNode.lot.level !== 0) {
          thisNode.lot.y = rootNode.lot.y + __per_height * ((analyticResult.max_strength / -2) + thisNode.lot.strengthWithChilds_from + thisNode.lot.strengthWithChilds / 2)
        }
      })
    } else {
      const __min_per_height = this.config.min_per_height || 250
      const __max_per_height = this.config.max_per_height || 400
      const __min_per_width = this.config.min_per_width || 250
      const __max_per_width = this.config.max_per_width || 500
      var __per_width = parseInt((dynamicSizeConfig.__mapWidth - 10) / (analyticResult.max_strength + 2))
      if (__per_width < __min_per_width)__per_width = __min_per_width
      if (__per_width > __max_per_width)__per_width = __max_per_width
      var __per_height = parseInt((dynamicSizeConfig.__mapHeight - 10) / (analyticResult.max_deep + 2))
      if (__per_height < __min_per_height)__per_height = __min_per_height
      if (__per_height > __max_per_height)__per_height = __max_per_height
      this.allNodes.forEach(thisNode => {
        if (thisNode.fixed === true) return
        if (thisNode.lot.placed === true) return
        if (thisNode === rootNode) return
        if (this.config.from === 'bottom') {
          thisNode.lot.y = rootNode.lot.y - this.getLevelDistance(thisNode, thisNode.lot.subling.level, __per_height)
        } else {
          thisNode.lot.y = rootNode.lot.y + this.getLevelDistance(thisNode, thisNode.lot.subling.level, __per_height)
        }
      })
      this.allNodes.forEach(thisNode => {
        if (thisNode.fixed === true) return
        if (thisNode.lot.level !== 0) {
          thisNode.lot.x = -58 + rootNode.lot.x + __per_width * ((analyticResult.max_strength / -2) + thisNode.lot.strengthWithChilds_from + thisNode.lot.strengthWithChilds / 2)
        }
      })
    }
  }
  this.getLevelDistance = function(node, level, perSize) {
    if (this.config.levelDistanceArr && this.config.levelDistanceArr.length > 0) {
      var _distance = 0
      for (let i = 0; i < level; i++) {
        var _thisLevelDistance = this.config.levelDistanceArr[i] || 100
        _distance += _thisLevelDistance
      }
      return _distance
    } else {
      return level * perSize
    }
  }
}

export default SeeksBidirectionalTreeLayouter
