import React, { Component } from 'react';
import Cookies from 'js-cookie';
import './index.css'
class UpdateTask extends Component {
  state = {
    taskContent: '',
    taskStatus: 'Start'
  };

    onClickInputChange = (event) => {
    this.setState({ taskContent: event.target.value });
  };

  onClickStatusChange = (event) => {
    this.setState({ taskStatus: event.target.value });
  };

  onClickSaveTask = async () => {
    const { taskContent, taskStatus } = this.state;
    const { taskId } = this.props.match.params;
    const jwtToken = Cookies.get('jwt_token');
    const url = `https://claw-backend-a336.onrender.com/todos/${taskId}`;
    const options = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: taskContent, isCompleted: taskStatus }),
    };

    try {
      const response = await fetch(url, options);
      if (response.ok === true) {
        this.props.history.push('/'); // Navigate back to the home page
      } else {
        console.error('Failed to update task');
      }
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  render() {
    const { taskContent, taskStatus } = this.state;

    return (

    <div className='update-container' >
      <div className='updatetask-container' >
        <h1 className='update-heading' >Update Task</h1>
        <input
          className='update-input'
          type="text"
          value={taskContent}
          onChange={this.onClickInputChange}
          placeholder='Update Task Name'
        />
        <select className='select' value={taskStatus} onChange={this.onClickStatusChange}>
          <option value="Start">Start</option>
          <option value="Inprogress">Inprogress</option>
          <option value="Completed">Completed</option>
        </select>
        <button className='save-button' onClick={this.onClickSaveTask}>Save</button>
      </div>
    </div>
    );
  }
}

export default UpdateTask;
