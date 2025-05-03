import mongoose from "mongoose";

const employeeSalarySchema = new mongoose.Schema({
  empId: {type: String,required: true },
  name: {type: String, required: true },
  basicPay: {type: Number,default: 0 },
  presentDays: { type: Number,default: 0 },
  calculatedSalary: {type: Number,default: 0 }
});

const employeeSalaryModel = mongoose.models.employeeSalary || mongoose.model("employeeSalary", employeeSalarySchema);

export default employeeSalaryModel;