const _ = require("lodash")
const bcrypt = require("bcrypt")
const { NotFoundError } = require("objection")
const User = require("../data-access/models/User")

module.exports = {
  async login(req, res) {
    try {
      let user = await User.query()
        .where("username", "=", _.get(req, ["body", "username"]))
        .withGraphFetched("role")
        .first()
        .throwIfNotFound()

      if (bcrypt.compareSync(_.get(req, ["body", "password"]), user.password_hash)) {
        let userData = { full_name: user.full_name, username: user.username, role: user.role, role_id: user.role_id }
        req.session.user = userData
        return res.json(userData)
      } else {
        return res.status(400).json({ message: "invalid login credentials" })
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(400).json({ message: "invalid login credentials" })
      }
      return res.status(500).json({ message: "something went wrong" })
    }
  },

  logout(req, res) {
    if (req.session) {
      req.session.destroy()
    }
    res.json({ message: "closed" })
  },
}
