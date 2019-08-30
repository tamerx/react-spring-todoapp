import React, { Component } from 'react';
import moment from 'moment';
import { createPoll,createList ,createItem,getItemById,updateItem} from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH,POLL_LIST_SIZE } from '../constants';
import './ToDoItem.css';
import { Form, Input, Button, Icon, Select, Col, notification,DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;


const { MonthPicker, RangePicker, WeekPicker } = DatePicker;


class ToDoItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: {
                text: ''
            },
            todoItems:[],
            description: {
                text: ''
            },

           deadline: moment(),
            list:[],
            listId:""
        };
        this.addChoice = this.addChoice.bind(this);
        this.removeChoice = this.removeChoice.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handleChoiceChange = this.handleChoiceChange.bind(this);
        this.handlePollDaysChange = this.handlePollDaysChange.bind(this);
        this.handlePollHoursChange = this.handlePollHoursChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleChangeDeadLine = this.handleChangeDeadLine.bind(this);
        this.loadTodoItem = this.loadTodoItem.bind(this);


    }


   loadTodoItem(itemId,listId, page = 0, size = POLL_LIST_SIZE) {
       let promise;
       console.log("oldu");

         const pollData = {
            name: this.state.name.text,
            description: this.state.description.text,
            deadline: this.state.deadline,
            listId:listId,
            itemId:itemId

        };

       promise = getItemById(pollData);
       if (!promise) {
           return;
       }

       this.setState({
           isLoading: true
       });

       promise
           .then(response => {
               this.setState({
                   todoItems: response,
                   name: response.name,
                   description:response.description,
                   deadline:response.deadline
               })


           }).catch(error => {
               this.setState({
                   isLoading: false
               })
           });




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
            description: this.state.description.text,
            deadline: this.state.deadline,
            listId:this.props.location.aboutProps.listId,
            itemId:this.props.location.aboutProps.itemId
        };

        if(this.state.isUpdate)
                {
                updateItem(pollData)
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


        createItem(pollData)
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

     handleChangeName(event) {
                 const value = event.target.value;
                        this.setState({
                            name: {
                                text: value
                            }
                        });
           }

             handleChangeDescription(event) {
             const value = event.target.value;
                                     this.setState({
                                         description: {
                                             text: value
                                         }
                                     });
           }



    handleChangeDeadLine(date) {

             this.setState({deadline: date});
           }

    handleDescChange(event) {
        const value = event.target.value;
        this.setState({
            description: {
                text: value
            }
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




  componentDidMount() {

      if (this.props.location.aboutProps) {
      if(this.props.location.aboutProps.itemId){
          this.setState({
              itemId: this.props.location.aboutProps.itemId,
              listId: this.props.location.aboutProps.listId,
              isUpdate: true
          });
          this.loadTodoItem(this.props.location.aboutProps.itemId,this.props.location.aboutProps.listId);
          }
          else{
          this.setState({
                        isUpdate: false
                    });
                    }
      }
  }

    render() {

    function onChange(date, dateString) {
      console.log(date, dateString);
    }
        const choiceViews = [];



        return (
            <div className="new-poll-container">
                {this.state.isUpdate ? (
                                              <h1 className="page-title">Edit Item</h1>
                                            ) : (
                                              <h1 className="page-title">Add Item</h1>
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
                            onChange={this.handleChangeName}
                             />
                            ) : (

                            <TextArea
                            placeholder="Enter your item Name"
                            style = {{ fontSize: '16px' }}
                            autosize={{ minRows: 3, maxRows: 6 }}
                            name = "name"
                            onChange = {this.handleChangeName} />
                            )}

                        </FormItem>

                         <FormItem validateStatus={this.state.description.validateStatus}
                            className="poll-form-row">
                           {this.state.isUpdate ? (
                             <TextArea
                            placeholder={this.state.description}
                            style = {{ fontSize: '16px' }}
                            autosize={{ minRows: 3, maxRows: 6 }}
                            name = "description"
                            onChange={this.handleChangeDescription}
                             />
                            ) : (

                            <TextArea
                            placeholder="Enter your item Description"
                            style = {{ fontSize: '16px' }}
                            autosize={{ minRows: 3, maxRows: 6 }}
                            name = "description"
                            onChange = {this.handleChangeDescription} />
                            )}
                        </FormItem>
                        <FormItem validateStatus={this.state.name.validateStatus}
                            className="poll-form-row">

                              {this.state.isUpdate ? (
                             <DatePicker
                              placeholder={this.state.deadline}
                             selected={ this.state.startDate }
                             onChange={ this.handleChangeDeadLine }
                             name="deadline"
                             dateFormat="MM/DD/YYYY"
                           />
                            ) : (

                              <DatePicker
                         selected={ this.state.startDate }
                         onChange={ this.handleChangeDeadLine }
                         name="deadline"
                         dateFormat="MM/DD/YYYY"
                       />
                            )}
                        </FormItem>

                        <FormItem className="poll-form-row">
                           {this.state.isUpdate ? (
                             <Button type="primary"
                             htmlType="submit"
                             size="large"
                             disabled={this.isFormInvalid()}
                             className="create-poll-form-button">Edit Item</Button>
                            ) : (

                            <Button type="primary"
                            htmlType="submit"
                            size="large"
                            disabled={this.isFormInvalid()}
                            className="create-poll-form-button">Add Item</Button>
                            )}
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}




export default ToDoItem;