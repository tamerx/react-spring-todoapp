package com.example.demo.model;

import com.example.demo.payload.TodoItemRequest;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
@Table(name = "todo_item")
public class TodoItem extends UserDateAudit {
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

    public ToDoList getList() {
        return list;
    }

    public void setList(ToDoList list) {
        this.list = list;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    @Id
    @GeneratedValue
    private Long id;

    @Override
    public String toString() {
        return "TodoItem{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", deadline='" + deadline + '\'' +
                ", status=" + status +
                ", prevItemId='" + prevItemId + '\'' +
                ", list=" + list +
                ", owner=" + owner +
                '}';
    }


    private String name;

    private String description;

    private String deadline;

    private boolean status;

    private String prevItemId;  //between items for dependency


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "TODO_LIST_ID", nullable = false)
    private ToDoList list;

    @OneToOne
    @JoinColumn(name = "OWNER_USER_ID")
    @JsonIgnore
    private User owner;

    public TodoItem(String name, ToDoList list, User owner) {
        this.name = name;
        this.list = list;
        this.owner = owner;
    }

    public TodoItem() {

        super();

    }

    public static TodoItem from(TodoItemRequest todoItemRequest, ToDoList todoList) {
        return new TodoItem(todoItemRequest.getName(), todoList, todoList.getOwner());
    }

    public void merge(TodoItemRequest request) {
        this.name = request.getName();
        this.description = request.getDescription();
        this.deadline = request.getDeadline();
        this.status = request.isStatus();
    }
}
