package com.example.demo.payload;


import com.example.demo.model.ToDoList;

public class TodoItemCreatedResponse {
    private String id;
    private String description;
    private String deadline;
    private String name;
    private String prevItemId;
    private UserSummary createdBy;
    private ToDoList list;

    public ToDoList getList() {
        return list;
    }

    public void setList(ToDoList list) {
        this.list = list;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPrevItemId() {
        return prevItemId;
    }

    public void setPrevItemId(String prevItemId) {
        this.prevItemId = prevItemId;
    }

    public void setCreatedBy(UserSummary createdBy) {
        this.createdBy = createdBy;
    }


    public UserSummary getCreatedBy() {
        return createdBy;
    }
}
