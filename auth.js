const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		username: user.username,
		email: user.email,
		isAdmin: user.isAdmin
	};
	return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};

module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization;
	if(!token){
		return res.status(401).json({
			"error": "Unauthorized",
			"message": "No authentication token was provided."
		});
	}else{
		token = token.slice(7);
		jwt.verify(token, process.env.JWT_SECRET_KEY, function(error, decodedToken) {
			if(error){
				return res.status(403).json({
					error: "Forbidden",
					message: error.message
				})
			}else{
				req.user = decodedToken;
				next();
			}
		})
	} 
};

module.exports.verifyAdmin = (req, res, next) => {
	if(req.user.isAdmin) {
		next();
	}else{
		return res.status(403).send({
			error: "Forbidden",
			message: "You do not have permission to perform this action."
		})
	}
};

module.exports.errorHandler = (error, req, res, next) => {
	console.error(error);
	const statusCode = error.status || 500;
	const errorMessage = error.message || 'Internal Server Error';
	res.status(statusCode).json({
		error: {
			message: errorMessage,
			errorCode: error.code || 'SERVER_ERROR',
			details: error.details || null
		}
	});
};