import React, { Component } from 'react';
import { Alert, Col, Row, Card, CardHeader, CardText, CardBody, CardTitle, CardFooter, Button } from 'reactstrap';


class QuestionTypeMulti extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userAnswers: [],
            alertVisible: false,
            alertText:"",
            alertColor: "",
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
                alertVisible: false,
                alertText:"",
                alertColor: "",
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
            this.setState({
                alertVisible: true,
                alertText:"Too many answers selected, please select only "+this.state.maxAllowed,
                alertColor: "danger"
            });
        } else {
            newAnswers = userAnswers;
            newAnswers.push(answer);
            this.setState({
                userAnswers: newAnswers,
                userWants: false
            })
        }

        if(this.state.alertVisible){
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
            resultType = 1,
            total = this.state.userAnswers.length;

        if(total < this.state.maxAllowed && !this.state.userWants){
            this.setState({
                alertVisible: true,
                alertText:"You can select "+ this.state.maxAllowed + " options, click OK to continue, or select more.",
                alertColor: "info",
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
            this.props.acceptAnswer(resultType, failText);
        } else if(correct === this.state.maxAllowed) {
            resultType = 3;
            this.props.acceptAnswer(resultType, successText);
        } else {
            let result = Math.round(correct / this.state.maxAllowed * 100);
            resultType = 2;
            this.props.acceptAnswer(resultType, partlyText+ " Your score is: " + result +"%");
        }
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
                                        className={this.state.userAnswers.includes(option) ? "active" : ""}>
                                    x</Button>
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
                    <Button color={this.state.userWants ? "success" : "primary"} onClick={() => this.onAnswerBtnClick()}>
                        OK
                    </Button>
                </CardFooter>
            </Card>

        );
    }
}

export default QuestionTypeMulti;
