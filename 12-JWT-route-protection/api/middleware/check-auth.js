const jwt = require('jsonwebtoken'); // need to import if we want to use JWT authentication
// below we export middleware function to check Auth | create Protection and dismiss unauthorized requests
module.exports = (req, res, next) => {
  try {
    /* First we need to get our token from the Header below | we need to set the token with 'Bearer' before whole token (some kind of convention)*/
    const token =  req.headers.authorization.split(' ')[1];// we get our token and do not need to include the Bearer with white space | we split thin string and make it as a Array to take out only token without 'Bearer' | take only second segment == token
    console.log(token);
    //below we use verify() method | jwt.verify(token, secretOrPublicKey, [options, callback])
    const decoded = jwt.verify(token, process.env.JWT_KEY); // this method do both verified and return decoded token if will succeeds
    req.userData = decoded;// add new field to request after verify user token
    next(); // this method is used to continue whole process after authorization
  } catch (error) {// we will catch an error if authentication will fail
    return res.status(401).json({
      message: 'Auth failed',
    });
  }

};
