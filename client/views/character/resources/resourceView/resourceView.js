var points = {
	custom: "Custom Points",
	ki: "Ki Points",
	sorceryPoints: "Sorcery Points",
	rages: "Rages",
	rageDamage: "Rage Damage",
	expertiseDice: "Expertise Dice",
    superiorityDice: "Superiority Dice",
};

Template.resourceView.helpers({
	profIcon: function(){
		var prof = this.value;
		if (prof > 0 && prof < 1) return "image:brightness-2";
		if (prof === 1) return "image:brightness-1";
		if (prof > 1) return "av:album";
		return "radio-button-off";
	},
	getName: function(){
		if (this.type === "points") return points[this.name];
		return this.name;
	},
});
