const { User, Message } = require('../models/index').models;

// create a new User
exports.create = (object, next) => {
    // asynchronous
    return new Promise((resolve,reject) => {
        // create and save new User
        const newUser = new User(object);
        const newMessage = new Message({
            userReq: newUser._id,
            reqType: 'create'
        })
        newUser.save((err, user) => {
            // failed: return error
            if(err) { reject(err); }
            // success: return newly created user
            else { 
                newMessage.save((err, message) => {
                    if(err) reject(err);
                })
                resolve(user); 
            }
        });
    });
}


// look for an existing user in the db
exports.getOne = (query, next) => {
    return new Promise((resolve, reject) => {
        User.findOne(query, (err, user) => {
            if (err) { reject(err); }
            resolve(user);
        });
    });
}

exports.getById = (id, next) => {

    return new Promise((resolve, reject) => {
      // find by id
      User.findById({ _id: id}, (err, result) => {

          if(err) {reject(err); }
          else { resolve(result); }
      })
  })
}

exports.getMany = (query, order, next) => {
  return new Promise((resolve, reject) => {
      User.find(query, (err, user) => {
          if (err) { reject(err); }
          resolve(user);
      })
      .sort(order)
  });
} 


// edit user found from the condition {query}
// parameters:
//      user -> { attrib1:val1, ... } // basically an object, containing all attrib in user + the changed data
exports.editUser = (object) => {
    return new Promise((resolve, reject) => {
        // findone then edit
        User.findOne({ _id: object.id }, (err, user) => {
            if (err) { reject(err); }
            if (object.new_password) {
                user.password = object.new_password;
            }
            else if(object.recoveryQA) {
                user.recoveryQA = object.recoveryQA;
            }
            else {
                user.first_name = object.first_name;
                user.middle_name = object.middle_name;
                user.last_name = object.last_name;
            }
            user.save((err, user) => {
                if(err) { reject(err); }
                resolve(user);
            });
        });
    });
}

// delete a user in the db
exports.delete = (query) => {
    return new Promise((resolve, reject) => {
        // deletemany returns an object w/ number of deleted docs, if the operation is successful, and 
        User.deleteMany(query, (err, result) => {
            if(err) { reject(err); }
            else { resolve(result); }
        })
    })
}