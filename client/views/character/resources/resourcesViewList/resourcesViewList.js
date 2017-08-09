Template.resourcesViewList.helpers({
	effects: function(){
		var selector = {
			"parent.id": this.parentId,
			"charId": this.charId,
		};
		if (this.parentGroup){
			selector["parent.group"] = this.parentGroup;
		}
		let resources =  Resources.find(selector, {
			fields: {parent: 0},
		}).fetch();
		return _.sortBy(resources, resource => statOrder[resource.stat] || 999);
	}
});
