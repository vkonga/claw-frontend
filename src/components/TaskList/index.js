import { Component } from 'react';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import Cookies from 'js-cookie';
import './index.css'
const bgColor = {
  'Start': 'red',
  'Inprogress': 'yellow',
  'Completed': 'green',
  default: 'transparent'
}
// Define status states
const STATUS = {
  INITIAL: 'initial',
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILURE: 'failure',
};

class TaskList extends Component {
  state = {
    taskList: [],
    status: STATUS.INITIAL,
    errorMsg:""
  };

  componentDidMount() {
    this.getTaskList();
  }

  getTaskList = async () => {
    this.setState({ status: STATUS.LOADING }); // Set status to loading

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

      if (response.ok === true) {
        this.setState({ taskList: data, status: STATUS.SUCCESS }); // Set status to success
      } else {
        this.setState({ status: STATUS.FAILURE }); // Set status to failure
      }
    } catch (error) {
      this.setState({ status: STATUS.FAILURE }); // Set status to failure
    }
  };

  onClickEditTask = async (taskId) => {
      const {history} = this.props
      history.push(`/update-task/${taskId}`);
    }

  onClickDeleteTask = async (taskId) => {
    const jwtToken = Cookies.get('jwt_token');
    const url = `https://claw-backend-a336.onrender.com/todos/${taskId}`;
    const options = {
      method:"DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      }
    };

    try {
      const response =  await fetch(url, options);
      if (response.ok === true) {
        this.setState((prevState) => ({
          taskList: prevState.taskList.filter(task => task.id !== taskId),errorMsg:""
        }));
      } else {
          this.setState({errorMsg:" Unable Delete todo Task Try again"})
      }
    } catch (error) {
          this.setState({errorMsg:" Unable Delete todo Task Try again"})
    }
  }

  getBackgroundColor = (status) => {
    console.log(status)
    return bgColor[status]
  }

  renderContent() {
    const { taskList, status } = this.state;

    switch (status) {
      case STATUS.LOADING:
        return <div>Loading...</div>;
      case STATUS.FAILURE:
        return <div>Failed to load tasks. Please try again.</div>;
      case STATUS.SUCCESS:
        return (
          <div>
            {taskList.length === 0 ? (
              <div>No tasks available.</div>
            ) : (
              taskList.map(task => (
                <div className='task-container' key={task.id}
                  style={{backgroundColor:this.getBackgroundColor(task.is_completed)}}
                >
                  <h1 className='task-heading'>{task.task}</h1>
                  <div>
                    <button className='edit-button button' onClick={() => this.onClickEditTask(task.id)} >Edit</button>
                    <button className='delete-button button' onClick={() => this.onClickDeleteTask(task.id)} >Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case STATUS.INITIAL:
      default:
        return null; // Optionally handle initial state or show a placeholder
    }
  }

  render() {
    const {taskList} = this.state
    console.log(taskList)
    return <div>{this.renderContent()}</div>;
  }
}

export default withRouter(TaskList);
