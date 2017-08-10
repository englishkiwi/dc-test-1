Template.resourceEditList.helpers({
	resources: function(){
		var selector = {
			"parent.id": this.parentId,
			"charId": this.charId,
		};
		if (this.parentGroup){
			selector["parent.group"] = this.parentGroup;
		}
		return Resources.find(selector);
	}
});

Template.resourceEditList.events({
	"tap #addResourceButton": function(){
		if (!_.isBoolean(this.enabled)) {
			this.enabled = true;
		}
		Resources.insert({
			charId: this.charId,
			parent: {
				id: this.parentId,
				collection: this.parentCollection,
				group: this.parentGroup,
			},
			enabled: this.enabled,
			value: 1,
			type: "points",
		});
	},
});
