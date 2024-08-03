import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import TaskList from '../TaskList';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import './index.css';

class Home extends Component {
  state = { taskName: "", taskStatus: "Start", taskList: [] };

  componentDidMount() {
    this.getTaskList();
  }

  getTaskList = async () => {
    const jwtToken = Cookies.get('jwt_token');
    const url = 'https://claw-backend-a336.onrender.com/todos';
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        this.setState({ taskList: data });
      } else {
        console.log("Error fetching tasks");
      }
    } catch (error) {
      console.log("Error fetching tasks", error);
    }
  };

  onChangeTask = event => {
    this.setState({ taskName: event.target.value });
  };

  onChangeStatus = event => {
    this.setState({ taskStatus: event.target.value });
  };

  onSubmitForm = async (event) => {
    event.preventDefault();
    const { taskName, taskStatus } = this.state;
    const id = uuidv4();
    const taskDetails = { id, task: taskName, isCompleted: taskStatus };
    const jwtToken = Cookies.get('jwt_token');
    const url = "https://claw-backend-a336.onrender.com/todos";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(taskDetails),
    };
    const response = await fetch(url, options);

    if (response.ok) {
      // Refresh task list after adding a new task
      this.getTaskList();
      this.setState({ taskName: "", taskStatus: "Start" });
    } else {
      console.log("Error creating task");
    }
  };

  onClickLogout = () => {
    Cookies.remove('jwt_token');
    const { history } = this.props;
    history.push("/signin");
  };

  render() {
    const { taskName, taskStatus, taskList } = this.state;
    const jwtToken = Cookies.get('jwt_token');

    if (!jwtToken) {
      return <Redirect to="/signin" />;
    }

    return (
      <div className='home-container'>
        <form className='home-form-container' onSubmit={this.onSubmitForm}>
          <div className='h-container'>
            <label className='h-label' htmlFor='task'>ENTER TASK NAME</label>
            <input
              className='h-input'
              value={taskName}
              type="text"
              placeholder='Enter Task Name'
              id="task"
              onChange={this.onChangeTask}
            />
          </div>
          <select className='h-select' value={taskStatus} onChange={this.onChangeStatus}>
            <option value="Start">Start</option>
            <option value="Inprogress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button className='add-task-button' type="submit">ADD TASK</button>
          <button className='logout-button' onClick={this.onClickLogout}>Logout</button>
        </form>
        <TaskList  taskList={taskList} getTaskList={this.getTaskList} />
      </div>
    )
  }
}

export default Home;
