const Objection = require("../objection-config")
const Role = require("./Role")

class User extends Objection {
  static get tableName() {
    return "users"
  }

  static get relationMappings() {
    return {
      role: {
        relation: Objection.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: "users.role_id",
          to: "roles.id",
        },
      },
    }
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["username", "full_name", "password_hash", "role_id"],
      properties: {
        id: { type: "integer" },
        username: { type: "string", minLength: 1, transform: ["trim"] },
        full_name: { type: "string", minLength: 2, transform: ["trim", "toLowerCase"] },
        password_hash: { type: "string" },
        role_id: { type: "integer" },
      },
    }
  }
}
module.exports = User
