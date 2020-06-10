import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import {NavLink} from 'react-router-dom';

class Filters extends React.Component {

    componentDidMount() {
        this.props.onFilter(this.props.activeFilter);
    }

    createProject = (project) => {
        return (
            <NavLink key={`#${project}`} to={`/tasks/${project}`}>
                <ListGroup.Item action active={this.props.activeFilter === project} onClick={() =>
                    this.props.onFilter(project)
                }>{project}</ListGroup.Item>
            </NavLink>
        );
    }

    render() {
        return (
            <>
                <ListGroup  variant="flush">
                    <NavLink key = "#all" to = "/tasks"><ListGroup.Item action active = {this.props.activeFilter === "all"} id = "filter-all" onClick = {() => this.props.onFilter("all")}>All</ListGroup.Item></NavLink>
                    <NavLink key = "#important" to = "/tasks/important"><ListGroup.Item action active = {this.props.activeFilter === "important"} id = "filter-important" onClick = {() => this.props.onFilter("important")}>Important</ListGroup.Item></NavLink>
                    <NavLink key = "#today" to = "/tasks/today"><ListGroup.Item action active = {this.props.activeFilter === "today"} id = "filter-today" onClick = {() => this.props.onFilter("today")}>Today</ListGroup.Item></NavLink>
                    <NavLink key = "#week" to = "/tasks/week"><ListGroup.Item action active = {this.props.activeFilter === "week"} id = "filter-week" onClick = {() => this.props.onFilter("week")}>Next 7 Days</ListGroup.Item></NavLink>
                    <NavLink key = "#private" to = "/tasks/private"><ListGroup.Item action active = {this.props.activeFilter === "private"} id = "filter-private" onClick = {() => this.props.onFilter("private")}>Private</ListGroup.Item></NavLink>
                    <NavLink key = "#shared" to = "/tasks/shared"><ListGroup.Item action active = {this.props.activeFilter === "shared"} id = "filter-shared" onClick = {() => this.props.onFilter("shared")}>Shared</ListGroup.Item></NavLink>
                    <ListGroup.Item className="p-3 mt-5 list-title">Projects</ListGroup.Item>
                    {this.props.projects.map(this.createProject) }
                </ListGroup>
            </>
        );
    }
}

export default Filters;