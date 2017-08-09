var resTypes = [
	{type: "resource", name: "Resource"},
];

var resources = [
	{name: "Expertise Dice", stat: "expertiseDice"},
    {name: "Custom Points", stat: "custom"},
	{name: "Ki Points", stat: "ki"},
	{name: "Rages", stat: "rages"},
	{name: "Sorcery Points", stat: "sorceryPoints"},
	{name: "Superiority Dice", stat: "superiorityDice"},
];

Template.resourceEdit.helpers({
	resourceTypes: function(){
		return resTypes;
	},
	nameInputTemplate: function(){
		if (!this.type) return null;
		if (this.type === "resource") return "nameDropdown";
		return "nameInput";
	},
});

Template.resourceEdit.events({
	"click .deleteResource": function(event){
		Resources.softRemoveNode(this._id);
		GlobalUI.deletedToast(this._id, "Resources", "Resource");
	},
	"iron-select .typeDropDown": function(event){
		var detail = event.originalEvent.detail;
		var type = detail.item.getAttribute("name");
		if (type == this.type) return;
		Resources.update(this._id, {$set: {type: type}});
	},
	"iron-select .valueDropDown": function(event){
		var detail = event.originalEvent.detail;
		var value = +detail.item.getAttribute("name");
		if (value == this.value) return;
		Resources.update(this._id, {$set: {value: value}});
	},
	"iron-select .nameDropDown": function(event){
		var detail = event.originalEvent.detail;
		var name = detail.item.getAttribute("name");
		if (name == this.name) return;
		Resources.update(this._id, {$set: {name: name}});
	},
	"change .nameInput": function(event){
		var name = event.currentTarget.value;
		Resources.update(this._id, {$set: {name: name}});
	},
});

Template.nameDropdown.helpers({
	nameDropdownItems: function(){
		if (this.type === "resource") return resources;
	}
});
