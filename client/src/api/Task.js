import moment from 'moment'

class Task {

    constructor(id, description, important, privateTask, project, deadline, completed, user) {
        if (id) this.id = id
        this.description = description
        this.important = important
        this.privateTask = privateTask
        if (project) this.project = project
        if (deadline) this.deadline = moment(new Date(deadline))
        this.completed = completed || false
        this.user = user
    }

    static from(json) {
        const t = Object.assign(new Task(), json)
        if (t.deadline) t.deadline = moment(new Date(t.deadline))
        return t
    }

}

export default Task