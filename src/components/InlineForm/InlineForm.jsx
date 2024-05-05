import { useState } from "react";
import { toast } from "react-toastify";
import './InlineForm.scss';

export default function InlineForm ({ BASEURL, Categories, isOutdated, setShowQuickView }) {
  
  const selectedCategories1 = Categories.filter(category => ['Date', 'Outbound', 'Inbound', 'Overnight', 'FIRST', 'BAR', 'PURSER'].includes(category.name));
  const selectedCategories2 = Categories.filter(category => ['Early', 'Late', 'LTA', 'DO', 'Note'].includes(category.name));

  const [shifts, setShifts] = useState([{isOvernight: false, Date: '', Outbound: '', Inbound: '', Position:'', Early: false, Late: false, LTA: false, DO: false}]);

  const handleChange = (index, fieldName, value) => {
    const updatedShifts = [...shifts];
    updatedShifts[index][fieldName] = value;
    setShifts(updatedShifts);
  };

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
        Note: shift.Note
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
      <form onSubmit={handleSubmit}>
          
        <input name="Email" style={{marginBottom: '4px'}} required type="email" placeholder="Email" />

        <div className="overflow">
          <table>
            <thead>
              <tr>
                <th>SHIFT</th>
                {selectedCategories1.map(({name}) => (<th key={name}> {name} </th>))}
                <th className='FOR'>FOR:</th>
                {selectedCategories2.map(({name}) => (<th key={name} className= 'FOR'> {name} </th>))}
              </tr>
            </thead>
            {shifts.map((shift, index) => (
              <tbody key={index}>
                <tr>
                  <td>
                    <button className="add-line" type="button" onClick= {addShift} />
                    <button className="delete-line" type="button" onClick= {() => deleteShift(index)} />
                  </td>
                  {selectedCategories1.map(({id, name}) => (
                    <td>
                      <input 
                        id = {id}
                        required = { id === 3 ? false : true}
                        min = { id === 1 || id === 2 ? '9000' : null}
                        max = { id === 1 || id === 2 ? '9199' : null}
                        checked = { id === 3 ? shift.isOvernight : null }
                        name = { id >= 4 ? `Position-${index}` : name }
                        className= { id === 3 ? 'switch' : null }
                        placeholder= {
                          id === 1 ? '9xxx' :
                          id === 2 ? '9xxx' : null
                        }
                        type = {
                          name === 'Date' ? 'date' :
                          name === 'Outbound' ? 'number' :
                          name === 'Inbound' ? 'number' :
                          name === 'Overnight' ? 'checkbox' :
                          id >=  4 ? 'radio' : null
                        }
                        value = {
                          id === 0 ? shift.Date :
                          id === 1 ? shift.Outbound :
                          id === 2 ? shift.Inbound :
                          id === 3 ? null :
                          id === 4 ? 'FIRST' :
                          id === 5 ? 'BAR' :
                          id === 6 ? 'PURSER' : null
                        }
                        onChange = {
                          id === 0 ? (e) => handleChange(index, 'Date', e.target.value) :
                          id === 1 ? (e) => handleChange(index, 'Outbound', e.target.value) :
                          id === 2 ? (e) => handleChange(index, 'Inbound', e.target.value)  :
                          id === 3 ? ( ) => ovSwitch(index) :
                          id === 4 ? (e) => handleChange(index, 'Position', 'FIRST') :
                          id === 5 ? (e) => handleChange(index, 'Position', 'BAR') :
                          id === 6 ? (e) => handleChange(index, 'Position', 'PURSER') : null
                        }
                      />
                    </td>
                  ))}
                  <td className="FOR"></td>
                  {selectedCategories2.map(({id, name}) => (
                    <td className="FOR">
                      <input
                        id = {id}
                        name = {name}
                        placeholder = { id === 11 ? 'Note' : null }
                        maxLength= { id === 11 ? 50 : null }
                        type = { id < 11 ? 'checkbox' : 'text' }
                        checked = {
                          id === 7 ? shift.Early :
                          id === 8 ? shift.Late :
                          id === 9 ? shift.LTA :
                          id === 10 ? shift.DO : null
                        }
                        onChange= {
                          id === 7 ? (e) => handleChange(index, 'Early', e.target.checked) :
                          id === 8 ? (e) => handleChange(index, 'Late',  e.target.checked) :
                          id === 9 ? (e) => handleChange(index, 'LTA',   e.target.checked) :
                          id === 10 ? (e) => handleChange(index, 'DO',   e.target.checked) :
                          id === 11 ? (e) => handleChange(index, 'Note', e.target.value) : null
                        }
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            ))}
          </table>
        </div>
        
        <div style={{width: '100%', whiteSpace: 'nowrap', overflow: 'auto'}}> LTA: "Long turn-around" | D.O.: "Day off" | 9000 + 9000 = "See Note" 🤓 </div>

        <button className="submit" type="submit">Submit</button>  
      </form>
          
      <div className="buttons">
        <a className="swap-form-link" href="https://app.smartsheet.com/b/form/20d18963576e477bafcbf102df2aec3d" target="_blank" rel="noreferrer">Swap Form</a>
        <a className="roster-link" href="https://www.momentumserviceslondon.com/activite" target="_blank" rel="noreferrer">Roster</a>
        <a className="Tutorial" href="https://youtu.be/lGQ-xiyTrCk" target="_blank" rel="noreferrer">Tutorial</a>
      </div>
      
    </>
  )
};