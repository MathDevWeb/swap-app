import React, { useEffect, useState } from "react";
import './QuickViewBox.css';

export default function QuickViewBox ({ BASEURL, tableInputs }) {
   
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState(null);

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
                    <div>
                        <input id="searchBox" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className="overflow">
                        <table>
                            <thead>
                                <tr>
                                    <th>{tableInputs[0]}</th>
                                    <th>{tableInputs[1]}</th>
                                    <th>{tableInputs[2]}</th>
                                    <th>{tableInputs[3]}</th>
                                    <th>{tableInputs[4]}</th>
                                    <th className="FOR start">FOR:</th>
                                    <th className="FOR">{tableInputs[5]}</th>
                                    <th className="FOR">{tableInputs[6]}</th>
                                    <th className="FOR">{tableInputs[7]}</th>
                                    <th className="FOR">{tableInputs[8]}</th>
                                    <th className="FOR end">{tableInputs[9]}</th>
                                    <th>{tableInputs[10]}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData && formData.data && formData.data.length > 0 ? (
                                    formData.data
                                        .filter(dataItem => ( 
                                            tableInputs.some(column => 
                                                dataItem[column].toString().toLowerCase().includes(search.toLowerCase())
                                                )))
                                        .map((dataItem, index) => (
                                            <tr key={index}>
                                                <td className="Date">{dataItem.Date}</td>
                                                <td className="Outbound">{dataItem.Outbound}</td>
                                                <td className="Inbound">{dataItem.Inbound}</td>
                                                <td className="Position">{dataItem.Position}</td>
                                                <td><a className="Email" href={`mailto:${dataItem.Email}`} target="_blank" rel="noreferrer">{dataItem.Email}</a></td>
                                                <td className="FOR"></td>
                                                <td className="FOR"><input className="nohover" type="checkbox" defaultChecked={dataItem.Early} /></td>
                                                <td className="FOR"><input className="nohover" type="checkbox" defaultChecked={dataItem.Late} /></td>
                                                <td className="FOR"><input className="nohover" type="checkbox" defaultChecked={dataItem.LTA} /></td>
                                                <td className="FOR"><input className="nohover" type="checkbox" defaultChecked={dataItem.DO} /></td>
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