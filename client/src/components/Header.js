import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Nav from 'react-bootstrap/Nav';
import {AuthContext} from '../auth/AuthContext'
import {NavLink} from 'react-router-dom';

const Header = (props) => {
    return (
        <AuthContext.Consumer>
            {(context) => (
                <Navbar variant="light" expand="sm" fixed="top">
                    <Navbar.Toggle aria-controls="left-sidebar" aria-expanded="false" aria-label="Toggle sidebar"
                                   onClick={props.showSidebar}/>

                    <Navbar.Brand href="/">
                        <img src="https://image.flaticon.com/icons/svg/2285/2285576.svg" width="35" height="35"
                             id="TodoIcon"
                             className="d-inline-block align-top" alt=""/>
                        ToDO Manager
                    </Navbar.Brand>

                    <Nav className="mr-auto">
                        <Nav.Link as={NavLink} to="/tasks">My Tasks</Nav.Link>
                        <Nav.Link as={NavLink} to="/public" onClick = {() => props.getPublicTasks()}> Public Tasks</Nav.Link>
                    </Nav>

                    <Form inline className="my-2 my-lg-0 mx-auto d-none d-sm-block" role="search">
                        <FormControl type="search" className="mr-sm-2" placeholder="find task..." aria-label="Search"/>
                    </Form>

                    <Nav className="ml-md-auto">
                        {context.authUser &&
                        <>
                            <Navbar.Brand>Welcome {context.authUser.name}!</Navbar.Brand>
                            <Nav.Link onClick = {() => {context.logoutUser()}}>Logout</Nav.Link>
                        </>}
                        {!context.authUser && <Nav.Link as = {NavLink} to = "/login">Login</Nav.Link>}
                        <Nav.Link href="#">
                            <img src="https://image.flaticon.com/icons/svg/1077/1077012.svg" width="30" height="30"
                                 className="d-inline-block align-top" alt=""/>
                        </Nav.Link>
                    </Nav>
                </Navbar>
            )}
        </AuthContext.Consumer>
    );
}

export default Header;
