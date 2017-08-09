var resources = {
	expertiseDice: "Expertise Dice",
    custom: "Custom Points",
	ki: "Ki Points",
	rages: "Rages",
	sorceryPoints: "Sorcery Points",
	superiorityDice: "SuperiorityDice",
};

Template.resourceView.helpers({
	getName: function(){
		if (this.type === "resource") return resources[this.name];
		return this.name;
	},
});
