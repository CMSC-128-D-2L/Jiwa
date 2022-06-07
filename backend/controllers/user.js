const  User = require('../handlers/user');
const mongoose = require('mongoose');
const utils = require("./utils")
const Message = require('../handlers/message')
// controllers
/**
 * Add a user
 * @param {*} req 
 * @param {*} res 
 */
exports.signUp = async (req, res) => {
    const body = req.body;
    
    // check if all required data are present
    if (!body.password || !body.first_name || !body.last_name || !body.email || !body.recoveryQA || !body.first_name.match(/\S/) || !body.last_name.match(/\S/) || !body.email.match(/\S/)) {
        res.status(400).send({ message: "Insufficient data" });
        return;
    }
    
    for (const property in body) {
        // console.log(property);
        if(property === 'recoveryQA' || property === 'middle_name') continue

        if(!property || !body[property].match(/\S/g) || body[property].length === 0) {
            res.status(400).send({ message: "Insufficient data" });
            return;
        }
    }

    // check number of recovery questions
    if(!(body.recoveryQA.length === 3)) {
        console.log("Invalid number of recovery questions");
        res.status(400).send({ message: "Invalid number of recovery questions"});
        return;
    }

    // parse questions to add to db. format: {question: answer}
    const recoveryQA = {};
    try{
        for (const qa of body.recoveryQA){
            if(!qa.question || !Number.isInteger(qa.question) || !qa.answer || qa.answer.length === 0 || !qa.answer.match(/\S/g)){
                console.log(`Missing/Invalid value in QnAs`);
                res.status(400).send({ message: "Invalid QnAs"});
                return;
            }

        recoveryQA[qa.question] = qa.answer.toLowerCase()
        }
    }
    catch(err) {
        console.log(`Error parsing QnAs. Error: ${err}`);
        res.status(400).send({ message: "Invalid QnAs"});
        return;
    }
    

    const newuser = {
        password: body.password,
        first_name: body.first_name,
        middle_name: body.middle_name,
        last_name: body.last_name,
        email: body.email,
        recoveryQA,
        role: 'user',
    };

    //  check if email exists in DB
    try {
        const existing = await User.getOne({email: newuser.email});
        if (existing) {
            if(!existing.isApproved) {
                return res.status(400).send({message: 'User already exist. Waiting for validation'})
            }
            res.status(400).send({ message: 'User already exist' });
            return;
        }
    }
    catch(err) {
        console.log(`Unable to create new user. Error: ${err}`);
        res.status(500).send({ message: "Error creating new user" });
        return;
    }

    //  create user
    try {
        const user = await User.create(newuser);
        console.log(`New User: \n ${user}`);
        res.status(201).send({ message: 'New user successfully created' });
    }
    catch(err) {
        console.log(`Unable to create new user. Error: ${err}`);
        res.status(500).send({ message: "Error creating new user" })
    }
}

/**
 * Find all users or a specific user given an id
 * @param {*} req 
 * @param {*} res 
 */
exports.findUser = async (req, res) => {

  //if no authentication cookie is received
    if (!req.cookies || !req.cookies.authToken) {
        res.status(401).send({
            message: "Unauthorized access."
        });
        return;
    }

    const token = await utils.verifyToken(req);

    if(!token.status){
        return res.status(tokenDetails.code).send({message: tokenDetails.message})
    }

  //get url parameter id
    const id = req.params.id 

    try{
        mongoose.Types.ObjectId(id)
    }catch(err){
        console.log('Invalid id')
        return res.status(400).send({message: 'Invalid id'})
    }
    let user=null

    try{
      user = await User.getOne({_id: id}) //call to handler here

      //no user found given an id
        if(!user){  
            console.log(`No user found!`);
            return res.status(404).send({message: `No user found`})

        //else user is found
        }else{                
            console.log(`A user has been found!`);
            const {_id, first_name, middle_name, last_name, email} = user
            return res.status(200).send({User: {_id, first_name, middle_name, last_name, email}})
        }

    }catch(err){
        console.log(`Error for searching user in the DB ${err}` );
        return res.status(500).send({message: 'Error searching for user'})
    }
}



exports.findUsers = async (req, res) => {
  //if no authentication cookie is received
    if (!req.cookies || !req.cookies.authToken) {
        res.status(401).send({
            message: "Unauthorized access."
        });
        return;
    }

    const token = await utils.verifyToken(req);

    if(!token.status){
        return res.status(tokenDetails.code).send({message: tokenDetails.message})
    }

  //get the valid queries
    const {first_name, last_name, sortby} = req.query

  //remove the undefined part in the query
    const filter = JSON.parse(JSON.stringify({first_name, last_name}))
    const property = JSON.parse(JSON.stringify({sortby})).sortby
    let sort = {}

  //sort by whatever field is given in ascending order, -1 for in descending order
    sort[property] = 1
    filter['isApproved'] = true


    try{
        const user = await User.getMany(filter, sort) //call to handler here

        //no user found given an id
        if(!user || user.length === 0){  
            console.log(`No user found!`);
            return res.status(404).send({message: `No user found`})

        //else user is found
        }else{                
            console.log(`A user has been found!`);

        //remove password field
        let users = user.map((u) => {
            return {
                _id: u._id,
                first_name: u.first_name,
                middle_name: u.middle_name,
                last_name: u.last_name,
                email: u.email,
                role: u.role
            }
        })
        return res.status(200).send({User: users})
    }

    }catch(err){
        console.log(`Error for searching user in the DB ${err}` );
        return res.status(500).send({message: 'Error searching for user'})
    }
}

/**
* Edit a user on the database
* @param {*} req 
* @param {*} res 
*/
exports.editUser = async (req, res) => {
    //Frontend stuff
    //Check if token exists
    if (!req.cookies || !req.cookies.authToken) {
        return res.status(401).send({ message: 'Unauthorized access.' });
    }

    // Verify token
    const token = await utils.verifyToken(req);
    if (!token.status) {
        return res.status(token.code).send({ message: token.message })
    }

    const user = {
        id: req.params.id,
        password: req.body.password,
        new_password: req.body.new_password,
        first_name: req.body.first_name,
        middle_name: req.body.middle_name,
        last_name: req.body.last_name,
        email: req.body.email,
        recoveryQA: req.body.recoveryQA
    }

    try{
        mongoose.Types.ObjectId(user.id)
    }
    catch (err) {
        console.log('Invalid id')
        return res.status(400).send({ message: 'Invalid id' })
    }

    //Checks if user exists
    let existing = null
    try {
        existing = await User.getOne({_id: user.id});
        if (!existing) {
            return res.status(404).send({ message: 'User does not exist' });
        }
    }
    catch(err) {
        console.log(err)
        console.log(`Error looking for user in DB. Error: ${err}`);
        return res.status(500).send({ message: 'Error searching for user in database' })
    }

    if(token.user.role != 'admin'){
        //Check password for authentication
        existing.comparePassword(user.password, async (err, isMatch) => {
            if (err) {
                // Scenario 1: FAIL - DB error
                console.log(`Unable to compare password. Error: ${err}`);
                return res.status(500).send({ message: "Error in comparing password" });
            }
        
            if (!isMatch) {
                // Scenario 2: FAIL - Wrong password
                console.log("Wrong password");
                return res.status(403).send({ message: 'Wrong password' });
            }
            //If editing user details
            if (!user.new_password && !user.recoveryQA) {
                //Checks if body is complete for editing user details and id is not null
                if (!user.first_name || !user.last_name || !user.email || !user.first_name.match(/\S/) || !user.last_name.match(/\S/) || !user.email.match(/\S/))
                    return res.status(400).send({ message: 'Insufficient data.' });
                if (!user.middle_name)
                    user.middle_name = "";
            }
            //Check recoveryQA
            if (user.recoveryQA) {
                const recoveryQA = {};
                try{
                    for (const qa of user.recoveryQA){
                        if(!qa.question || !Number.isInteger(qa.question) || !qa.answer || qa.answer.length === 0 || !qa.answer.match(/\S/g)) {
                            console.log(`Missing/Invalid value in QnAs`);
                            return res.status(400).send({ message: "Invalid QnAs"});
                        }
                        recoveryQA[qa.question] = qa.answer.toLowerCase();
                    }
                    user.recoveryQA = recoveryQA;
                }
                catch(err) {
                    console.log(`Error parsing QnAs. Error: ${err}`);
                    return res.status(400).send({ message: "Invalid QnAs"});
                }
            }
        });
    }
    else{
        console.log("ADMIN EDIT USER");
    }

    //Edit user
    try {
        const edituser = await User.editUser(user)
        console.log(`Edited user: ${edituser}`)
        return res.status(200).send({ message: 'User successfully edited' })
    }
    //Uncaught editing errors
    catch(err) {
        console.log(`Unable to edit user. Error: ${err}`);
        return res.status(500).send({ message: 'Error editing user' })
    }
}

/**
* Delete a user on the database
* @param {*} req 
* @param {*} res 
*/
exports.deleteUser = async (req, res) => {
    if (!req.cookies || !req.cookies.authToken) {
        res.status(401).send({
            message: "Unauthorized access."
        });
        return;
    }
    
    const token = await utils.verifyToken(req);
    //console.log(token.user.role)
    
    if(!token.status){
        return res.status(token.code).send({message: token.message});
    }
    
    //get url parameter ids 
    const ids = req.body.ids;
    let deleted = 0, failed = 0;
    let invalidId = new Array;
    let validId = new Array;

    try{
        var reqLength = ids.length;
    }
    catch{
    console.log('Invalid property');
    res.status(501).send({ message: 'Invalid property'});
    return;
    }

    try{
        for(let i = 0; i < ids.length; i++){
            try{
                mongoose.Types.ObjectId(ids[i]);
            }
            catch(err){
                console.log('Wrong format:', ids[i]);
                invalidId[failed] = ids[i];
                failed++;
                continue;
            }
        
    
            let user = null;
            try{
                user = await User.getOne({_id: ids[i]});  //call to handler here
                console.log(user);

                //check if user exists then delete
                if(token.user.role == 'admin'){
                    if(user){
                        await User.delete({_id: ids[i]});
                        console.log('Successfully deleted user with id:', ids[i]);
                        validId[deleted] = ids[i];
                        deleted++;
                    }
                    else{
                        console.log('Invalid user id:', ids[i]);
                        invalidId[failed] = ids[i];
                        failed++;
                    }
                }
                else{
                    return res.status(401).send({message: 'Unauthorized access please contact the admin'});
                }
            }catch(err){
                console.log(`Error for searching user in the DB ${err}` );
                return res.status(500).send({message: 'Error searching for user'});
            }
        }

        if(reqLength == failed){
            res.status(404).send({body: invalidId, message: "ids not found" })
            return;
        }else if(failed == 0){
            res.status(200).send({body: validId ,message: `Successfully deleted ${deleted} users`});
            return;
        }else{
            res.status(201).send({body: invalidId ,message: `Successfully deleted ${deleted} user/s but failed to delete ${failed} user/s`});
            return;
        }
        
    }catch(err){
        console.log(`Error deleting users ${err}`);
        res.status(501).send({ message: 'Error deleting users'});
        return;
    }
}

