Resources = new Mongo.Collection("resources");

Schemas.Resource = new SimpleSchema({
	charId: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
		index: 1,
	},
	name: {
		type: String,
		trim: false,
		optional: true,
	},
	value: {
		type: Number,
		decimal: true,
		optional: true,
	},
	type: {
		type: String,
		allowedValues: ["points", "custom"],
		defaultValue: "points",
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
