const express = require("express");
const router = express.Router();
const {
  userRegister,
  userLogin,
  userMe,
  userLogout,
} = require("../controllers/auth.controller.js");
const { authUser } = require("../middlewares/auth.middleware");

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/me", authUser, userMe);
router.get("/checkAuth", authUser, (req, res) => {
  // lightweight endpoint for frontend route protection
  if (!req.user) return res.status(200).json({ authenticated: false });
  return res.status(200).json({ authenticated: true, user: { email: req.user.email, fullName: req.user.fullName, _id: req.user._id } });
});
router.post("/logout", userLogout);

module.exports = router;
