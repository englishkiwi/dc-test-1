Template.resourcesEditList.helpers({
	resources: function(){
		var selector = {
			"parent.id": this.parentId,
			"parent.collection": this.parentCollection,
			"charId": this.charId,
		};
		if (this.parentGroup){
			selector["parent.group"] = this.parentGroup;
		}
		var resources = Resources.find(selector).fetch();
		return _.sortBy(resources, resource => statOrder[resource.stat] || 999);
	}
});

Template.resourcesEditList.events({
	"tap #addResourceButton": function(event, instance){
		if (!_.isBoolean(this.enabled)) {
			this.enabled = true;
		}
		const resourceId = Resources.insert({
			name: this.name,
			charId: this.charId,
			parent: {
				id: this.parentId,
				collection: this.parentCollection,
				group: this.parentGroup,
			},
			operation: "add",
			enabled: this.enabled,
		});
		pushDialogStack({
			template: "resourceEdit",
			data: {id: resourceId},
			element: event.currentTarget,
			returnElement: () => instance.find(`tr.resource[data-id='${resourceId}']`),
		});
	},
	"tap .edit-resource": function(event, template){
		pushDialogStack({
			template: "resourceEdit",
			data: {id: this._id},
			element: event.currentTarget.parentElement.parentElement,
		});
	},
});
