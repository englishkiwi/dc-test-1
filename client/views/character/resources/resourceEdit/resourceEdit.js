var profTypes = [
	{type: "points", name: "Points"},
	{type: "custom", name: "Custom"},
];

var points = [
	{name: "Custom Points", stat: "custom"},
	{name: "Ki Points", stat: "ki"},
	{name: "Sorcery Points", stat: "sorceryPoints"},
	{name: "Rages", stat: "rages"},
	{name: "Rage Damage", stat: "rageDamage"},
	{name: "Expertise Dice", stat: "expertiseDice"},
    {name: "Superiority Dice", stat: "superiorityDice"},
];

Template.resourceEdit.helpers({
	resourceTypes: function(){
		return profTypes;
	},
	resInputTemplate: function(){
		if (!this.type) return null;
		if (this.type === "skill" ||
			this.type === "save") return "resDropdown";
		return "resInput";
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
	"iron-select .resDropDown": function(event){
		var detail = event.originalEvent.detail;
		var name = detail.item.getAttribute("name");
		if (name == this.name) return;
		Resources.update(this._id, {$set: {name: name}});
	},
	"change .resInput": function(event){
		var name = event.currentTarget.value;
		Resources.update(this._id, {$set: {name: name}});
	},
});

Template.resDropdown.helpers({
	resDropdownItems: function(){
		if (this.type === "points") return points;
	}
});
