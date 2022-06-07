const mongoose = require("mongoose")
const utils = require('./utils')

// list of accepted degree programs
const CAS_programs = ["BSCS", "BACA", "BSAMAT", "BSMATH", "BSAPHY", "BSCHEM", "BSAGCHEM", "BSSTAT", "BSBIO", "BASOCIO", "BAPHILO"];

const OverallGradeSchema = new mongoose.Schema(
    {
        GWA: {type: Number, required: true},
        Units: {type: Number, min: 0, required: true},
        RunningSum: {type: Number, min: 0, required: true},
    }, 
    {
        toObjectt: {virtuals: true}
    }
)

// ERROR SCHEMA
const ErrorSchema = new mongoose.Schema(
    {
        overallGradeErrors: {type: Number, min: 0, required: true},
        overallGradeDiagnostics: {type: OverallGradeSchema, default: {}},
        runningSumErrors: {type: Number, min: 0, required: true},
        runningSumDiagnostics: [String],
        semDateErrors: {type: Number, min: 0, required: true},
        semDateDiagnostics: [String],
        underloadErrors: {type: Number, min: 0, required: true},
        underloadDiagnostics: [String],
        reqCourseErrors: {type: Number, min: 0, required: true},
        reqCourseDiagnostics: [String],
        reqCourseErrors: {type: Number, min: 0, required: true},
        reqCourseDiagnostics: [String],
        meetRequiredUnits: {type: Number, min: 0, required: true},
        reqUnitsDiagnostics: {type: [String], min: 0, required: true},
        spThesisErrors: {type: Number, min: 0, required: true},
        spThesisDiagnostics: {type: [String], min: 0, required: true},
        totalErrors: {type: Number, min: 0, required: true}
    },
    {
        toObjectt: {virtuals: true},
        // toJSON: {virtuals: true}
    }
)

// SUBJECT SCHEMA
const CourseSchema = new mongoose.Schema(
    {
        CourseID: {type: String, required: true},
        Grade: {type: String, required: false},
        Units: {type: String, required: false},
        Computed: {type: Number, required: true}
    },
    {
        toObjectt: {virtuals: true},
        // toJSON: {virtuals: true}
    }
)

// SEM SCHEMA
const SemSchema = new mongoose.Schema(
    { 
        date: {type: String, required: true},
        courseDetails: [CourseSchema],
        units: {type: String, required: true},
        runningSum: {type: Number, required: true}
    },
    {
        toObjectt: {virtuals: true},
        // toJSON: {virtuals: true}
    }
)

// STUDENT SCHEMA
const StudentSchema = new mongoose.Schema(
	{
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        StudNo: {type: String, required: true},
        Course: {type: String, enum: CAS_programs, required: true},
        sem: [SemSchema],
        GWA: {type: Number, required: true},
        totalUnits: {type: Number, required: true},
        totalRunningSum: {type: Number, required: true},
        reqUnits: {type: Number, required: true},
        notes: {type: String, required: false},
        hasError: {type: Boolean, required: true},
        gradeErrors: {type: ErrorSchema, default: {}},
        uploadId: {type: String, required: true},
        uploaderId: {type: String, required: true},
        uploaderEmail: {type: String, required: true},
        createdAt:{type: Object},
        updatedAt: {type: Array, default: [Date]},
	},
 	{
 		toObjectt: {virtuals: true},
 		// toJSON: {virtuals: true}
 	}
)

StudentSchema.pre("save", function(next) {
    const student = this;

    student.firstName = utils.toTitleCase(student.firstName);
    student.lastName = utils.toTitleCase(student.lastName);
    student.GWA = utils.roundOffGWA(student.GWA);
    return next();
});

module.exports = mongoose.model("Student", StudentSchema);