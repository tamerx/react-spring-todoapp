package com.example.demo.payload;

import com.example.demo.model.ToDoList;


public class TodoItemRequest {

    private String name;
    private String description;
    private String deadline;
    private boolean status;

    public Long getListId() {
        return listId;
    }

    public void setListId(Long listId) {
        this.listId = listId;
    }

    private Long listId;

    private String prevItemId;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getPrevItemId() {
        return prevItemId;
    }

    public void setPrevItemId(String prevItemId) {
        this.prevItemId = prevItemId;
    }


}



