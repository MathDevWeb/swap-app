import React, { useEffect, useState } from "react";
import './ViewBoxes.scss';

export default function QuickViewBox ({ BASEURL, categories, searchField }) {
   
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState(null);
    const selectedCategories1 = categories.filter(category => [0, 1, 2].includes(category.id));
    const selectedCategories2 = categories.filter(category => [7, 8, 9, 10].includes(category.id));

    useEffect(() => {
        setLoading(true);

        fetch(`${BASEURL}/dbData`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch QuickViewBox Data');
            }
            return response.json();
        })
        .then(data => { 
            const sortedData = data.data
            // eslint-disable-next-line
            .map(item => item.Outbound == item.Inbound ? {...item, Outbound: "See Note", Inbound: " "} : item)

            setFormData({ ...data, data: sortedData });
        })
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
    }, [BASEURL]);

    return (
        <div className="viewBox">
            {loading ? (
                <div className="loading-spinner"></div>
            ) : (
                <>
                    <div style={{marginBottom: '2px'}}>
                        <input id="searchBox" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className="overflow">
                        <table>
                            <thead>
                                <tr>
                                    {selectedCategories1.map(({id, name}) => (<th key={id}> {name} </th>))}
                                    <th>Position</th>
                                    <th>Email</th>
                                    <th className= 'FOR'>FOR:</th>
                                    {selectedCategories2.map(({id, name}) => (<th key={id} className= 'FOR'> {name} </th>))}
                                    <th className= 'FOR'>Note</th>
                                    <th>Sent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData && formData.data && formData.data.length > 0 ? (
                                    formData.data
                                        .filter(dataItem => ( 
                                            searchField.some(column => 
                                                dataItem[column].toString().toLowerCase().includes(search.toLowerCase())
                                                )))
                                        .map((dataItem, index) => (
                                            <tr key={index}>
                                                {selectedCategories1.map(({id}) => (
                                                    <td className= {
                                                            id === 0 ? 'Date' :
                                                            id === 1 ? 'Outbound' :
                                                            id === 2 ? 'Inbound' : null
                                                    }>
                                                        { 
                                                            id === 0 ? dataItem.Date :
                                                            id === 1 ? dataItem.Outbound :
                                                            id === 2 ? dataItem.Inbound : null
                                                        }
                                                    </td>
                                                ))}
                                                <td>{dataItem.Position}</td>
                                                <td><a className="Email" href={`mailto:${dataItem.Email}`} target="_blank" rel="noreferrer">{dataItem.Email}</a></td>
                                                <td className="FOR"></td>
                                                {selectedCategories2.map(({id}) => (
                                                    <td className="FOR">
                                                        <input className="nohover" type="checkbox" defaultChecked= {
                                                            id === 7 ? dataItem.Early :
                                                            id === 8 ? dataItem.Late :
                                                            id === 9 ? dataItem.LTA :
                                                            id === 10 ? dataItem.DO : null
                                                        }>
                                                        </input>
                                                    </td>
                                                ))}
                                                <td className="FOR">{dataItem.Note}</td>
                                                <td className="Sent">{dataItem.Sent}</td>
                                            </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="12">No shift yet. Add yours 🤓</td>
                                            </tr>
                                        )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};