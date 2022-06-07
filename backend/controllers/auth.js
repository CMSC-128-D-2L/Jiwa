require('dotenv').config()

const User = require('../handlers/user');
const jwt = require("jsonwebtoken");
const utils = require("./utils")
const Message = require('../handlers/message')

exports.login = async (req, res) => {
  const body = req.body;

  if(!body.email || !body.password) {
    console.log('Insufficient Data')
    res.status(400).send({ message: "Insufficient data"});
    return;
  }
  
  const email = body.email.trim();
  const password = body.password;

  // check if email exists
  let user = null;
  try {
    user = await User.getOne({email: email});
    if (!user) {
      console.log('User does not exist')
      res.status(404).send({ message: 'User does not exist' });
      return;
    }
  }
  catch(err) {
    console.log(`Unable to search for user. Error: ${err}`);
    res.status(500).send({ message: "Error in searching for user in Database" });
    return;
  }

  if(!user.isApproved)
    return res.status(401).send({ message: "User is not approved." });

  user.comparePassword(password, async (err, isMatch) => {
    if (err) {
      // Scenario 2: FAIL - DB error
      console.log(`Unable to compare password. Error: ${err}`);
      return res.status(500).send({ message: "Error in comparing password" });
    }

    if (!isMatch) {
      // Scenario 2: FAIL - Wrong password
      console.log("Wrong password");
      return res.status(400).send({ message: 'Wrong password' });
    }

    // Scenario 3: SUCCESS - time to create a token
    console.log("Successfully logged in");
    const tokenPayload = {
      _id: user._id
    }

    const token = jwt.sign(tokenPayload, process.env.SECRET_ACCESS_TOKEN);

    const response = { 
      success: true, 
      token, 
    };

    // return the token to the client
    return res.status(200).cookie('authToken', token, {httpOnly: true}).send(response);
  })
}

exports.checkifloggedin = async (req, res) => {

        //no authentication cookie sent
        if(!req.cookies || !req.cookies.authToken){
            console.log('Unauthorized access')
            //return res.status(401).send({message: 'Unauthorized access' })
            return res.status(200).send({message:'Unauthorized access', status: false})
        }

        //a token is sent, validating token..
        let tokenDetails = await utils.verifyToken(req);


        if(!tokenDetails.status){
          return res.status(tokenDetails.code).send({message: tokenDetails.message, status: false})
          
        }

        //if success, send first name, last name, and email
        const user = tokenDetails.user
        let {_id, first_name, middle_name, last_name, email, role} = user

        return res.status(tokenDetails.code).send({User: {_id, first_name, middle_name, last_name, email, role}, status: true})
        
        
}

exports.verifyEmail = async (req, res) => {

  if (!req.body.email){
    console.log('No email sent!')
    return res.status(400).send({success: false, message: 'No email sent!'})
  }

  const email = req.body.email;

  let user=null
  let existing = null
  try{
      user = await User.getOne({email: email}) //call to handler here

      //no user found given an id
      if(!user){  
        console.log(`No user found!`);
        return res.status(404).send({success: false, message: `No user found`})
        //return res.send({success: false, message: 'No user found'})

        //else user is found
      }else{                
        console.log(`A user has been found!`);
        const {_id} = user

        existing = await Message.getOne({userReq: _id, reqType: 'edit'})
        if(existing){
          if(!existing.show) {
            let password = existing.password
            await Message.deleteOne({userReq: _id, reqType: 'edit', show: false});
            return res.status(200).send({message: 'Admin changed user password', success: true, password})
          }else{
            return res.status(200).send({message:'Waiting for admin approval'})
          }
          
        }else{
          return res.status(200).send({success: true, _id})
        }
        
      }
  }catch(err){
   
    console.log(`Error for searching user in the DB ${err}` );
    return res.status(500).send({success: false, message: 'Error searching for user'})
  }

}

exports.verifyQNA = async (req, res) => {

    if(!req.body._id){
      console.log('No ID sent!')
      return res.status(400).send({success: false, message:'No ID sent!'})
    }
    const id = req.body._id
   //the validity of the id was not checked since it was received from verifyEmail function

   //if no recovery email is sent
   if(!req.body.recoveryQA){
    console.log('No recovery QA sent')
    return res.status(400).send({success: false, message: 'No recovery QA sent'})
   }
   
   //reaching the code here means a recovery QA is sent
   //checking for the length of the recoveryQA
   const QA = req.body.recoveryQA

   if(QA.length!==3){
    console.log('Insufficient details of recovery QA')
    return res.status(400).send({success:false, message:'Insufficient details of recovery QA'})
   }
   
   //reaching the code here means that the recoveryQA is complete
  let user=null
  try{
      user = await User.getOne({_id: id}) //call to handler here

      if(!user){  
        console.log(`No user found!`);
        return res.status(404).send({success: false, message: `No user found`})

        //else user is found
      }else{                
        let correctQA = true

        //checks if the answers are correct
        for(const qa of QA) {
          if(user.recoveryQA[qa.question].toLowerCase() !== qa.answer.toLowerCase()) {
            correctQA = false
            break
          }     
        }

        if(!correctQA){
          console.log('Answers for recovery question and answer do not match!')
          return res.status(400).send({success: false, message: 'Answers for recovery question and answer do not match!'})
        }

        //QA is valid, creating a token
        let tokenPayload = {_id: user._id}

        const token = jwt.sign(tokenPayload, process.env.FORGOT_PASSWORD_TOKEN)

        console.log('Answer and recovery QA match!')
        const response = {success: true, token, message:'Answer and recovery QA match!'}

        //set the token inside the cookies header of the request with an age of 2 minutes
        res.cookie('forgotPasswordToken', token, {maxAge: 600000})
    
        return res.status(200).send(response)
        
       
      }
  }catch(err){
    console.log(`Error for searching user in the DB ${err}` );
    return res.status(500).send({success: false, message: 'Error searching for user'})
  }
}

exports.changePassword = async (req, res) => {

  //check for the token inside the cookies header
   if(!req.cookies || !req.cookies.forgotPasswordToken){
    console.log('Unathorized access')
    return res.status(401).send({success: false, message:'Unauthorized access'})
  }

  //check for the new password in the body
  if(!req.body.new_password){
    console.log('New password not given')
    return res.status(400).send({success:false, message:'No new password given!'})
  }

  //verify the token
  const token = await utils.verifyForgotPasswordToken(req);

  //if the token is invalid
  if(!token.status){
        return res.status(token.code).send({success: false, message: token.message})
  }
  
    let {new_password} = req.body
    let userId = token.userId
    const newUser = {id: userId, new_password:new_password}   
  
    try {
        const edituser = await User.editUser(newUser)
        console.log(`Edited user: ${edituser}`)

        //clear the cookie
        res.clearCookie("forgotPasswordToken")
        
        console.log("Cookie Deleted!")
        res.status(200).send({success: true, message: 'User successfully edited' })
    }
    //Error in editing the user
    catch(err) {
        console.log(err)
        console.log(`Unable to edit user. Error: ${err}`);
        res.status(500).send({success: false, message: 'Error editing user' })
    }
}

exports.logout = (req, res) => {
  res.cookie('authToken', "", { maxAge: 1 }).send();
}
