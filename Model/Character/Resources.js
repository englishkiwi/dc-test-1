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