package com.example.demo.payload;

import com.example.demo.model.TodoItem;

import java.util.ArrayList;
import java.util.List;


public class TodoListCreatedResponse {

    private Long id;
    private String name;
    private List<TodoItem> items = new ArrayList<>();
    private UserSummary createdBy;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<TodoItem> getItems() {
        return items;
    }

    public void setItems(List<TodoItem> items) {
        this.items = items;
    }

    public UserSummary getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserSummary createdBy) {
        this.createdBy = createdBy;
    }
}
