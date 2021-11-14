let browserObj = chrome;
var s = document.createElement('script');
s.src = browserObj.runtime.getURL('js/script.js');
document.head.appendChild(s);

browserObj.runtime.onMessage.addListener((msg, sender, response) => {
	var msgObj = {};
	["copy", "undo", "redo", "paste"].forEach(function(key){
		if (key in msg) {
			msgObj[key] = true;
			if (key === "paste" ){
				msgObj.clipboard = msg.clipboard
			}
			window.postMessage(msgObj, "*");
		}
	});
})

document.addEventListener('clipboard_copy', function(e) {
	browserObj.runtime.sendMessage({ clipboard: e.detail, newData: true});
});