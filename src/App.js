import React, { useState } from 'react';
import './App.css'; // Import CSS styles (see below for CSS)

const App = () => {
    const [employeeID, setEmployeeID] = useState('');
    const [tasks, setTasks] = useState([]);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [popupData, setPopupData] = useState([]);

    const fetchTasks = async (e) => {
        e.preventDefault();
        if (!employeeID) {
            alert('Please enter an Employee ID.');
            return;
        }

        try {
            const response = await fetch(`https://imf44ag3d4.execute-api.ap-south-1.amazonaws.com/S1/Test5?EmployeeID=${encodeURIComponent(employeeID)}`);
            const data = await response.text();
            const parsedData = parseTasksData(data); // Create a function to parse the data

            setTasks(parsedData);
            setShowEditPopup(parsedData.length > 0);
        } catch (error) {
            console.error('Error fetching data:', error);
            setTasks([]);
            setShowEditPopup(false);
        }
    };

    const parseTasksData = (data) => {
        // Assuming data is in a certain format, replace this with actual parsing logic
        // For example, you might split the text into rows and then into cells
        return []; // return parsed task objects
    };

    const showEditPopupHandler = () => {
        const popupContent = tasks.map(task => ({
            ...task,
            rate: '',
            remarks: ''
        }));
        setPopupData(popupContent);
        setShowEditPopup(true);
    };

    const saveChanges = async () => {
        const tasksData = popupData.map(task => `${task.employeeID},${task.taskDescription},${task.rate},${task.remarks}`).join('\n');

        if (!tasksData) {
            alert("Please fill in all fields before saving.");
            return;
        }

        try {
            const response = await fetch('https://tfyct2zj8k.execute-api.ap-south-1.amazonaws.com/A1/test3', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: tasksData,
            });

            if (!response.ok) throw new Error('Network response was not ok');
            alert('Tasks updated successfully!');
            setShowEditPopup(false);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update tasks: ' + error.message);
        }
    };

    const closePopup = () => {
        setShowEditPopup(false);
    };

    return (
        <div className="App">
            <header>
                <img src="https://www.bharatbiotech.com/images/bharat-biotech-logo.jpg" alt="Company Logo" className="logo" />
            </header>
            <h1>Corporate Communications - Employee Task List</h1>
            <div className="container">
                <form onSubmit={fetchTasks}>
                    <label htmlFor="employeeID">Enter Employee ID:</label>
                    <input 
                        type="text" 
                        id="employeeID" 
                        value={employeeID} 
                        onChange={(e) => setEmployeeID(e.target.value)} 
                        required 
                    />
                    <button type="submit">Fetch Tasks</button>
                </form>
                <div id="cardContainer">
                    {/* Render tasks as a table */}
                    {tasks.length > 0 && (
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Employee Name</th>
                                    <th>Task Description</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Rate</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task, index) => (
                                    <tr key={index}>
                                        <td>{task.employeeID}</td>
                                        <td>{task.employeeName}</td>
                                        <td>{task.taskDescription}</td>
                                        <td>{task.startDate}</td>
                                        <td>{task.endDate}</td>
                                        <td>{task.rate}</td>
                                        <td>{task.remarks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {tasks.length > 0 && (
                    <button onClick={showEditPopupHandler}>Edit Tasks</button>
                )}
            </div>

            {/* Popup for editing tasks */}
            {showEditPopup && (
                <div className="popup">
                    <h3>Edit Tasks</h3>
                    <div className="popup-content">
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Task Description</th>
                                    <th>Rate</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {popupData.map((task, index) => (
                                    <tr key={index}>
                                        <td>{task.employeeID}</td>
                                        <td>{task.taskDescription}</td>
                                        <td>
                                            <input 
                                                type="number" 
                                                value={task.rate} 
                                                min="1" 
                                                max="5" 
                                                onChange={(e) => {
                                                    const newData = [...popupData];
                                                    newData[index].rate = e.target.value;
                                                    setPopupData(newData);
                                                }} 
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="text" 
                                                value={task.remarks} 
                                                onChange={(e) => {
                                                    const newData = [...popupData];
                                                    newData[index].remarks = e.target.value;
                                                    setPopupData(newData);
                                                }} 
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button onClick={saveChanges}>Save</button>
                    <button onClick={closePopup}>Close</button>
                </div>
            )}
            {showEditPopup && <div className="overlay" onClick={closePopup}></div>}
        </div>
    );
};

export default App;
