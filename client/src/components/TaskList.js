import React, {useEffect} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import TaskItem from "./TaskItem";
import {Redirect} from 'react-router';
import {AuthContext} from '../auth/AuthContext';

const TaskList = (props) => {

    let {mode, tasks, editTask, updateTask, deleteTask, getPublicTasks} = props;

    useEffect(() => {
        if (mode === "public") {
            getPublicTasks();
        }
    }, []);

    return (
        <AuthContext.Consumer>
            {(context) => (
                <>
                    {context.authErr && <Redirect to="/login"/>}

                    {tasks &&
                    <ListGroup as="ul" variant="flush">
                        {tasks.map((task) => <TaskItem mode={mode} key={task.id} task={task} editTask={editTask}
                                                       updateTask={updateTask} deleteTask={deleteTask}/>)}
                    </ListGroup>}
                </>
            )}
        </AuthContext.Consumer>
    );
}

export default TaskList;