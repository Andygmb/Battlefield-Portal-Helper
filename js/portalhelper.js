let events = ['copy', 'paste', 'undo', 'redo'];
let browserObj = chrome;

browserObj.storage.local.get('current_serialized_xml', function (items) {
    document.getElementById("blockTextArea").value = items.current_serialized_xml || "";
});

events.forEach(function(e){
  var msgObj = {[e]: true};
  if (e === "paste") {
    document.getElementById(e).addEventListener("click", async () => {
      browserObj.tabs.query({active: true,currentWindow: true}, tabs => {
        msgObj['clipboard'] = document.getElementById("blockTextArea").value;
        browserObj.tabs.sendMessage(tabs[0].id,msgObj);
      });
    });
  } else {
    document.getElementById(e).addEventListener("click", async () => {
      browserObj.tabs.query({active: true,currentWindow: true}, tabs => {
        browserObj.tabs.sendMessage(tabs[0].id,msgObj);
      });
    });
  }
});

browserObj.runtime.onMessage.addListener(function(r, sender, sendr){
  if ("newData" in r) {
    browserObj.storage.local.set({'current_serialized_xml':r.clipboard});
    document.getElementById("blockTextArea").value = r.clipboard;
  }
});

