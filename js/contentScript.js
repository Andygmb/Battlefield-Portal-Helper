var s = document.createElement('script');
s.src = chrome.runtime.getURL('js/script.js');
document.head.appendChild(s);

chrome.runtime.onMessage.addListener((msg, sender, response) => {
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
	chrome.runtime.sendMessage({ clipboard: e.detail, newData: true});
});