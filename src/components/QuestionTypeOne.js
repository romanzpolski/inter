import React, { Component } from 'react';
import { Alert, Col, Row, Card, CardHeader, CardText, CardBody, CardTitle, CardFooter, Button } from 'reactstrap';


class QuestionTypeOne extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userAnswer: "",
            alertVisible: false,
            alertText:"",
            alertColor: "",
            questionObject: this.props.q,
            options: this.props.q.options
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.q !== state.questionObject) {
            return {
                userAnswer: "",
                alertVisible: false,
                alertText:"",
                alertColor: "",
                questionObject: props.q,
                options: props.q.options
            };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.q !== prevProps.q) {
            this.shuffle();
        }
    }

    shuffle = () => {
        let a = this.state.options;
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        this.setState({
            options: a
        });
    }

    onSelectClick = (answer) => {
        console.log("selected", answer);
        this.setState({
            userAnswer:answer,
            alertVisible: false
        })
    }

    onAnswerBtnClick = () => {
        let qObj = this.state.questionObject;

        let correctAnswers = qObj.answers,
            failText = qObj.fail,
            successText = qObj.success,
            resultType = 1,
            str = "";

        if(!this.state.userAnswer){
            this.setState({
                alertVisible: true,
                alertText:"Please select one option.",
                alertColor: "danger"
            });
            return;
        } else if (correctAnswers.includes(this.state.userAnswer)){
            resultType = 3;
            str = successText + " " + this.state.userAnswer;
        } else {
            resultType = 1;
            str = failText + " " + this.state.userAnswer;
        }

        this.props.acceptAnswer(resultType, str);
    }

    onDismissAlert = () => {
        this.setState({ alertVisible: false });
    }

    render() {
        let data = this.state.questionObject;
        let options = this.state.options;

        return (
            <Card className={"animated fadeIn"}>
                <CardHeader>Question {data.id}</CardHeader>
                <CardBody>
                    <CardTitle>
                        <h3>{data.question}</h3>
                    </CardTitle>
                    <CardText>{data.instructions}</CardText>
                    {options.map(option =>
                        <Row key={option}>
                            <Col sm={"9"}>
                                {option}<br/><br/>
                            </Col>
                            <Col sm={"3"} className={"text-right"}>
                                <Button outline color="primary"
                                        onClick={()=> this.onSelectClick(option)}
                                        className={this.state.userAnswer === option ? "active" : "not-active"}>
                                    x
                                </Button>
                            </Col>
                        </Row>
                    )}
                    <br/>
                    <Alert color={this.state.alertColor}
                           isOpen={this.state.alertVisible}
                           toggle={this.onDismissAlert}>
                        {this.state.alertText}
                    </Alert>
                </CardBody>
                <CardFooter className={"text-right"}>
                    <Button color="primary" onClick={() => this.onAnswerBtnClick()}>
                        OK
                    </Button>
                </CardFooter>
            </Card>
        );
    }
}

export default QuestionTypeOne;
