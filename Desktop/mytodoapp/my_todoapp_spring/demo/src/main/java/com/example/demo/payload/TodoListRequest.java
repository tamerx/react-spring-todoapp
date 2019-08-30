package com.example.demo.payload;


import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class TodoListRequest {


    @NotBlank
    @Size(max = 140)
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }



}

