package com.example.demo.model;

import com.example.demo.payload.TodoListRequest;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "todo_list")
public class ToDoList extends UserDateAudit {

    @Id
    @GeneratedValue
    private Long id;
    private String name;

    @OneToMany(mappedBy = "list",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    @JsonIgnore
    private List<TodoItem> items = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "OWNER_USER_ID")
    @JsonIgnore
    private User owner;


    public ToDoList() {

        super();

    }

    public ToDoList(String name, User owner) {
        this.name = name;
        this.owner = owner;
    }

    public ToDoList(Long id, String name, List<TodoItem> items, User owner) {
        this.id = id;
        this.name = name;
        this.items = items;
        this.owner = owner;
    }

    public static ToDoList from(TodoListRequest todoListRequest, User user) {
        return new ToDoList(todoListRequest.getName(), user);
    }

    public void merge(TodoListRequest request) {
        setName(request.getName());
    }

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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }
}

