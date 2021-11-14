let port = chrome.runtime.connect();
let events = ['copy', 'paste', 'undo', 'redo'];

chrome.storage.local.get('current_serialized_xml', function (items) {
    document.getElementById("blockTextArea").value = items.current_serialized_xml;
});

events.forEach(function(e){
  var msgObj = {[e]: true};
  if (e === "paste") {
    document.getElementById(e).addEventListener("click", async () => {
      chrome.tabs.query({active: true,currentWindow: true}, tabs => {
        msgObj['clipboard'] = document.getElementById("blockTextArea").value;
        chrome.tabs.sendMessage(tabs[0].id,msgObj);
      });
    });
  } else {
    document.getElementById(e).addEventListener("click", async () => {
      chrome.tabs.query({active: true,currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id,msgObj);
      });
    });
  }
});

chrome.runtime.onMessage.addListener(function(r, sender, sendr){
  if ("newData" in r) {
    chrome.storage.local.set({'current_serialized_xml':r.clipboard});
    document.getElementById("blockTextArea").value = r.clipboard;
  }
});

