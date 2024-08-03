import {Component} from 'react'
import TaskList from '../TaskList'
import {v4 as uuidv4} from 'uuid'
import Cookies from 'js-cookie'
import './index.css'

class Home extends Component {

    state = {taskName:"", taskStatus:"Start"}

    onChangeTask = event => {
        this.setState({taskName:event.target.value})
    }

    onChangeStatus = (event) => {
        this.setState({ taskStatus: event.target.value });
      };

    onSubmitForm = async (event) => {
        event.preventDefault();
        const { taskName, taskStatus } = this.state;
        const id = uuidv4();
        const taskDetails = { id, task:taskName, isCompleted:taskStatus};
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
        console.log(response)
        if (response.ok) {
          // Optionally handle successful task creation (e.g., clear the form, show a message, etc.)
          this.setState({ taskName: "", taskStatus: "Start" });
        } else {
          // Optionally handle errors
          console.log("Error creating task");
        }
      };


    render() {
        const {taskName, taskStatus} = this.state
        return (
            <div className='home-container' >
                <form className='home-form-container' onSubmit={this.onSubmitForm} >
                    <div className='h-container' >
                        <label className='h-label' htmlFor='task' >ENTER TASK NAME</label>
                        <input className='h-input' value={taskName} type="text" placeholder='Enter Task Name' id="task" onChange={this.onChangeTask} />
                    </div>
                    <select className='h-select' value={taskStatus} onChange={this.onChangeStatus}>
                        <option value="Start">Start</option>
                        <option value="Inprogress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <button className='add-task-button' type="submit" >ADD TASK</button>
                </form>
                <TaskList />
            </div>
        )
    }
}

export default Home