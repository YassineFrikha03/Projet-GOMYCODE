// Import model
import User from '../models/User.Model.js'
import handleError from '../middlewares/errors/handleError.js'


//user creation
const createUser = async (req, res) => {
    try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return handleError(res, null, "User with this email already exists", 409); // 409 Conflict
        }
        const existingUsername = await User.findOne({ name: req.body.name });
        if (existingUsername) {
            return handleError(res, null, "Username already exists", 409); // 409 Conflict
        }
        const newUser = new User(req.body);
        await newUser.save();
        return res.status(201).json(newUser); // 201 Created
    } catch (error) {
        handleError(res, error, "Error in creating user", 500); // 500 Internal Server Error
    }
};

// Get a single user by ID
const getOneUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return handleError(res, null, "User not found", 404); // 404 Not Found
        }
        return res.status(200).json( user );
    } catch (error) {
        handleError(res, error, "Error in fetching user", 500);
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json( users);
    } catch (error) {
        handleError(res, error, "Error in fetching users", 500);
    }
};

// Update a user by ID
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        // Vérifie si un autre utilisateur a déjà ce nom
        const existingUsername = await User.findOne({ name: req.body.name, _id: { $ne: userId } });
        if (existingUsername) {
            return handleError(res, null, "Username already exists", 409);
        }
        // Vérifie si un autre utilisateur a déjà cet email
        const existingEmail = await User.findOne({ email: req.body.email, _id: { $ne: userId } });
        if (existingEmail) {
            return handleError(res, null, "Email already exists", 409);
        }
        // Mise à jour après toutes les vérifications
        const user = await User.findByIdAndUpdate(userId, req.body,);
        if (!user) {
            return handleError(res, null, "User not found", 404);
        }
        return res.status(200).json(user);
    } catch (error) {
        handleError(res, error, "Error in updating user", 500);
    }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
    try {    
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) { 
            return handleError(res, null, "User not found", 404); // 404 Not Found
        }
        return res.status(200).json("User deleted successfully" );
    }
    catch (error) {
        handleError(res, error, "Error in deleting user", 500);
    }
}

// Export the user controller
const userController = {
    createUser,
    getOneUser,
    getAllUsers,
    updateUser,
    deleteUser
}



export default userController