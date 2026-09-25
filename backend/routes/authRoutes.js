import express from "express";
import {
  handleRegister,
  handleLogin,
  handlePhoneOtp,
  handlePhoneLogin,
  handleAdminVerifyCode,
  handleAdminUniversalLogin,
  authenticateToken
} from "../authController.js";
import { loadUsers, saveUsers, dbState } from "../db.js";

const router = express.Router();

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/phone-otp", handlePhoneOtp);
router.post("/phone-login", handlePhoneLogin);
router.post("/admin-verify", handleAdminVerifyCode);
router.post("/admin-login", handleAdminUniversalLogin);
router.post("/admin-universal", handleAdminUniversalLogin);


router.get("/me", authenticateToken, (req, res) => {
  const users = loadUsers();
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      city: user.city,
      phone: user.phone
    }
  });
});

router.put("/profile", authenticateToken, (req, res) => {
  const { name, phone, city } = req.body;
  let users = loadUsers();
  const userIndex = users.findIndex((u) => u.id === req.user.id);
  if (userIndex === -1) return res.status(404).json({ error: "User not found" });

  if (name) users[userIndex].name = name.trim();
  if (phone) users[userIndex].phone = phone.trim();
  if (city) users[userIndex].city = city.trim();

  saveUsers(users);
  dbState.users = users;

  const u = users[userIndex];
  res.json({
    message: "Profile updated successfully",
    user: { id: u.id, name: u.name, email: u.email, role: u.role, city: u.city, phone: u.phone }
  });
});

export default router;
