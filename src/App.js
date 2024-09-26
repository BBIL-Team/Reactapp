import React, { useState } from 'react';

const App = () => {
    const [employeeID, setEmployeeID] = useState('');
    const [tasks, setTasks] = useState([]);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [popupContent, setPopupContent] = useState([]);

    const fetchTasks = (event) => {
        event.preventDefault();

        if (!employeeID.trim()) {
            alert('Please enter an Employee ID.');
            return;
        }

        fetch(`https://imf44ag3d4.execute-api.ap-south-1.amazonaws.com/S1/Test5?EmployeeID=${encodeURIComponent(employeeID)}`)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(data, 'text/html');
                const taskRows = Array.from(htmlDoc.querySelectorAll('tr')).map(row => {
                    const cells = Array.from(row.querySelectorAll('td')).map(cell => cell.innerText);
                    return cells;
                });
                setTasks(taskRows);
                setShowEditPopup(false); // Reset edit popup
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setTasks([]); // Reset tasks
            });
    };

    const showEditPopupHandler = () => {
        setPopupContent(tasks);
        setShowEditPopup(true);
    };
const saveChanges = () => {
    const tasksData = popupContent  // Use popupContent to capture updated task data
        .map(task => `${task[0]},${task[1]},${task[2]},${task[3]},${task[4]},${task[5]},${task[6]}`)
        .filter(task => task);  // Ensure we are sending valid data

    if (tasksData.length === 0) {
        alert('Please fill in all fields before saving.');
        return;
    }

    fetch(''https://tfyct2zj8k.execute-api.ap-south-1.amazonaws.com/A1/test3', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: tasksData.join('\n')  // Send updated task data to Lambda
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(() => {
        alert('Tasks updated successfully!');
        setShowEditPopup(false);  // Close popup after saving
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update tasks: ' + error.message);
    });
};

    const closePopup = () => {
        setShowEditPopup(false);
    };

    return (
        <div>
            <header style={headerStyle}>
                <img src="https://www.bharatbiotech.com/images/bharat-biotech-logo.jpg" alt="Company Logo" style={logoStyle} />
            </header>
            <h1 style={{ textAlign: 'center' }}>Corporate Communications - Employee Task List</h1>
            <div style={containerStyle}>
                <form onSubmit={fetchTasks} style={formStyle}>
                    <label htmlFor="employeeID">Enter Employee ID:</label>
                    <input 
                        type="text" 
                        id="employeeID" 
                        value={employeeID} 
                        onChange={(e) => setEmployeeID(e.target.value)} 
                        required 
                        style={inputStyle} 
                    />
                    <button type="submit" style={buttonStyle}>Fetch Tasks</button>
                </form>
                <div id="cardContainer">
                    {tasks.length > 0 && (
                        <>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <TableHeader>Employee Id</TableHeader>
                                        <TableHeader>Employee Name</TableHeader>
                                        <TableHeader>Task Description</TableHeader>
                                        <TableHeader>Start Date</TableHeader>
                                        <TableHeader>End Date</TableHeader>
                                        <TableHeader>Rating</TableHeader>
                                        <TableHeader>Remarks</TableHeader>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task, index) => (
                                        <tr key={index}>
                                            {task.map((cell, i) => <TableCell key={i}>{cell}</TableCell>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button style={buttonStyle} onClick={showEditPopupHandler}>Edit Tasks</button>
                        </>
                    )}
                </div>

                {showEditPopup && (
                    <div style={popupStyle}>
                        <h3>Edit Tasks</h3>
                        <div id="popupContent">
                            <table style={popupTableStyle}>
                                <thead>
                                    <tr>
                                        <TableHeader>Employee Id</TableHeader>
                                        <TableHeader>Employee Name</TableHeader>
                                        <TableHeader>Task Description</TableHeader>
                                        <TableHeader>Start Date</TableHeader>
                                        <TableHeader>End Date</TableHeader>
                                        <TableHeader>Rating</TableHeader>
                                        <TableHeader>Remarks</TableHeader>
                                    </tr>
                                </thead>
                                <tbody>
                                    {popupContent.map((task, index) => (
                                        <tr key={index}>
                                            {task.map((cell, i) => (
                                                <TableCell key={i}>
                                                    {i === 5 ? (
                                                        <input type="number" min="1" max="5" defaultValue={cell} />
                                                    ) : i === 6 ? (
                                                        <input type="text" defaultValue={cell} />
                                                    ) : (
                                                        cell
                                                    )}
                                                </TableCell>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={saveChanges} style={buttonStyle}>Save</button>                       
                        <button onClick={closePopup} style={buttonStyle}>Close</button>
                    </div>
                )}
            </div>

            {showEditPopup && <div style={overlayStyle} onClick={closePopup}></div>}
        </div>
    );
};

// Styles
const headerStyle = {
    backgroundColor: '#008080',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    color: 'white'
};

const logoStyle = {
    height: '120px',
    marginRight: '20px'
};

const containerStyle = {
    maxWidth: '900px',
    margin: '20px auto',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    padding: '20px'
};

const formStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
};

const inputStyle = {
    padding: '10px',
    flex: 1,
    border: '1px solid #ccc',
    borderRadius: '4px'
};

const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
};

const tableStyle = {
    width: '100%',
    border: '1px solid black', 
    borderCollapse: 'collapse'
};

const popupStyle = {
    display: 'block',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
    maxWidth: '90%'
};

const popupTableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    border: '1px solid black' // Adding border for the popup table
};

// Style for table header and cells
const tdThStyle = {
    border: '1px solid black',
    padding: '8px',
    textAlign: 'left',
};

// TableCell Component
const TableCell = ({ children }) => (
    <td style={tdThStyle}>{children}</td>
);

// TableHeader Component
const TableHeader = ({ children }) => (
    <th style={tdThStyle}>{children}</th>
);

const overlayStyle = {
    display: 'block',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999
};

export default App;
