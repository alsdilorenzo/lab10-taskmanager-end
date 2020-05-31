import React from 'react';
import './App.css';
import API from "./api/API";
import Header from "./components/Header";
import Filters from "./components/Filters";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {tasks: [], projects: [], filter: 'All', onMobile: false, modalOpen: false, editedTask: null};
    }

    getProjects(tasks) {
        return [...new Set(tasks.map((t) => {
            if (t.project) return t.project
            else return null
        }))];
    }

    componentDidMount() {
        API.getTasks().then((tasks) => this.setState({tasks: tasks, projects: this.getProjects(tasks)}));
    }

    showModal = () => {
        this.setState((state) => ({modalOpen: !state.modalOpen, editedTask: null}));
    }

    showSidebar = () => {
        this.setState((state) => ({onMobile: !state.onMobile}));
    }

    filterTasks = (filter, project) => {
        switch (filter) {
            case 'filter-important':
                API.getTasks('important').then((tasks) => this.setState({tasks: tasks, filter: 'Important'}));
                break;
            case 'filter-today':
                API.getTasks('today').then((tasks) => this.setState({tasks: tasks, filter: 'Today'}));
                break;
            case 'filter-week':
                API.getTasks('week').then((tasks) => this.setState({tasks: tasks, filter: 'Next Week'}));
                break;
            case 'filter-private':
                API.getTasks('private').then((tasks) => this.setState({tasks: tasks, filter: 'Private'}));
                break;
            case 'filter-shared':
                API.getTasks('shared').then((tasks) => this.setState({tasks: tasks, filter: 'Shared'}));
                break;
            case 'filter-project':
                API.getTasks(project).then((tasks) => this.setState({tasks: tasks, filter: project}));
                break;
            default:
                API.getTasks().then((tasks) => this.setState({tasks: tasks, filter: 'All'}));
                break;
        }
    }

    addOrEditTask = (task) => {
        if (!task.id) {
            //ADD
            API.addTask(task)
                .then(() => {
                    //get the updated list of tasks from the server
                    API.getTasks().then((tasks) => this.setState({
                        tasks: tasks,
                        filter: 'All',
                        projects: this.getProjects(tasks)
                    }));
                })
                .catch((errorObj) => {
                });
        } else {
            //UPDATE
            API.updateTask(task)
                .then(() => {
                    //get the updated list of tasks from the server
                    API.getTasks().then((tasks) => this.setState({
                        tasks: tasks,
                        filter: 'All',
                        projects: this.getProjects(tasks)
                    }));
                })
                .catch((errorObj) => {
                });
        }
    }

    editTask = (task) => {
        this.showModal();
        this.setState({editedTask: task});
    }

    deleteTask = (task) => {
        API.deleteTask(task.id)
            .then(() => {
                //get the updated list of tasks from the server
                API.getTasks().then((tasks) => this.setState({
                    tasks: tasks,
                    filter: 'All',
                    projects: this.getProjects(tasks)
                }));
            })
            .catch((errorObj) => {
            });
    }

    render() {
        return (
            <>
                <Header showSidebar={this.showSidebar}/>
                <Container fluid>
                    <Row className="vheight">
                        <Collapse in={this.state.onMobile}>
                            <Col sm={3} bg="light" id="left-sidebar" className="collapse d-sm-block below">
                                <Filters projects={this.state.projects} filterTasks={this.filterTasks}
                                         activeFilter={this.state.filter}/>
                            </Col>
                        </Collapse>
                        <Col sm={9} className="below">
                            <h1>{this.state.filter}</h1>
                            <TaskList tasks={this.state.tasks} editTask={this.editTask} updateTask={this.addOrEditTask}
                                      deleteTask={this.deleteTask}/>
                            <Button variant="dark" className="fixed-right-bottom" id="addButton"
                                    onClick={this.showModal}>+</Button>
                        </Col>

                        {this.state.modalOpen && <TaskForm modalOpen={this.state.modalOpen} showModal={this.showModal}
                                                           addOrEditTask={this.addOrEditTask}
                                                           task={this.state.editedTask}/>}
                    </Row>
                </Container>
            </>
        );
    }
}

export default App;
