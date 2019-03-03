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

const cardColors = {
    0:"secondary",
    1:"danger",
    2:"warning",
    3:"success"
}

const modalDefault = {
    open: false,
    text: "",
    type: 0
}

const modalFadeProps = {
    timeout: {
        enter: 0,
        exit: 150
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: false,
            index: 0,
            modal: modalDefault,
            results:[]
        };

        this.questions = questions;
    }

    acceptAnswer = (aObj) => {
        let totalQuestions = this.questions.length - 1,
            index = this.state.index,
            newResults = this.state.results;

        newResults.push(aObj);

        if((index) === totalQuestions){
            this.handleResults(newResults);
        } else {
            this.setState({
                index: index + 1,
                results:newResults
            });
        }
    }

    handleResults = (res) => {
        let markUp = res.map((r, i) => this.addMarkup(r, i));
        this.setState({
            modal: {
                text: markUp,
                open: true
            },
        });
    }

    addMarkup = (res, i) => {
        let question = questions[i];
        return(
            [
                <Card key={"card"} body outline
                      color={cardColors[res.type]}
                      className={"text-center"}>
                    <CardText>Question {i+1}</CardText>
                    <CardTitle><h4>{question.question}</h4></CardTitle>
                    <CardText><b>{res.str}</b></CardText>
                </Card>,
                <br key={"break"}/>
            ]
        )
    }

    toggleModal = () => {
        this.setState({
            modal: modalDefault,
            index: 0,
            results: []
        });
    }

    render(){
        let questionObject = this.questions[this.state.index];
        let ComponentName = types[questionObject.type];
        let modal= this.state.modal;

        return (
            [
                <Container key={"container"}>
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
                </Container>,

                <Modal key={"modal"}
                       backdropTransition={modalFadeProps}
                       size={"lg"}
                       isOpen={modal.open}
                       toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggle}>Result</ModalHeader>
                    <ModalBody>
                        {modal.text}
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="primary" onClick={this.toggleModal}>Start Again</Button>
                    </ModalFooter>
                </Modal>
            ]
        )
    }
}

export default App;
