import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

const bgColor = {
  'Start': 'red',
  'Inprogress': 'yellow',
  'Completed': 'green',
  default: 'transparent'
};

const STATUS = {
  INITIAL: 'initial',
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILURE: 'failure',
};

class TaskList extends Component {
  state = {
    status: STATUS.INITIAL,
    errorMsg: ""
  };

  componentDidMount() {
    this.getTaskList();
  }

  getTaskList = async () => {
    this.setState({ status: STATUS.LOADING });

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

      if (response.ok) {
        this.setState({ status: STATUS.SUCCESS });
        this.props.getTaskList(); // Trigger parent component to refresh task list
      } else {
        this.setState({ status: STATUS.FAILURE });
      }
    } catch (error) {
      this.setState({ status: STATUS.FAILURE });
    }
  };

  onClickEditTask = (taskId) => {
    const { history } = this.props;
    history.push(`/update-task/${taskId}`);
  }

  onClickDeleteTask = async (taskId) => {
    const jwtToken = Cookies.get('jwt_token');
    const url = `https://claw-backend-a336.onrender.com/todos/${taskId}`;
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      }
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        this.props.getTaskList(); // Refresh task list
      } else {
        this.setState({ errorMsg: "Unable to delete task. Try again." });
      }
    } catch (error) {
      this.setState({ errorMsg: "Unable to delete task. Try again." });
    }
  }

  getBackgroundColor = (status) => {
    return bgColor[status] || bgColor.default;
  }

  renderContent() {
    const { taskList } = this.props;
    const { status } = this.state;

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
                <div
                  className='task-container'
                  key={task.id}
                  style={{ backgroundColor: this.getBackgroundColor(task.is_completed) }}
                >
                  <h1 className='task-heading'>{task.task}</h1>
                  <div>
                    <button className='edit-button button' onClick={() => this.onClickEditTask(task.id)}>Edit</button>
                    <button className='delete-button button' onClick={() => this.onClickDeleteTask(task.id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case STATUS.INITIAL:
      default:
        return null;
    }
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default withRouter(TaskList);
