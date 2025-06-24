const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");

module.exports.registerUser = async(req, res) => {
	try{
		const existingEmail = await User.findOne({ email: req.body.email });
		if(existingEmail){
			return res.status(400).json({
				error: "Email already in use",
				message: "An account with this email address is already registered"
			});
		}
		const existingUser = await User.findOne({ username: req.body.username });
		if(existingUser){
			return res.status(400).json({
				error: "Username already in use",
				message: "An account with this username is already registered"
			})
		}
		if(req.body.password.length < 8){
			return res.status(400).json({
				error: "Password too short",
				message: "Your password must be at least 8 characters"
			});
		}
		const newUser = new User ({
			username: req.body.username,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 10)
		})
		const savedUser = await newUser.save();
		return res.status(201).json({
			success: true,
			message: "Registered successfully"
		});
	}catch(error){
		return errorHandler(error, req, res);
	}
}

module.exports.loginUser = async(req, res) => {
	try{
		const foundUser = await User.findOne({ email: req.body.email });
		if(!foundUser){
			return res.status(404).json({ message: "Email not found"});
		}else{
			const passValidated = await bcrypt.compareSync(req.body.password, foundUser.password);
			if(passValidated){
				return res.status(200).json({
					success: true,
					message: `Welcome to BlogApp, ${foundUser.username}.`,
					access: auth.createAccessToken(foundUser)
				})
			}else{
        return res.status(401).json({message: "Email and password do not match"});
      }
		}
	}catch(error){
		return errorHandler(error, req, res);
	}
}

module.exports.getAllUsers = async(req, res) => {
	try{
		const users = await User.find({});
		return res.status(200).json({
			success: true,
			users: users
		});
	}catch(error){
		return errorHandler(error, req, res);
	}
}