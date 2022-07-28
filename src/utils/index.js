
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
export default { getUUID, uploadFile }