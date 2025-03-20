import React from 'react'
import SideNavBar from '../../components/SideNavBar/SideNavBar'

const Employeedashboard = () => {
  return (
    
   <div className="employee-dashboard-container">
  <div className="left-column">
    <SideNavBar role={"Employer"} />
  </div>
  <div className="right-column">Right Column (Remaining Space)</div>
</div>
    
  )
}

export default Employeedashboard
