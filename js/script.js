
function mainBlocklyListeners(){
	var ws = _Blockly.getMainWorkspace();
	var copyFunction = function(){
		var xmlserializer = new XMLSerializer();
		var selected = _Blockly.selected;
		if (selected !== null) {
			var copied = xmlserializer.serializeToString(selected.toCopyData().xml);
			console.debug("Copied", copied);
			document.dispatchEvent(new CustomEvent('clipboard_copy', {
				detail: copied
			}));
		}
	}
	ws.addChangeListener(function(e){
		if(e.type === _Blockly.Events.SELECTED) {
			copyFunction();
		}
	})

	window.addEventListener("message", function(event){
		if (event.data.copy) {
			copyFunction();
		};
		if (event.data.paste) {
			var xml = _Blockly.Xml.textToDom(event.data.clipboard);
			console.debug("Pasted", xml);
			if (xml.getAttribute('type') === 'modBlock') {
				xml = xml.firstChild.firstChild;
			}
			var newBlock = _Blockly.Xml.domToBlock(xml, ws);
		};
		if (event.data.undo) {
			_Blockly.getMainWorkspace().undo();
		};
		if (event.data.redo) {
			_Blockly.getMainWorkspace().undo(true);
		};
	});
}



(function() {
	var checkInterval = setInterval(checkForBlocklyLoad, 1000);

	function checkForBlocklyLoad() {
	    if (typeof _Blockly != "undefined") {
	        clearInterval (checkInterval);
	        mainBlocklyListeners();
	    }
	}
})();