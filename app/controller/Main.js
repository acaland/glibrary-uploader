Ext.define('Uploader.controller.Main', {
	extend: 'Ext.app.Controller',

	init: function() {
		var me = this;

		me.control({
			'grid': {
				itemdblclick: me.fileSelected
			},
			'metadataeditor toolbar button': {
				click: me.saveMetadata
			}
		});

		console.log('Main Controller loaded');
		
	},

	fileSelected: function(grid,record,item,index,event,ops) {
		var me = this;
		//console.log('hai selezionato un file');

		//console.log(record.data);

		var typestree = Ext.ComponentQuery.query('typestree')[0];
		var selectedType = typestree.getSelectionModel().getSelection() [0];

		if (!selectedType || selectedType.data.depth == 0) {
			Ext.Msg.alert("Error","Please select a type first!");
		} else {
			console.log(selectedType.data);
			me.loadMetadata(selectedType.data.path, record.data);
		}
	},

	loadMetadata: function(typepath, record) {

		Ext.Ajax.request({
			url: 'http://glibrary.ct.infn.it/django/metadata' + typepath + '/',
			method: 'GET',
			success: function(response) {
				var data = Ext.decode( response.responseText );
				console.log(data.metadata);
				var editor = Ext.ComponentQuery.query('#editor')[0];
				//console.log(editor);
				editor.buildItems(data.metadata.fields, record);
			},
			failure: function(response) {
				Ext.Msg.alert("Error","Cannot retrieve the metadata for the selected type. Look at the error log");
				console.log("error");
				console.log(response);
			}
		});
	},

	saveMetadata: function() {
		var selectedType = typestree.getSelectionModel().getSelection() [0];
		if (!selectedType || selectedType.data.depth == 0) {
			Ext.Msg.alert("Error","Please select a type first!");
			return;
		}
		var metadata = Ext.ComponentQuery.query('metadataeditor')[0].getForm().getValues();
		var fname = metadata.FileName.replace(/ /g, "_");
		metadata.Replica = "https://infn-se-03.ct.pi2s2.it/dpm/ct.pi2s2.it/home/vo.indicate-project.eu/glibrary/" + fname;
		Ext.Ajax.request({
			url: 'http://glibrary.ct.infn.it/django/addEntry' + selectedType.data.path + '/',
			params: metadata,
			success: function(response) {
				Ext.ComponentQuery.query('metadataeditor')[0].getForm().reset();
			},
			failure: function(response) {
				Ext.Msg.alert("Error","Cannot save metadata to the server. Look at the error log");
				console.log("error");
				console.log(response);
			}
		})
	}
});