import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

class Filters extends React.Component {
    createProject = (project) => {
        return (
            <ListGroup.Item action key={project} active = {this.props.activeFilter === project} onClick = {() => {this.props.filterTasks('filter-project', project)}}>{project}</ListGroup.Item>
        );
    }

    render() {
        return (
            <>
                <ListGroup  variant="flush">
                    <ListGroup.Item action key = "#all" active = {this.props.activeFilter === "All"} id = "filter-all" onClick = {() => {this.props.filterTasks('filter-all');}}>All</ListGroup.Item>
                    <ListGroup.Item action key = "#important" active = {this.props.activeFilter === "Important"} id = "filter-important" onClick = {() => {this.props.filterTasks('filter-important');}}>Important</ListGroup.Item>
                    <ListGroup.Item action key = "#today" active = {this.props.activeFilter === "Today"} id = "filter-today" onClick = {() => {this.props.filterTasks('filter-today');}}>Today</ListGroup.Item>
                    <ListGroup.Item action key = "#week" active = {this.props.activeFilter === "Next Week"} id = "filter-week" onClick = {() => {this.props.filterTasks('filter-week');}}>Next Week</ListGroup.Item>
                    <ListGroup.Item action key = "#private" active = {this.props.activeFilter === "Private"} id = "filter-private" onClick = {() => {this.props.filterTasks('filter-private');}}>Private</ListGroup.Item>
                    <ListGroup.Item action key = "#shared" active = {this.props.activeFilter === "Shared"} id = "filter-shared" onClick = {() => {this.props.filterTasks('filter-shared');}}>Shared</ListGroup.Item>
                    <ListGroup.Item className="p-3 mt-5 list-title">Projects</ListGroup.Item>
                    {this.props.projects.map(this.createProject) }
                </ListGroup>
            </>
        );
    }
}

export default Filters;