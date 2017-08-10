var stats = {
	"custom":{"name":"Custom Points"},
    "ki":{"name":"Ki Points"},
	"sorceryPoints":{"name":"Sorcery Points"},
	"rages":{"name":"Rages"},
	"rageDamage":{"name":"Rage Damage"},
	"expertiseDice":{"name":"Expertise Dice"},
	"superiorityDice":{"name":"Superiority Dice"},
};

var operations = {
	base: {name: "Base Value: "},
	proficiency: {name: "Proficiency"},
	add: {name: "+"},
	mul: {name: "×"},
	min: {name: "Min: "},
	max: {name: "Max: "},
	advantage: {name: "Advantage"},
	disadvantage: {name: "Disadvantage"},
	passiveAdd: {name: "Passive Bonus: "},
	fail: {name: "Automatically Fail"},
};

Template.resourceView.helpers({
	sourceName: function(){
		var id = this.parent.id;
		if (!id) return;
		switch (this.parent.collection){
			case "Features":
				return "Feature - " + Features.findOne(id, {fields: {name: 1}}).name;
			case "Classes":
				return Classes.findOne(id, {fields: {name: 1}}).name;
			case "Buffs":
				return "Buff - " + Buffs.findOne(id, {fields: {name: 1}}).name;
			case "Items":
				return "Equipment - " + Items.findOne(id, {fields: {name: 1}}).name;
			case "Characters":
				return Characters.findOne(this.charId, {fields: {race: 1}}).race;
			default:
				return "Inate";
		}
	},
	statName: function(){
		return stats[this.stat] && stats[this.stat].name || "No Stat";
	},
	operationName: function(){
		if (
			this.operation === "proficiency" ||
			this.operation === "conditional"
		) return null;
		if (stats[this.stat] && stats[this.stat].group === "Weakness/Resistance")
			return null;
		if (this.operation === "add" && evaluateResource(this.charId, this) < 0)
			return null;
		return operations[this.operation] &&
			operations[this.operation].name || "No Operation";
	},
	resValue: function(){
		if (
			this.operation === "advantage" ||
			this.operation === "disadvantage" ||
			this.operation === "fail"
		){
			return null;
		}
		if (this.operation === "proficiency"){
			if (this.value == 0.5 || this.calculation == 0.5)
				return "Half Proficiency";
			if (this.value == 1   || this.calculation == 1)
				return "Proficiency";
			if (this.value == 2   || this.calculation == 2)
				return "Double Proficiency";
		}
		if (this.operation === "conditional"){
			return this.calculation || this.value;
		}
		if (stats[this.stat] && stats[this.stat].group === "Weakness/Resistance"){
			if (this.value === 0.5) return "Resistance";
			if (this.value === 2)   return "Vulnerability";
			if (this.value === 0)   return "Immunity";
		}
		var value = evaluateResource(this.charId, this);
		if (_.isNumber(value)) return value;
		return this.calculation || this.value;
	},
});
