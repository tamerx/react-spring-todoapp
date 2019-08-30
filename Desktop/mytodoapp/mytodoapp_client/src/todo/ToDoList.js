import React, { Component } from 'react';
import { getAllPolls, getUserCreatedPolls, getUserVotedPolls,getListsById ,getCurrentUser,deleteList,deleteItem,updateItemStatus} from '../util/APIUtils';
import { castVote } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon, notification , Divider, Tag,Table, Badge, Menu, Dropdown } from 'antd';
import { POLL_LIST_SIZE } from '../constants';
import { Link, withRouter,Route } from 'react-router-dom';
import './ToDoList.css';

class ToDoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todoLists: [],
            todoitems: [],
            currentUser: null,
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadTodoList = this.loadTodoList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.deleteMyList = this.deleteMyList.bind(this);
        this.deleteMyItem = this.deleteMyItem.bind(this);
        this.expandedRowRender = this.expandedRowRender.bind(this);
    }






    loadTodoList(page = 0, size = POLL_LIST_SIZE) {
        let promise;

        if(!this.props.currentUser) {
        return;
        }

        promise = getListsById(page, size);
        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
        .then(response => {
            console.log("response",response);
            const todoLists = this.state.todoLists.slice();


            this.setState({
                todoLists: todoLists.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isLoading: false
            })








        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });

    }



    expandedRowRender = (xxc) => {
    if(!this.props.currentUser) {
            return;
            }

     else{







    const columns2 = [
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Description', dataIndex: 'description', key: 'description',sorter: (a, b) => a.description.length - b.description.length },
          { title: 'DeadLine', dataIndex: 'deadline', key: 'deadline',sorter: (a, b) => a.deadline - b.deadline },
          {
            title: 'Status',
            key: 'status',
            render: (record) => (
          <span>
                {record.status ? (
                  <Badge status="success" text="Completed" />
                ) : (
                  <Badge status="error"  text="Not Completed" />
                )}
              </span>
            ),
          },
{
            title: 'Action',
            dataIndex: 'operation',
            key: 'operation',
           render: (text, record) => (
              <span className="table-operation">
                <ProfileDropdownMenu2
                  listRecord={record}
                  profileDeleteMyItem={this.deleteMyItem}
                  profileUpdateMyItem={this.updateMyItemStatus}
                              />
              </span>
            ),
          }
        ];
        console.log("this.state.todoLists",this.state.todoLists);

        let kkks=this.state.todoLists;

       const rebels = kkks.filter(k => k.id === xxc);
       console.log("rebels",rebels);
        function onChange(pagination, filters, sorter) {
          console.log('params', pagination, filters, sorter);
        }

        var k=rebels[0].items;
         for(var i=0;i<k.length;i++)
                    {
                        k[i].key=k[i].id.toString();
                    }





        return <Table   rowKey="key"  columns={columns2} onChange={onChange} dataSource={rebels[0].items} pagination={false} />;
        }
      };

    componentDidMount() {
//        this.loadCurrentUser();
        this.loadTodoList();

    }


    handleLoadMore() {
        this.loadTodoList(this.state.page + 1);
    }

     deleteMyList(listId)
        {
        if(window.confirm("Are you sure want to delete?")) {
        deleteList(listId);
        window.location.reload();
        }
        }

        deleteMyItem(itemId)
        {
        if(window.confirm("Are you sure want to delete?")) {
        deleteItem(itemId);
        window.location.reload();
        }
        }


        updateMyItemStatus(itemId,listId)
        {
        if(window.confirm("Are you sure want to delete?")) {
        updateItemStatus(itemId,listId);
        window.location.reload();
        }
        }


	deleteWebsite(id) {
		if(window.confirm("Are you sure want to delete?")) {
			fetch('http://10.2.226.115:9999/website/delete/' + id)
				.then(response => {
					if(response.status === 200) {
						alert("Website deleted successfully");
                                                fetch('http://10.2.226.115:9999/websites')
						.then(response => {
							return response.json();
						}).then(result => {
							this.setState({
								websites:result
							});
						});
					}
			 });
		}
	}




loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
    .then(response => {
      this.setState({
        currentUser: response,
        isAuthenticated: true,
        isLoading: false
      });
    }).catch(error => {
      this.setState({
        isLoading: false
      });
    });
  }




    render() {
    if(this.props.currentUser) {
        const todoListViews = [];
        this.state.todoLists.forEach((todolist, todolistIndex) => {
            todoListViews.push(<ToDoList
                key={todolist.id}
                todolist={todolist} />)
        });

           const columns2 = [
              { title: 'Name', dataIndex: 'name', key: 'name',sorter: (a, b) => a.name.length - b.name.length },
              {
                          title: 'Action',
                          dataIndex: 'operation',
                          key: 'operation',
                          render: (text, record) => (
                            <span className="table-operation">
                              <ProfileDropdownMenu
                                listRecord={record}
                                profileDeleteList={this.deleteMyList}
                                            />
                            </span>
                          ),
                        }
            ];

            var k =this.state.todoLists;
            for(var i=0;i<k.length;i++)
            {
                k[i].key=k[i].id.toString();
            }
        return (


            <div className="polls-container">
             <Link to="/poll/new">
                 <Button  type="primary"  style={{ marginBottom: 16 }}>
                                       Add New List
                                     </Button>
             </Link>
            <Table
                            bordered
                            rowKey={record => record.key}
                             className="components-table-demo-nested"
                             columns={columns2}
                             expandedRowRender={record => this.expandedRowRender(record.id)}
                             dataSource={k}
                           />

            </div>
        );
    }
    else
    {
    return null; // Eğer herhangi bir liste yok ise
    }
    }
}

function ProfileDropdownMenu(props) {
  const dropdownMenu = (
    <Menu className="profile-dropdown-menu">
            <Menu.Item><Link to={{
               pathname:`/poll/new/${props.listRecord.id}`,
               aboutProps:{
               listId:`${props.listRecord.id}`
               }}}
                >Edit List</Link></Menu.Item>
                <Menu.Item>
                           <a onClick={(event) => props.profileDeleteList(props.listRecord.id)}>
                              Delete List
                             </a>
                            </Menu.Item>

                 <Menu.Item><Link to={{
               pathname:`/item/new/${props.listRecord.id}`,
               aboutProps:{
               listId:`${props.listRecord.id}`
               }}}
                >Add Item</Link></Menu.Item>

          </Menu>
  );

  return (
    <Dropdown
      overlay={dropdownMenu}
      trigger={['click']}
      getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
      <a className="ant-dropdown-link">List Actions <Icon type="down" />
      </a>
    </Dropdown>
  );
}


function ProfileDropdownMenu2(props) {
  const dropdownMenu = (
    <Menu className="profile-dropdown-menu">
            <Menu.Item><Link to={{
               pathname:`/item/new/${props.listRecord.id}`,
               aboutProps:{
               itemId:`${props.listRecord.id}`,
               listId:`${props.listRecord.list.id}`,
               }}}
                >Edit Item</Link></Menu.Item>
                <Menu.Item>
                           <a onClick={(event) => props.profileDeleteMyItem(props.listRecord.id)}>
                              Delete Item
                             </a>
                            </Menu.Item>

                 <Menu.Item> <a onClick={(event) => props.profileUpdateMyItem(props.listRecord.id,props.listRecord.list.id)}>
                                                          Mark Item As Completed
                                                         </a></Menu.Item>

          </Menu>
  );

  return (
    <Dropdown
      overlay={dropdownMenu}
      trigger={['click']}
      getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
      <a className="ant-dropdown-link">Item Actions <Icon type="down" />
      </a>
    </Dropdown>
  );
}



export default withRouter(ToDoList);


