import React, { useState } from 'react';

function App() {
    const [employeeID, setEmployeeID] = useState('');
    const [tasks, setTasks] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [updatedTasks, setUpdatedTasks] = useState([]);

    // Fetch tasks by employee ID
    const fetchTasks = (e) => {
        e.preventDefault();
        fetch(`https://imf44ag3d4.execute-api.ap-south-1.amazonaws.com/S1/Test5?EmployeeID=${encodeURIComponent(employeeID)}`)
            .then(response => response.text())
            .then(data => {
                if (data.trim() !== '') {
                    const parsedData = data.split('\n').map((row) => row.split(',')); // Assuming CSV format
                    setTasks(parsedData);
                } else {
                    setTasks([]);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setTasks([]);
            });
    };

    // Handle task edits
    const handleEditTasks = () => {
        setShowPopup(true);
        setUpdatedTasks(tasks.map(task => ({
            employeeId: task[0],
            employeeName: task[1],
            taskDescription: task[2],
            startDate: task[3],
            endDate: task[4],
            rate: task[5] || '',
            remarks: task[6] || ''
        })));
    };

    // Save changes to tasks
    const saveChanges = () => {
        const tasksData = updatedTasks
            .map(task => `${task.employeeId},${task.taskDescription},${task.rate},${task.remarks}`)
            .filter(task => task);

        if (tasksData.length === 0) {
            alert('Please fill in all fields before saving.');
            return;
        }

        fetch('https://tfyct2zj8k.execute-api.ap-south-1.amazonaws.com/A1/test3', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: tasksData.join('\n')
        })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(() => {
                alert('Tasks updated successfully!');
                setShowPopup(false);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to update tasks: ' + error.message);
            });
    };

    return (
        <div>
            <header>
                <img src="https://www.bharatbiotech.com/images/bharat-biotech-logo.jpg" alt="Company Logo" className="logo" />
            </header>
            <h1 style={{ textAlign: 'center' }}>Corporate Communications - Employee Task List</h1>
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
                                        <td>{task[0]}</td>
                                        <td>{task[1]}</td>
                                        <td>{task[2]}</td>
                                        <td>{task[3]}</td>
                                        <td>{task[4]}</td>
                                        <td>{task[5] || ''}</td>
                                        <td>{task[6] || ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {tasks.length > 0 && <button onClick={handleEditTasks}>Edit Tasks</button>}
            </div>

            {/* Popup for editing tasks */}
            {showPopup && (
                <div className="popup">
                    <h3>Edit Tasks</h3>
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
                            {updatedTasks.map((task, index) => (
                                <tr key={index}>
                                    <td>{task.employeeId}</td>
                                    <td>{task.taskDescription}</td>
                                    <td>
                                        <input 
                                            type="number" 
                                            value={task.rate} 
                                            min="1" max="5" 
                                            onChange={(e) => {
                                                const newRate = e.target.value;
                                                setUpdatedTasks(prev => 
                                                    prev.map((t, i) => 
                                                        i === index ? { ...t, rate: newRate } : t
                                                    )
                                                );
                                            }} 
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="text" 
                                            value={task.remarks} 
                                            onChange={(e) => {
                                                const newRemarks = e.target.value;
                                                setUpdatedTasks(prev => 
                                                    prev.map((t, i) => 
                                                        i === index ? { ...t, remarks: newRemarks } : t
                                                    )
                                                );
                                            }} 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={saveChanges}>Save</button>
                    <button onClick={() => setShowPopup(false)}>Close</button>
                </div>
            )}
        </div>
    );
}

export default App;
