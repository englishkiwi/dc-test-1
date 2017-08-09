Resources = new Mongo.Collection("resources");

Schemas.Resource = new SimpleSchema({
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
    type: {
		type: String,
		allowedValues: ["resource"],
		defaultValue: "resource",
	},
	calculation: {
		type: String,
		optional: true,
		trim: false,
	},
	enabled: {
		type: Boolean,
		defaultValue: true,
	},
});

Resources.attachSchema(Schemas.Resource);

Resources.attachBehaviour("softRemovable");
makeChild(Resources, ["enabled"]);

Resources.allow(CHARACTER_SUBSCHEMA_ALLOW);
Resources.deny(CHARACTER_SUBSCHEMA_DENY);
