const Message = require('../handlers/message');
const User = require('../handlers/user');
const mongoose = require('mongoose');
const utils = require("./utils");

exports.addMessage = async (req, res) => {

   if(!req.body.email){
        console.log('no email sent!')
        return res.status(400).send({message:'no email sent!', success:false});
    }


    let requestType = "edit"
    let query = {email: req.body.email}

    let user = null

    try{
      user = await User.getOne(query) //call to handler here

      //no user found given an email
        if(!user){  
            console.log(`No user found!`);
            return res.status(404).send({message: `No user found`, success:false})

        //else user is found
        }else{                
            console.log(`A user has been found!`);
        }

    }catch(err){
        console.log(`Error for searching user in the DB ${err}` );
        return res.status(500).send({message: 'Error searching for user', success:false})
    }
    
  const {_id} = user
  let message = {userReq: _id, reqType: requestType}

  //Check if message currently exists
  try {
    const existing = await Message.getOne(message);
    if (existing) {
      console.log('Message already exists')
      return res.status(404).send({ message: 'Message already exists', success:false});
    }
  }
  catch(err) {
    console.log(`Unable to add message. Error: ${err}`);
    return res.status(500).send({ message: "Error in adding message" , success:false});
  }
    //creating the message
   try{
        await Message.create(message) //call to handler here
        console.log('Successfully created a message');
        return res.status(201).send({message: 'Successfully created a message', success:true});
    }catch(err){
        console.log(`Error in creating message: ${err}` );
        return res.status(500).send({message: 'Error in creating message', success:false});
    }
}



exports.showMessages = async (req, res) => {
  //Check if token exists
  if (!req.cookies || !req.cookies.authToken) {
    res.status(401).send({ message: 'Unauthorized access.' });
  }

  // Verify token
  const token = await utils.verifyToken(req);
  if (!token.status) {
    res.status(token.code).send({ message: token.message })
  }

  

  //Get message
  try {
    const reqType = req.query.reqType
    let filter = null
    if(reqType) {
      filter = {reqType, show:true}
    }
    else {
      filter = { show:true }
    }
    const messages = await Message.getAllMessages(filter);

    //No message found given an reqType
    // if (!messages || messages.length === 0){  
    //   console.log(`No messages found found!`);
    //   return res.status(404).send({message: `No messages found`});
    // }

    return res.status(200).send({ Messages: messages });
  }
  catch(err) {
    console.log(`Unable to get messages. Error: ${err}`);
    res.status(500).send({ message: "Error in getting messages" })
  }
}

exports.editMessage = async (req, res) => {
  //require the id of the message, isResolved field 

  //CHECKING WHETHER OR NOT A USER IS AN ADMIN IS TEMPORARILY COMMENTED TO ALLOW TESTING
  if(!req.cookies || !req.cookies.authToken){
    console.log('Unauthorized access')
    return res.status(401).send({message:'Unauthorized access', status: false})
  }

  //a token is sent, validating token..
  let tokenDetails = await utils.verifyToken(req);


  if(!tokenDetails.status){
    return res.status(tokenDetails.code).send({message: tokenDetails.message, status: false})     
  }

  const user = tokenDetails.user

  if(user.role === 'user'){
    console.log('User is not an admin, cannot access editMessage')
    return res.status(401).send({message:'Unauthorized access', success: false});
  }

  let message = null;

  //Check if message currently exists
  if(!req.body.id){
    console.log('no id of the message is sent')
    return res.status(400).send({message:'no id of the message is sent', success:false})
  }


  if(req.body.isResolved === undefined){
    console.log('did not specify accept or reject message')
    return res.status(400).send({message:'did not specify accept or reject message', success:false})
  }

  try {
    message = await Message.getOne({ _id: req.body.id });

    if (!message) {
      return res.status(404).send({ message: 'Message does not exist', success: false});
    }
    if(message.reqType === 'edit'){
      if(!req.body.password){
        return res.status(400).send({message: 'No password', success: false})
      }
    }
  }
  catch(err) {
    console.log(`Unable to get message. Error: ${err}`);
    return res.status(500).send({ message: "Error in getting message", success: false});
  }

  //Edit message, make show false so that it does not appear in the FE 
  try {
    const editMessage = await Message.editMessage({ id: req.body.id, isResolved: req.body.isResolved, show: false, password: req.body.password})
    console.log(`Edited message: ${editMessage}`)
  }
  //Uncaught editing errors
  catch(err) {
      console.log(`Unable to edit message. Error: ${err}`);
      return res.status(500).send({ message: 'Error editing message' })
  }

  //if the message was resolved, do necessary actions 
  let newuser = null
  if(req.body.isResolved){
    //approving a user
    if(message.reqType === 'create'){
      try{
        newuser = await User.getOne({_id: message.userReq})
        newuser.isApproved = true;
        newuser.save( async (err) => {
          if(err){
            return res.status(500).send({message: 'Error in approving user', status: false})
          }
           console.log('Successfully approved user')
           await Message.deleteOne({_id: req.body.id}); 
           return res.status(200).send({message: 'successfully approved user', success: true})
        })

      }catch(err){
        console.log(`Error in approving user: ${err}`)
        return res.status(500).send({message: "Error in approving a user", success: false})
      }

    //setting a new password for a user
    }else if(message.reqType === 'edit'){
      try{
        await User.editUser({id: message.userReq, new_password: req.body.password})
        console.log('Successfully changed password of user to the randomly generated password')
        return res.status(200).send({message:'successfully set user password', success: true})
      }catch(err){
        console.log(`Error in setting password of the user: ${err}`)
        return res.status(500).send({message:'error setting password of the user', success: false});
      }
    }
  }else{
    //if a message was rejected by the admin, return a successfull editting of the message
    if(!req.body.isResolved && message.reqType === 'create'){
      console.log('deleting user with id ' + message.userReq)
      await User.delete({_id: message.userReq});
    }
    await Message.deleteOne({_id: req.body.id}); 
    return res.status(200).send({message: 'successfully editted message', success: true});
  }
 


}

// exports.deleteMessage = async (req, res) => {
  
// }

