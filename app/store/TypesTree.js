Ext.define('Uploader.store.TypesTree', {
    extend: 'Ext.data.TreeStore',
    //requires: 'Uploader.model.TypesTree',
    model: 'Uploader.model.TypesTree',

	
	root: {
        text: 'De Roberto',
        expanded: true,
        id: 0
    },
    
    proxy: {
        type: 'ajax',
        //url: '/django/mountTree/deroberto2/',
        url: 'http://glibrary.ct.infn.it/django/mountTree/deroberto2/',
        reader: {
            type: 'json'
        }
    } 
});