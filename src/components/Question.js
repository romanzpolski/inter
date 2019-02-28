import React, { Component } from 'react';
import { Col, Row, Card, CardHeader, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';


class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: ""
        };
    }

    onSelectClick = (a) => {
        console.log("selected", a);
        this.setState({answer:a})
    }

    onAnswerBtnClick = () => {
        let a = this.props.q.answers;
        let success = this.props.q.success;
        let fail = this.props.q.fail;

        if(a.includes(this.state.answer)){
            console.log("yes includes");
            this.props.acceptAnswer(success);
        } else {
            console.log("not includes");
            this.props.acceptAnswer(fail);
        }
    }

    render() {
        let data = this.props.q;
        let options = data.options;
        return (
            <Card>
                <CardHeader>Question {data.id}</CardHeader>
                    <CardBody>
                        <CardTitle>
                            <h3>{data.question}</h3>
                        </CardTitle>
                        <CardText>{data.instructions}</CardText>
                        {options.map(o =>
                            <Row>
                                <Col sm={"9"}>
                                    {o}<br/><br/>
                                </Col>
                                <Col sm={"3"}>
                                    <Button color="info" onClick={()=> this.onSelectClick(o)}>Select</Button>
                                </Col>
                            </Row>
                        )}
                        <Button color="success" onClick={() => this.onAnswerBtnClick()}>Answer</Button>
                    </CardBody>
            </Card>

        );
    }
}

export default Question;
