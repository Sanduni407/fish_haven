import attendanceModel from "../models/attendanceModel.js";
import employeeSalaryModel from "../models/salaryModel.js";


const markAttendance = async (req, res) => {
  try {
    const { empId, status } = req.body;

    if (!empId || !status) {
      return res.status(400).json({ success: false, message: "empId and status are required." });
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Check if attendance already marked for today
    const alreadyMarked = await attendanceModel.findOne({ empId, date: today });

    // if (alreadyMarked) {
    //   return res.status(409).json({  
    //     success: false,
    //     message: "Attendance already marked for today."
    //   });
    // }

    // Save the attendance record
    const attendance = new attendanceModel({
      empId,
      status,
      date: today
    });

    await attendance.save();

    // ⬇ If Present, update presentDays and calculatedSalary
    if (status === "Present") {
      const employee = await employeeSalaryModel.findOne({ _id:empId });

      if (employee) {
        const newPresentDays = employee.presentDays + 1;
        const dailyPay = employee.basicPay / 30;
        const newCalculatedSalary = dailyPay * newPresentDays;

        employee.presentDays = newPresentDays;
        employee.calculatedSalary = newCalculatedSalary;

        await employee.save();
      }
    }

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully.",
      data: attendance
    });

  } catch (error) {
    console.error("Error in markAttendance:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


const getAllSalaryDetails = async(req,res) =>{

    try
    {

        const employees = await employeeSalaryModel.find();
        res.json({ success: true,  employees});

    }
    catch(error)
    {
        console.error("Error in getDetails:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
}


const updateEmployeeSalaryDetails = async (req, res) => {
    try {
      const { id, basicPay, presentDays, calculatedSalary } = req.body;
  
      if (!id) {
        return res.status(400).json({ success: false, message: "empId is required." });
      }
  
      const employee = await employeeSalaryModel.findByIdAndUpdate(
        id,
        { basicPay, presentDays, calculatedSalary },
        { new: true }
      );
  
      if (!employee) {
        return res.status(404).json({ success: false, message: "Employee not found." });
      }
  
      res.json({ success: true, message: "Employee salary details updated.", employee });
  
    } catch (error) {
      console.error("Error in updateEmployeeSalaryDetails:", error);
      res.status(500).json({ success: false, message: "Server error." });
    }
  };
  

  const getaRecordById = async(req , res)=>{
      try{
  
          const{id} = req.params;
    
          const salaryrecord = await employeeSalaryModel.findOne({_id:id});
    
          res.json({success:true, salaryrecord })
    
       }catch(err)
       {
          console.log(err);
           res.json({success:false,message:'Error'})
       }
   }



  export{markAttendance, getAllSalaryDetails,updateEmployeeSalaryDetails,getaRecordById }