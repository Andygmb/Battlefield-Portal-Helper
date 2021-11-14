setTimeout(function() {
	window.addEventListener("message", function(event){
		if (event.data.copy) {
			var xmlserializer = new XMLSerializer();
			var selected = _Blockly.selected;
			if (selected !== null) {
				var copied = xmlserializer.serializeToString(selected.toCopyData().xml);
				console.log(copied);
				document.dispatchEvent(new CustomEvent('clipboard_copy', {
					detail: copied
				}));
			}
		};
		if (event.data.paste) {
			var newBlock;
			_Blockly.clipboardXml_ = _Blockly.Xml.textToDom(event.data.clipboard);
			_Blockly.clipboardSource_ = _Blockly.getMainWorkspace();
			newBlock = _Blockly.Xml.domToBlock(_Blockly.clipboardXml_, _Blockly.clipboardSource_);
			_Blockly.clipboardTypeCounts = _Blockly.utils.getBlockTypeCounts(newBlock, true);
			if (newBlock.type === "modBlock") {
				// modBlocks can't be deleted which could cause confusion.
				// so unplug the child blocks and dispose of the modBlock
				var kids = newBlock.getChildren(true);
				if (kids.length > 0) {
					kids[0].unplugFromStack_(false);
				}
				newBlock.dispose();
			}
		};
		if (event.data.undo) {
			_Blockly.getMainWorkspace().undo();
		};
		if (event.data.redo) {
			_Blockly.getMainWorkspace().undo(true);
		};
	});
}, 300);