import React from 'react';
import moment from 'moment';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';

const TaskItem = (props) => {

    let {task, editTask, updateTask, deleteTask} = props;

    const toggleCheckbox = (ev, task) => {
        if (ev.target.checked) {
            task.completed = true;
            updateTask(task);
        } else {
            task.completed = false;
            updateTask(task);
        }
    }

    return (
        <ListGroup.Item id={task.id}>
            <div className="d-flex bd-highlight">
                <div className="custom-control custom-checkbox p-2 flex-grow-1 bd-highlight">
                    <input type="checkbox"
                           className={task.important ? "custom-control-input important" : "custom-control-input"}
                           id={"check-t" + task.id} defaultChecked={task.completed}
                           onChange={(ev) => toggleCheckbox(ev, task)}/>
                    <label className="custom-control-label" htmlFor={"check-t" + task.id}>{task.description}</label>
                    {task.project && <span className="badge-pill badge-light ml-4">{task.project}</span>}
                    {!task.privateTask && (
                        <img src="https://image.flaticon.com/icons/svg/638/638887.svg"
                             id="sharedIcon" width="18" height="18" alt=""/>)}
                </div>


                {task.deadline && (
                    <small
                        className={task.deadline.isBefore(moment()) ? "date expired p-2 bd-highlight align-self-end" : "date p-2 bd-highlight align-self-end"}>{task.deadline.format("dddd, MMMM Do YYYY, h:mm a")} </small>
                )}


                <div className="p-2 bd-highlight">
                    <Image width="20" height="20" id="editIcon" className="img-button"
                           src="https://image.flaticon.com/icons/svg/1159/1159633.svg" alt=""
                           onClick={() => editTask(task)}/>
                    <Image width="20" height="20" id="deleteIcon" className="img-button"
                           src="https://image.flaticon.com/icons/svg/833/833262.svg" alt=""
                           onClick={() => deleteTask(task)}/>
                </div>

            </div>
        </ListGroup.Item>
    );
}
export default TaskItem;