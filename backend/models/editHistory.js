const mongoose = require("mongoose");

const EditHistorySchema = new mongoose.Schema(
    {
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, "Missing userID"]},
        studentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: [true, "Missing studentID"]},
        description: {type: String, required: [true, "Missing description"]},
        createdAt: {type: Object},
        studentFirstName: {type: String, required: [true, 'Missing student first name']},
        studentLastName: {type: String, required: [true, 'Missing student last name']},
        userEmail: {type: String, required: [true, 'Missing email of user']},
        ifDelete: {type: Boolean, required: true, default: false}
    }
);


EditHistorySchema.virtual('userFullName').get(function() {  
    return this.userFirstName + ' ' + this.userLastName;
});

EditHistorySchema.virtual('studentFullName').get(function() {  
    return this.studentFirstName + ' ' + this.studentLastName;
});

module.exports = mongoose.model("EditHistory", EditHistorySchema);