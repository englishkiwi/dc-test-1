Resources = new Mongo.Collection("resources");

/*
 * Resources are reason-value attached to skills and abilities
 * that modify their final value or presentation in some way
 */
Schemas.Effect = new SimpleSchema({
	charId: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
		index: 1,
	},
	name: {
		type: String,
		optional: true, //TODO make necessary if there is no owner
		trim: false,
	},
	operation: {
		type: String,
		defaultValue: "add",
		allowedValues: [
			"base",
			"proficiency",
			"add",
			"mul",
			"min",
			"max",
			"advantage",
			"disadvantage",
			"passiveAdd",
			"fail",
			"conditional",
		],
	},
	value: {
		type: Number,
		decimal: true,
		optional: true,
	},
	calculation: {
		type: String,
		optional: true,
		trim: false,
	},
	//the thing that created this resource
	parent: {
		type: Schemas.Parent
	},
	//which stat the resource is applied to
	stat: {
		type: String,
		optional: true,
	},
	enabled: {
		type: Boolean,
		defaultValue: true,
	},
});

Resources.attachSchema(Schemas.Effect);

Resources.attachBehaviour("softRemovable");
makeChild(Resources, ["enabled"]); //children of lots of things

Resources.allow(CHARACTER_SUBSCHEMA_ALLOW);
Resources.deny(CHARACTER_SUBSCHEMA_DENY);

//give characters default character resources
Characters.after.insert(function(userId, char) {
	if (Meteor.isServer) {
		Resources.insert({
			charId: char._id,
			name: "Constitution modifier for each level",
			stat: "hitPoints",
			operation: "add",
			calculation: "level * constitutionMod",
			parent: {
				id: char._id,
				collection: "Characters",
				group: "Inate",
			},
		});
		Resources.insert({
			charId: char._id,
			name: "Proficiency bonus by level",
			stat: "proficiencyBonus",
			operation: "add",
			calculation: "floor(level / 4 + 1.75)",
			parent: {
				id: char._id,
				collection: "Characters",
				group: "Inate",
			},
		});
		Resources.insert({
			charId: char._id,
			name: "Dexterity Armor Bonus",
			stat: "armor",
			operation: "add",
			calculation: "dexterityArmor",
			parent: {
				id: char._id,
				collection: "Characters",
				group: "Inate",
			},
		});
		Resources.insert({
			charId: char._id,
			name: "Natural Armor",
			stat: "armor",
			operation: "base",
			value: 10,
			parent: {
				id: char._id,
				collection: "Characters",
				group: "Inate",
			},
		});
		Resources.insert({
			charId: char._id,
			name: "Natural Carrying Capacity",
			stat: "carryMultiplier",
			operation: "base",
			value: "1",
			parent: {
				id: char._id,
				collection: "Characters",
				group: "Inate",
			},
		});
	}
});
