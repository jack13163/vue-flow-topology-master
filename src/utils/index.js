import SeeksRGUtils from '@/components/relation-graph/core4vue/SeeksRGUtils'

const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
export const getUUID = () => {
	return (S4() + S4() + "-" + S4() + "-" + S4());
}

// 深拷贝解决使用JSON.stringify时遇到的循环引用问题
export const deepClone = source => {
	let cache = [];
	let targetObj = JSON.stringify(source, function(key, value) {
		if (typeof value === 'object' && value !== null) {
			if (cache.indexOf(value) !== -1) {
				return;
			}
			cache.push(value);
		}
		return value;
	});
	cache = null;
	return JSON.parse(targetObj);
}

export const uploadFile = (input, callBack) => {
	//支持chrome IE10  
	if (window.FileReader) {
		let file = input.files[0], filename = file.name.split(".")[0];
		let reader = new FileReader();
		reader.onload = function () {
			// console.log(this.result);
			callBack(this.result, filename)
		}
		reader.readAsText(file);
	}
	//支持IE 7 8 9 10  
	else if (typeof window.ActiveXObject != 'undefined') {
		let xmlDoc;
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = false;
		xmlDoc.load(input.value);
		callBack(xmlDoc.xml)
	}
	//支持FF  
	else if (document.implementation && document.implementation.createDocument) {
		let xmlDoc;
		xmlDoc = document.implementation.createDocument("", "", null);
		xmlDoc.async = false;
		xmlDoc.load(input.value);
		callBack(xmlDoc.xml)
	} else {
		console.error('文件读取失败！')
	}
}

export const loadGraphJsonData = (graphData) => {
	flatNodeData(graphData, null, [], [])
	appendNodeInfo(graphData)
	console.log('节点和连接信息预处理完毕')
}

const appendNodeInfo = (graphData) => {
	let _nodes = graphData.nodes;
	let result = []
	let seeksNodeIdIndex = 0;
	if (!graphData.nodes_map) {
		graphData.nodes_map = {}
	}
	_nodes.forEach(thisNodeJson => {
		// 添加节点额外信息
		let thisNode = SeeksRGUtils.json2Node(thisNodeJson)
		let __isNew = false
		if (graphData.nodes_map[thisNode.id]) {
			thisNode = graphData.nodes_map[thisNode.id]
		} else {
			__isNew = true
		}
		if (__isNew) {
			thisNode.seeks_id = seeksNodeIdIndex++
			thisNode.appended = false
			graphData.nodes_map[thisNode.id] = thisNode
			result.push(thisNode)
		}
	})
	// 更新子节点信息
	result.forEach(node => {
		if (node.targetNodes && node.targetNodes.length > 0) {
			let childs = []
			node.targetNodes.forEach(child => {
				childs.push(graphData.nodes_map[child.id])
			})
			node.targetNodes = childs
		}
	})
	graphData.nodes = result;
}

const flatNodeData = (graphData, parentNode, nodes_collect, links_collect) => {
	let orign_nodes = graphData.nodes;
	if (!graphData._map) {
		graphData._map = {}
		graphData.nodes.forEach(node => {
			node.lot = {}
			graphData._map[node.id] = node
		})
	}
	orign_nodes.forEach(thisOrignNode => {
		if (!thisOrignNode.flated) {
			thisOrignNode.flated = true
			nodes_collect.push(thisOrignNode)
			if (parentNode) {
				links_collect.push({
					from: parentNode.id,
					to: thisOrignNode.id,
				})
			}
			// 根据输入的数据进行预处理
			var _childs = thisOrignNode.childs || thisOrignNode.children
			if (!_childs) {
				_childs = []
				graphData.links.forEach(link => {
					if (link.sourceId === thisOrignNode.id) {
						let targetNode = graphData._map[link.targetId]
						_childs.push(targetNode)
					}
				})
			}
			if (_childs && _childs.length > 0) {
				thisOrignNode.targetNodes = _childs
				flatNodeData(graphData, thisOrignNode, nodes_collect, links_collect)
			} else {
				thisOrignNode.targetNodes = []
			}
		}
	})
}

export default { getUUID, uploadFile, loadGraphJsonData }