import React, { Component } from 'react';
import { Alert, Col, Row, Card, CardHeader, CardText, CardBody, CardTitle, CardFooter, Button } from 'reactstrap';

const alertDefault = {
    visible: false,
    color: "secondary",
    text: ""
}

class QuestionTypeMulti extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userAnswers: [],
            alert: alertDefault,
            maxAllowed: 3,
            userWants: false,
            questionObject: this.props.q,
            options: this.props.q.options
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.q !== state.questionObject) {
            return {
                userAnswers: [],
                alert: alertDefault,
                maxAllowed: 3,
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
        let userAnswers = this.state.userAnswers;
        let newAnswers = [];

        if(userAnswers.includes(answer)){
            newAnswers = userAnswers.filter(userAnswer => userAnswer !== answer);
            this.setState({
                userAnswers: newAnswers
            })
        } else if(userAnswers.length === (this.state.maxAllowed)) {
            let alert = {
                visible: true,
                color: "danger",
                text: "Too many answers selected, please select only "+this.state.maxAllowed
            }
            this.setState({
                alert: alert
            });
        } else {
            newAnswers = userAnswers;
            newAnswers.push(answer);
            this.setState({
                userAnswers: newAnswers,
                userWants: false
            })
        }

        if(this.state.alert.visible){
            this.onDismissAlert();
        }
        console.log("answers : ", this.state.userAnswers);
    }

    onAnswerBtnClick = () => {
        let qObj = this.state.questionObject;

        let correctAnswers = qObj.answers,
            failText = qObj.fail,
            successText = qObj.success,
            partlyText = qObj.partly,
            total = this.state.userAnswers.length,
            str = "", // result string
            type = 0; // result type : 1, 2, 3

        if(total < this.state.maxAllowed && !this.state.userWants){
            let alert = {
                visible: true,
                color: "info",
                text: "You can select "+ this.state.maxAllowed + " options, click OK to continue, or select more.",
            }
            this.setState({
                alert: alert,
                userWants: true
            });
            return;
        }

        let correct = 0;
        this.state.userAnswers.forEach(userAnswer => {
            if(correctAnswers.includes(userAnswer)){
                correct++;
            }
        })

        if(correct === 0){
            type = 1;
            str = failText;
        } else if(correct === this.state.maxAllowed) {
            type = 3;
            str = successText
        } else {
            let result = Math.round(correct / this.state.maxAllowed * 100);
            type = 2;
            str = partlyText+ " Your score is: " + result +"%";
        }

        this.props.acceptAnswer({
            type: type,
            str: str
        });
    }

    onDismissAlert = () => {
        this.setState({ alert:alertDefault });
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
                                        className={this.state.userAnswers.includes(option) ? "active" : ""}>
                                    x</Button>
                            </Col>
                        </Row>
                    )}
                    <br/>
                    <Alert color={this.state.alert.color}
                           isOpen={this.state.alert.visible}
                           toggle={this.onDismissAlert}>
                        {this.state.alert.text}
                    </Alert>
                </CardBody>
                <CardFooter className={"text-right"}>
                    <Button color={this.state.userWants ? "success" : "primary"} onClick={() => this.onAnswerBtnClick()}>
                        OK
                    </Button>
                </CardFooter>
            </Card>

        );
    }
}

export default QuestionTypeMulti;
