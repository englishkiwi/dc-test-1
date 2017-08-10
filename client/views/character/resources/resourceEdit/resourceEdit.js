//TODO add dexterity armor
// jscs:disable maximumLineLength
var stats = [
	{stat: "custom", name: "Custom Points", group: "Stats"},
    {stat: "ki", name: "Ki Points", group: "Stats"},
	{stat: "sorceryPoints", name: "Sorcery Points", group: "Stats"},
	{stat: "rages", name: "Rages", group: "Stats"},
	{stat: "rageDamage", name: "Rage Damage", group: "Stats"},
	{stat: "expertiseDice", name: "Expertise Dice", group: "Stats"},
	{stat: "superiorityDice", name: "Superiority Dice", group: "Stats"},
];

// jscs:enable maximumLineLength

var statsDict = _.indexBy(stats, "stat");
var statGroups = _.groupBy(stats, "group");
var statGroupNames = _.keys(statGroups);

var attributeOperations = [
	{name: "Base Value", operation: "base"},
	{name: "Add", operation: "add"},
	{name: "Multiply", operation: "mul"},
	{name: "Min", operation: "min"},
	{name: "Max", operation: "max"},
];
var skillOperations = [
	{name: "Add", operation: "add"},
	{name: "Multiply", operation: "mul"},
	{name: "Min", operation: "min"},
	{name: "Max", operation: "max"},
	{name: "Advantage", operation: "advantage"},
	{name: "Disadvantage", operation: "disadvantage"},
	{name: "Passive Bonus", operation: "passiveAdd"},
	{name: "Automatically Fail", operation: "fail"},
	{name: "Conditional Benefit", operation: "conditional"},
];

Template.resourceEdit.onRendered(function(){
	_.defer(() => {
		const statElement = this.find(".statMenu .iron-selected");
		statElement && statElement.scrollIntoView();
		const opElement = this.find(".operationMenu .iron-selected");
		opElement && opElement.scrollIntoView();
	});
});

Template.resourceEdit.helpers({
	resource: function(){
		return Resources.findOne(this.id);
	},
	statGroups: function(){
		return statGroupNames;
	},
	stats: function(){
		var group = this;
		return statGroups[group];
	},
	operations: function(){
		var stat = statsDict[this.stat];
		var group = stat && stat.group;
		if (group === "Weakness/Resistance") return null;
		if (group === "Saving Throws" || group === "Skills"){
			return skillOperations;
		} else {
			return attributeOperations;
		}
	},
	showMultiplierOperations: function(){
		var stat = statsDict[this.stat];
		return stat && stat.group === "Weakness/Resistance"
	},
	showResourceValueInput: function(){
		var stat = statsDict[this.stat];
		var group = stat && stat.group;
		if (
			group === "Weakness/Resistance"
		) return false;
		var op = this.operation;
		if (
			!op ||
			op === "advantage" ||
			op === "disadvantage" ||
			op === "fail"
		) return false;
		return true;
	},
	resourceValue: function(){
		return this.calculation || this.value;
	},
	isGroupSelected: function(groupName, statName){
		var stat = statsDict[statName]
		return stat && (stat.group === groupName);
	},
});

var setStat = function(statName, resourceId){
	var setter = {stat: statName};
	var resource = Resources.findOne(this._id);
	var group = statsDict[statName].group;
	if (group === "Saving Throws" || group === "Skills"){
		// Skills must have a valid skill operation
		if (!_.contains(
			_.map(skillOperations, ao => ao.operation),
			resource.operation
		)){
			setter.operation = "add";
		}
	} else if (group !== "Weakness/Resistance"){
		// Attributes must have a valid attribute operation
		if (!_.contains(
			_.map(attributeOperations, ao => ao.operation),
			resource.operation
		)){
			setter.operation = "base";
		}
	} else {
		// Weakness/Resistance must have a mul operation and value
		if (resource.operation !== "mul"){
			setter.operation = "mul";
		}
		if (!_.contains([0, 0.5, 2], resource.value)){
			setter.value = 0.5;
		}
	}
	Resources.update(resourceId, {$set: setter});
};

var scrollAnimationId;
var scrollElementToView = element => {
	var scrollFunction =  function(){
		element.scrollIntoView();
		scrollAnimationId = requestAnimationFrame(scrollFunction);
	};
	return scrollFunction;
}

Template.resourceEdit.events({
	"click #deleteButton": function(event, instance){
		Resources.softRemoveNode(instance.data.id);
		GlobalUI.deletedToast(instance.data.id, "Resources", "Resource");
		popDialogStack();
	},
	"click .statGroupTitle": function(event, instance){
		var groupName = this.toString();
		var firstStat = statGroups[groupName][0].stat;
		setStat(firstStat, instance.data.id);
		scrollAnimationId = requestAnimationFrame(scrollElementToView(event.target));
		_.delay(() => cancelAnimationFrame(scrollAnimationId), 300);
	},
	"iron-select .statMenu": function(event){
		var detail = event.originalEvent.detail;
		var statName = detail.item.getAttribute("name");
		if (statName == this.stat) return;
		setStat(statName, this._id);
	},
	"iron-select .operationMenu": function(event){
		var detail = event.originalEvent.detail;
		var opName = detail.item.getAttribute("name");
		if (opName == this.operation) return;
		Resources.update(this._id, {$set: {operation: opName}});
	},
	"iron-select .multiplierMenu": function(event){
		var detail = event.originalEvent.detail;
		var value = +detail.item.getAttribute("name");
		if (value == this.value) return;
		Resources.update(this._id, {$set: {
			value: value,
			calculation: "",
			operation: "mul",
		}});
	},
	"change .resourceValueInput, input .resourceValueInput":
	_.debounce(function(event){
		var value = event.currentTarget.value;
		var numValue = value === "" ? NaN : +value;
		if (_.isFinite(numValue)){
			if (this.value === numValue) return;
			Resources.update(this._id, {
				$set: {value: numValue},
				$unset: {calculation: ""},
			});
		} else if (_.isString(value)){
			if (this.calculation === value) return;
			Resources.update(this._id, {
				$set: {calculation: value},
				$unset: {value: ""},
			}, {
				removeEmptyStrings: false,
				trimStrings: false,
			});
		}
	}, 400),
});
