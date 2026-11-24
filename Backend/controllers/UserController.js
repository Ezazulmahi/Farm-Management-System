import bcrypt from 'bcryptjs';
import User from '../Model/models/User.js';


// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, address, password, type } = req.body;

    if (!name || !email || !phoneNumber || !address || !password || !type) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }
    if (!["farmer", "customer"].includes(type)) {
      return res.status(400).json({ message: "Type must be farmer or customer." });
    }

    const existingUser = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }
    if (await User.findOne({ phoneNumber })) {
      return res.status(409).json({ message: "Phone number already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, phoneNumber, address, password: hashedPassword, type });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};


// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


// Fetch all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = ["name", "email", "phoneNumber", "address", "type", "password"];
    const updatedData = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updatedData[key] = req.body[key];
    }
    if (updatedData.password) {
      if (String(updatedData.password).length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters." });
      }
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};