import React, { Component } from 'react';
import QuestionTypeOne from './components/QuestionTypeOne';
import QuestionTypeMulti from './components/QuestionTypeMulti';
import {questions} from './questions.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.css';  // you need to require the css somewhere
import { Container, Col, Row, Modal, ModalHeader, ModalBody, ModalFooter, Button, Card, CardTitle, CardText } from 'reactstrap';


const types = {
    1:QuestionTypeOne,
    2:QuestionTypeMulti,
    3:QuestionTypeOne
}

const modalColors = {
    0:"secondary",
    1:"danger",
    2:"warning",
    3:"success"
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            modal: false,
            modalText: "",
            modalType: 0
        };

        this.questions = questions;
    }

    acceptAnswer = (resultType, str) => {
        let len = this.questions.length - 1;
        let newIndex = this.state.index === len ? 0 : this.state.index + 1;
        this.setState({
            modalText: str,
            index: newIndex,
            modal: true,
            modalType: resultType
        });
        console.log("new index", newIndex);
    }

    toggleModal = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render(){

        let questionObject = this.questions[this.state.index];
        let ComponentName = types[questionObject.type];
        let modalColor = modalColors[this.state.modalType];

        let fadeProps = {
            timeout: {
                enter: 0,
                exit: 150
            }
        }

        return (
            <Container>
                <br/>
                <br/>
                <Row>
                    <Col sm={"1"}></Col>
                    <Col sm={"10"}>
                        <ComponentName
                            q={questionObject}
                            acceptAnswer={this.acceptAnswer}>
                        </ComponentName>
                    </Col>
                </Row>
                <Modal backdropTransition={fadeProps} size={"lg"} isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggle}>Result</ModalHeader>
                    <ModalBody>
                        <Card body outline color={modalColor} className={"text-center"}>
                            <br/>
                            <br/>
                            <CardTitle>{this.state.modalText}</CardTitle>
                            <br/>
                            <br/>
                        </Card>
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="primary" onClick={this.toggleModal}>Next Question</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        )
    }
}

export default App;
