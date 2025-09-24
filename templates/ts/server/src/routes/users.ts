import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import User, { IUser } from "../models/user.js";

const router = Router();

interface PaginationQuery {
  page?: string;
  limit?: string;
}

// Get all users
router.get("/", async (req: Request<{}, {}, {}, PaginationQuery>, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error: any) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    next(error);
  }
});

// Create new user
router.post("/", [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete (userResponse as any).password;

    res.status(201).json({
      message: "User created successfully",
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
});

// Update user
router.put("/:id", [
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").optional().isEmail().normalizeEmail().withMessage("Please provide a valid email")
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { name, email } = req.body;
    const updateData: Partial<IUser> = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user
    });
  } catch (error: any) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    next(error);
  }
});

// Delete user
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    next(error);
  }
});

export default router;
