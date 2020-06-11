import React from 'react';
import './App.css';
import Header from './components/Header';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Filters from './components/Filters';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import LoginForm from './components/LoginForm';
import API from './api/API';
import {Link} from 'react-router-dom';
import {Switch, Redirect, Route, withRouter} from 'react-router';
import {AuthContext} from './auth/AuthContext';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {tasks: [], projects: [], filter: 'all', openMobileMenu: false, editedTask: null};
    }

    componentDidMount() {
        //check if the user is authenticated
        API.isAuthenticated().then(
            (user) => {
                this.setState({authUser: user});
            }
        ).catch((err) => {
            this.setState({authErr: err.errorObj});
            this.props.history.push("/login");
        });
    }

    handleErrors(err) {
        if (err) {
            if (err.status && err.status === 401) {
                this.setState({authErr: err.errorObj});
                this.props.history.push("/login");
            }
        }
    }

    // Add a logout method
    logout = () => {
        API.userLogout().then(() => {
            this.setState({authUser: null, authErr: null, tasks: null});
            API.getTasks().catch((errorObj) => {
                this.handleErrors(errorObj)
            });
        });
    }

    // Add a login method
    login = (username, password) => {
        API.userLogin(username, password).then(
            (user) => {
                API.getTasks()
                    .then((tasks) => {
                        this.setState({tasks: tasks, projects: this.getProjects(tasks), authUser: user, authErr: null});
                        this.props.history.push("/tasks");
                    })
                    .catch((errorObj) => {
                        this.handleErrors(errorObj);
                    });
            }
        ).catch(
            (errorObj) => {
                const err0 = errorObj.errors[0];
                this.setState({authErr: err0});
            }
        );
    }

    getProjects(tasks) {
        return [...new Set(tasks.map((t) => {
            if (t.project) return t.project
            else return null
        }))];
    }

    showSidebar = () => {
        this.setState((state) => ({openMobileMenu: !state.openMobileMenu}));
    }

    getPublicTasks = () => {
        API.getPublicTasks()
            .then((tasks) => this.setState({tasks: tasks}))
            .catch((errorObj) => {
                this.handleErrors(errorObj);
            });
    }

    filterTasks = (filter) => {
        if (filter === "all") {
            API.getTasks()
                .then((tasks) => this.setState({tasks: tasks, filter: 'all', projects: this.getProjects(tasks)}))
                .catch((errorObj) => {
                    this.handleErrors(errorObj);
                });
        } else {
            API.getTasks(filter)
                .then((tasks) => {
                    this.setState({tasks: tasks, filter: filter});
                })
                .catch((errorObj) => {
                    this.handleErrors(errorObj);
                });
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
                        filter: 'all',
                        projects: this.getProjects(tasks)
                    }));
                })
                .catch((errorObj) => {
                    this.handleErrors(errorObj);
                });
        } else {
            //UPDATE
            API.updateTask(task)
                .then(() => {
                    //get the updated list of tasks from the server
                    API.getTasks().then((tasks) => this.setState({
                        tasks: tasks,
                        filter: 'all',
                        projects: this.getProjects(tasks)
                    }));
                })
                .catch((errorObj) => {
                    this.handleErrors(errorObj);
                });
        }
    }

    editTask = (task) => {
        this.setState({editedTask: task});
    }

    deleteTask = (task) => {
        API.deleteTask(task.id)
            .then(() => {
                //get the updated list of tasks from the server
                API.getTasks().then((tasks) => this.setState({
                    tasks: tasks,
                    filter: 'all',
                    projects: this.getProjects(tasks)
                }));
            })
            .catch((errorObj) => {
                this.handleErrors(errorObj);
            });
    }

    render() {
        const value = {
            authUser: this.state.authUser,
            authErr: this.state.authErr,
            loginUser: this.login,
            logoutUser: this.logout
        }

        return (
            <AuthContext.Provider value={value}>

                <Header showSidebar={this.showSidebar} getPublicTasks={this.getPublicTasks}/>

                <Container fluid>

                    <Switch>
                        <Route path="/login">
                            <Row className="vheight">
                                <Col sm={4}/>
                                <Col sm={4} className="below">
                                    <LoginForm/>
                                </Col>
                            </Row>
                        </Route>

                        <Route path="/public">
                            <Row className="vheight">
                                <Col sm={12} className="below">
                                    <h5><strong>Public Tasks</strong></h5>
                                    <TaskList tasks={this.state.tasks} mode="public"
                                              getPublicTasks={this.getPublicTasks}/>
                                </Col>
                            </Row>
                        </Route>

                        <Route path="/tasks">
                            <Row className="vheight">
                                <Switch>
                                    <Route path="/tasks/:filter" render={({match}) => {
                                        return <Collapse in={this.state.openMobileMenu}>
                                            <Col sm={3} bg="light" id="left-sidebar"
                                                 className="collapse d-sm-block below">
                                                <Filters projects={this.state.projects} onFilter={this.filterTasks}
                                                         activeFilter={match.params.filter}/>
                                            </Col>
                                        </Collapse>;
                                    }}/>
                                    <Route render={({match}) => {
                                        return <Collapse in={this.state.openMobileMenu}>
                                            <Col sm={3} bg="light" id="left-sidebar"
                                                 className="collapse d-sm-block below">
                                                <Filters projects={this.state.projects} onFilter={this.filterTasks}
                                                         activeFilter="all"/>
                                            </Col>
                                        </Collapse>;
                                    }}/>

                                </Switch>

                                <Col sm={9} className="below">
                                    <h5><strong>Filter: </strong>{this.state.filter}</h5>
                                    <TaskList mode="private" tasks={this.state.tasks} editTask={this.editTask}
                                              updateTask={this.addOrEditTask} deleteTask={this.deleteTask}/>
                                    <Link to="/add"><Button variant="dark" id="addButton"
                                                            className="fixed-right-bottom">+</Button></Link>
                                </Col>
                            </Row>
                        </Route>

                        <Route path="/add">
                            <Row className="vheight">
                                <Col sm={4}/>
                                <Col sm={4} className="below">
                                    <TaskForm addOrEditTask={this.addOrEditTask}/>
                                </Col>
                            </Row>
                        </Route>

                        <Route path='/task/:id' render={(props) => {
                            let taskToUpdate = this.state.tasks.find((t) => (t.id == props.match.params.id));
                            return (<Row className="vheight">
                                <Col sm={4}/>
                                <Col sm={4} className="below">
                                    <TaskForm addOrEditTask={this.addOrEditTask} task={taskToUpdate}/>
                                </Col>
                            </Row>);
                        }}/>

                        <Route>
                            <Redirect to='/tasks'/>
                        </Route>

                    </Switch>


                </Container>
            </AuthContext.Provider>
        );
    }
}

export default withRouter(App);
