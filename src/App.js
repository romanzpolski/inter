import React, { Component } from 'react';
import Question from './components/Question';
import {questions} from './questions.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Row, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: questions,
            index: 0,
            modal: false,
            modalText: ""
        };
    }

    acceptAnswer = (res) => {
        this.toggleModal();
        let newIndex = this.state.index === 2 ? 0 : this.state.index + 1;
        this.setState({
            modalText: res,
            index: newIndex
        });
    }

    toggleModal = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render(){
        return (
            <Container>
                <Row>
                    <Col sm={"3"}></Col>
                    <Col sm={"6"}>
                        <Question
                            q={this.state.questions[this.state.index]}
                            acceptAnswer={this.acceptAnswer}>
                        </Question>
                    </Col>
                </Row>

                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                    <ModalBody>
                        {this.state.modalText}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleModal}>Close</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        )
    }
}

export default App;
