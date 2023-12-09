import React, { useState, useEffect } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import DayBox from '../DayBox/DayBox';
import './Calendar.css';

const Calendar = () => {
  // Display Months & Days 
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = startOfMonth(currentDate);
  const months = [currentMonth];
  for (let i = 1; i < 2; i++) {months.push(startOfMonth(addMonths(currentMonth, i)))};

  // Toggle Daybox.js
  const [selectedDay, setSelectedDay] = useState(null);
  const toggleSelectedDay = (day) => { 
    setSelectedDay(prevSelectedDay => (prevSelectedDay && prevSelectedDay.getTime() === day.getTime() ? null : day))
  };

  //Fetch Days with Data
  const [daysWithData, setDaysWithData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/daysWithData')
      .then(response => response.json())
      .then(data => setDaysWithData(data.daysWithData))
      .catch(error => console.error('Error fetching days with data:', error));
  })
  
  // Update Date every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
    <div className="calendar">
      { months.map( month => (
        <div key={month} className="calendar-month">
          <h3>{ format( month, 'MMMM yyyy') }</h3>
          <div className="calendar">
            {eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) }).map(day => (
              <div 
                key={day} 
                title='Click here to see what colleagues are willing to swap on this day 🤓' 
                className={`calendar-day
                  ${selectedDay && format(day, 'MMMM dd yyyy') === format(selectedDay, 'MMMM dd yyyy') ? 'calendar-day-selected' : ''}`} 
                onClick={() => toggleSelectedDay(day)}
              >
                {format(day, 'd')}
                <div className={`${daysWithData.includes(format(day, 'dd/MM/yyyy')) === true ? 'dot' : ''}`}></div>
              </div>
            ))}
          </div>
          {selectedDay && format(month, 'MMMM yyyy') === format(selectedDay, 'MMMM yyyy') && (
            <DayBox selectedDay={selectedDay} />
          )}
        </div>
      ))}
    </div>
    </>
  );
}

export default Calendar;