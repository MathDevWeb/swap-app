import {useState} from "react";
import { ToastContainer, toast } from "react-toastify";
import InlineForm from './components/InlineForm/InlineForm';
import Calendar from './components/Calendar/Calendar';
import { format } from 'date-fns';
import './App.css';

function App() {
  const todayDate = new Date();
  const BASEURL = "http://localhost:3001";

  const [shifts, setShifts] = useState([{isOvernight: false, Date: '', Outbound: '', Inbound: '', Position:'', Early: false, Late: false, LTA: false, DO: false}]);

  const addShift = () => {
    const newShifts = [...shifts, {isOvernight: false, Date: '', Outbound: '', Inbound: '', Position:'', Early: false, Late: false, LTA: false, DO: false}];
    setShifts(newShifts)
  };

  const deleteShift = (index) => {
    const updatedShifts = [...shifts];
    updatedShifts.splice(index, 1);
    setShifts(updatedShifts);
  };

  const ovSwitch = (index) => { 
    const updatedShifts = [...shifts];
    updatedShifts[index].isOvernight = !updatedShifts[index].isOvernight;
    setShifts(updatedShifts)
  };

  const handleChange = (index, fieldName, value) => {
    const updatedShifts = [...shifts];
    updatedShifts[index][fieldName] = value;
    setShifts(updatedShifts);
  };

  const isOutdated = (day) => {
    todayDate.setHours(0, 0, 0, 0);
    return day < todayDate;
  };

  // Toggle QuickViewBox.js
  const [showQuickView, setShowQuickView] = useState(false);
  const handleQuickViewClick = () => {
    setShowQuickView(!showQuickView);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isAnyOutdated = shifts.some(shift => shift.Date && isOutdated(new Date(shift.Date)));

    if (isAnyOutdated) {
      toast.error('Oops... You can\'t submit an outdated swap 🤓');
      return;
    }

    shifts.forEach(shift => {
      const formData = {
        Email: e.target.elements.Email.value,
        Date: shift.Date,
        Outbound: shift.Outbound,
        Inbound: shift.isOvernight ? shift.Inbound + '+1d' : shift.Inbound,
        Position: shift.Position,
        Early: shift.Early,
        Late: shift.Late,
        LTA: shift.LTA,
        DO: shift.DO,
        Note: e.target.elements.Note.value
      };

      fetch(`${BASEURL}/formData`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
        })
      .then(response => {
        if (!response.ok) {
          throw new Error('Form submission failed');
        }
        return response.json()
      })
      .then(data => {
        console.log('Success', data);
        toast.success(`${shift.Outbound} - ${shift.Inbound} on ${shift.Date} submitted successfully!`);
        setShowQuickView(true)
      })
      .catch(error => {
        console.log(error);
        toast.error(`${shift.Outbound} - ${shift.Inbound} on ${shift.Date} submission failed`)
      });
    });
  };

  return (
    <>
      <div className="greetings">Hi there! Today is {format(todayDate, 'MMMM do, y O')} </div>
      <InlineForm BASEURL= {BASEURL} todayDate={todayDate} isOutdated={isOutdated} addShift={addShift} deleteShift={deleteShift} ovSwitch={ovSwitch} handleChange={handleChange} shifts={shifts} handleSubmit={handleSubmit} />
      <Calendar BASEURL= {BASEURL} todayDate={todayDate}isOutdated={isOutdated} handleSubmit={handleSubmit} showQuickView={showQuickView} handleQuickViewClick={handleQuickViewClick} />
      <ToastContainer />
    </>
  );
}

export default App;