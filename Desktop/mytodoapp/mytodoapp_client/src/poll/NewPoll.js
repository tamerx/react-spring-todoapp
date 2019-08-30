import React, { Component } from 'react';
import { createPoll,createList,getListsById2,updateList } from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH,POLL_LIST_SIZE } from '../constants';
import './NewPoll.css';
import { Form, Input, Button, Icon, Select, Col, notification } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input

class NewPoll extends Component {
    constructor(props) {
        super(props);
        this.state = {
        todoLists: {},
            name: {
                text: ''
            },
            items:[],
            isUpdate:false
        };
        this.addChoice = this.addChoice.bind(this);
        this.removeChoice = this.removeChoice.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleChoiceChange = this.handleChoiceChange.bind(this);
        this.handlePollDaysChange = this.handlePollDaysChange.bind(this);
        this.handlePollHoursChange = this.handlePollHoursChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.loadTodoList = this.loadTodoList.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    addChoice(event) {
        const choices = this.state.choices.slice();
        this.setState({
            choices: choices.concat([{
                text: ''
            }])
        });
    }

    removeChoice(choiceNumber) {
        const choices = this.state.choices.slice();
        this.setState({
            choices: [...choices.slice(0, choiceNumber), ...choices.slice(choiceNumber+1)]
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const pollData = {
            name: this.state.name.text,
            items:this.state.items,
            listId:this.state.listId
        };

        if(this.state.isUpdate)
        {
          updateList(pollData)
                .then(response => {
                    this.props.history.push("/");
                }).catch(error => {
                    if(error.status === 401) {
                        this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create poll.');
                    } else {
                        notification.error({
                            message: 'Polling App',
                            description: error.message || 'Sorry! Something went wrong. Please try again!'
                        });
                    }
                });
        }
        else{
        createList(pollData)
        .then(response => {
            this.props.history.push("/");
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create poll.');
            } else {
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            }
        });
        }
    }

    validateQuestion = (questionText) => {
        if(questionText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your question!'
            }
        } else if (questionText.length > POLL_QUESTION_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Question is too long (Maximum ${POLL_QUESTION_MAX_LENGTH} characters allowed)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleQuestionChange(event) {
        const value = event.target.value;
        this.setState({
            name: {
                text: value,
                ...this.validateQuestion(value)
            }
        });
    }

    validateChoice = (choiceText) => {
        if(choiceText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter a choice!'
            }
        } else if (choiceText.length > POLL_CHOICE_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Choice is too long (Maximum ${POLL_CHOICE_MAX_LENGTH} characters allowed)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleChoiceChange(event, index) {
        const choices = this.state.choices.slice();
        const value = event.target.value;

        choices[index] = {
            text: value,
            ...this.validateChoice(value)
        }

        this.setState({
            choices: choices
        });
    }

    handleChange(event) {

     const value = event.target.value;
            this.setState({
                name: {
                    text: value
                }
            });
//        this.setState({name: event.target.value});
      }


    handlePollDaysChange(value) {
        const pollLength = Object.assign(this.state.pollLength, {days: value});
        this.setState({
            pollLength: pollLength
        });
    }

    handlePollHoursChange(value) {
        const pollLength = Object.assign(this.state.pollLength, {hours: value});
        this.setState({
            pollLength: pollLength
        });
    }

    isFormInvalid() {
//        if(this.state.question.validateStatus !== 'success') {
//            return true;
//        }
//
//        for(let i = 0; i < this.state.choices.length; i++) {
//            const choice = this.state.choices[i];
//            if(choice.validateStatus !== 'success') {
//                return true;
//            }
//        }
    }

    componentDidMount() {
    if(this.props.location.aboutProps){
     this.setState({
                    listId: this.props.location.aboutProps.listId,
                    isUpdate:true
                            });
                            this.loadTodoList(this.props.location.aboutProps.listId);
    }
    else
    {
     this.setState({
                        isUpdate:false
                                });

    }

        }


        loadTodoList(listId,page = 0, size = POLL_LIST_SIZE) {
                let promise;

//                if(!this.props.currentUser) {
//                console.log("burdayim");
//                return;
//                }

                promise = getListsById2(listId,page, size);
                if(!promise) {
                    return;
                }

                this.setState({
                    isLoading: true
                });

                promise
                .then(response => {
                    this.setState({
                        todoLists: response,
                        name:response.name
                    })


                }).catch(error => {
                    this.setState({
                        isLoading: false
                    })
                });




            }

    render() {
        const choiceViews = [];

        return (
            <div className="new-poll-container">
                            {this.state.isUpdate ? (
                              <h1 className="page-title">Edit List</h1>
                            ) : (
                              <h1 className="page-title">Add List</h1>
                            )}

                <div className="new-poll-content">
                    <Form onSubmit={this.handleSubmit} className="create-poll-form">
                        <FormItem validateStatus={this.state.name.validateStatus}
                            className="poll-form-row">
                             {this.state.isUpdate ? (
                             <TextArea
                            placeholder={this.state.name}
                            style = {{ fontSize: '16px' }}
                            autosize={{ minRows: 3, maxRows: 6 }}
                            name = "name"
                            onChange={this.handleChange}
                             />
                            ) : (

                            <TextArea
                            placeholder="Enter your list Name"
                            style = {{ fontSize: '16px' }}
                            autosize={{ minRows: 3, maxRows: 6 }}
                            name = "name"
                            onChange = {this.handleQuestionChange} />
                            )}

                        </FormItem>

                        <FormItem className="poll-form-row">
                          {this.state.isUpdate ? (
                             <Button type="primary"
                             htmlType="submit"
                             size="large"
                             disabled={this.isFormInvalid()}
                             className="create-poll-form-button">Edit List</Button>
                            ) : (

                            <Button type="primary"
                            htmlType="submit"
                            size="large"
                            disabled={this.isFormInvalid()}
                            className="create-poll-form-button">Add List</Button>
                            )}

                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}




export default NewPoll;