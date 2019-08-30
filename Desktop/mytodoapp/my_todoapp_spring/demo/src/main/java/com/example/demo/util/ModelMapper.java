package com.example.demo.util;

import com.example.demo.model.ToDoList;
import com.example.demo.model.TodoItem;
import com.example.demo.model.User;
import com.example.demo.payload.TodoItemCreatedResponse;
import com.example.demo.payload.TodoListCreatedResponse;
import com.example.demo.payload.UserSummary;
import com.example.demo.repository.ToDoListRepositroy;
import org.springframework.beans.factory.annotation.Autowired;

public class ModelMapper {

    @Autowired
    private ToDoListRepositroy todoListRepositroy;

    public static TodoListCreatedResponse mapPollToPollResponse(ToDoList toDoList, User creator) {
        TodoListCreatedResponse todoListCreatedResponse = new TodoListCreatedResponse();
        todoListCreatedResponse.setId(toDoList.getId());
        todoListCreatedResponse.setName(toDoList.getName());
        todoListCreatedResponse.setItems(toDoList.getItems());
        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName());
        todoListCreatedResponse.setCreatedBy(creatorSummary);
        return todoListCreatedResponse;
    }

    public static TodoItemCreatedResponse mapPollToPollResponse2(TodoItem todoItem, User creator) {
        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName());
        TodoItemCreatedResponse todoItemCreatedResponse = new TodoItemCreatedResponse();
        todoItemCreatedResponse.setId(String.valueOf(todoItem.getId()));
        todoItemCreatedResponse.setName(todoItem.getName());
        todoItemCreatedResponse.setDescription(todoItem.getDescription());
        todoItemCreatedResponse.setDeadline(todoItem.getDeadline());
        todoItemCreatedResponse.setCreatedBy(creatorSummary);
        todoItemCreatedResponse.setList(todoItem.getList());
        return todoItemCreatedResponse;
    }

}
