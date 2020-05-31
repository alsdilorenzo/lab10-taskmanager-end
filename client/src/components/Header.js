import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from 'react-bootstrap/Nav';
import Form from "react-bootstrap/Form";
import FormControl from 'react-bootstrap/FormControl';

const Header = (props) => {
    return (
        <Navbar variant="light" expand="sm" fixed="top">
            <Navbar.Toggle aria-controls="left-sidebar" aria-expanded="false" aria-label="Toggle sidebar" onClick={props.showSidebar}/>

            <Navbar.Brand href="index.html">
                <img src="https://image.flaticon.com/icons/svg/2285/2285576.svg" width="35" height="35" id="TodoIcon"
                     className="d-inline-block align-top" alt=""/>
                ToDO Manager
            </Navbar.Brand>

            <Form inline className="my-2 my-lg-0 mx-auto d-none d-sm-block" role="search">
                <FormControl type="search" className="mr-sm-2" placeholder="find task..." aria-label="Search" />
            </Form>

            <Nav className="ml-md-auto">
                <Nav.Link href="#">
                    <img src="https://image.flaticon.com/icons/svg/1077/1077012.svg" width="30" height="30"
                         className="d-inline-block align-top" alt=""/>
                </Nav.Link>
            </Nav>
        </Navbar>
    );
}

export default Header;
