package com.example.demo.service;


import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.ToDoList;
import com.example.demo.model.TodoItem;
import com.example.demo.model.User;
import com.example.demo.payload.*;
import com.example.demo.repository.ToDoItemRepository;
import com.example.demo.repository.ToDoListRepositroy;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.UserPrincipal;
import com.example.demo.util.AppConstants;
import com.example.demo.util.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ToDoListService {


    @Autowired
    private ToDoListRepositroy todoListRepositroy;

    @Autowired
    private ToDoItemRepository todoItemRepository;
    @Autowired
    private UserRepository userRepository;


    @Autowired
    private UserService userService;


    public PagedResponse<TodoListCreatedResponse> getAllLists(UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        // Retrieve Polls
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<ToDoList> toDoLists = todoListRepositroy.findAll(pageable);


        // Map Polls to PollResponses containing vote counts and poll creator details
        Map<Long, User> creatorMap = getPollCreatorMap(toDoLists.getContent());

        List<TodoListCreatedResponse> todoListResponse = toDoLists.map(todo -> {
            return ModelMapper.mapPollToPollResponse(todo,
                    creatorMap.get(todo.getCreatedBy())
            );
        }).getContent();

        return new PagedResponse<>(todoListResponse, toDoLists.getNumber(),
                toDoLists.getSize(), toDoLists.getTotalElements(), toDoLists.getTotalPages(), toDoLists.isLast());
    }

    public TodoListCreatedResponse getListById(Long pollId, UserPrincipal currentUser) {
        ToDoList toDoList = todoListRepositroy.findById(pollId).orElseThrow(
                () -> new ResourceNotFoundException("Poll", "id", pollId));

        // Retrieve Vote Counts of every choice belonging to the current poll


        // Retrieve poll creator details
        User creator = userRepository.findById(toDoList.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", toDoList.getCreatedBy()));

        // Retrieve vote done by logged in user


        return ModelMapper.mapPollToPollResponse(toDoList, creator);
    }


    public PagedResponse<TodoListCreatedResponse> getListCreatedBy(String username, UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Retrieve all polls created by the given username
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<ToDoList> toDoLists = todoListRepositroy.findByCreatedBy(user.getId(), pageable);

        if (toDoLists.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), toDoLists.getNumber(),
                    toDoLists.getSize(), toDoLists.getTotalElements(), toDoLists.getTotalPages(), toDoLists.isLast());
        }
        Map<Long, User> creatorMap = getPollCreatorMap(toDoLists.getContent());
        // Map Polls to PollResponses containing vote counts and poll creator details
        List<Long> kızl = toDoLists.map(ToDoList::getId).getContent();

        List<TodoListCreatedResponse> todoListResponse = toDoLists.map(todo -> {
            return ModelMapper.mapPollToPollResponse(todo,
                    creatorMap.get(todo.getCreatedBy())
            );
        }).getContent();

        return new PagedResponse<>(todoListResponse, toDoLists.getNumber(),
                toDoLists.getSize(), toDoLists.getTotalElements(), toDoLists.getTotalPages(), toDoLists.isLast());
    }

    public TodoListCreatedResponse getListCreatedBy2(Long listId, int page, int size) {


        ToDoList toDoList = todoListRepositroy.findById(listId).orElseThrow(
                () -> new ResourceNotFoundException("Poll", "id", listId));

        // Retrieve Vote Counts of every choice belonging to the current poll


        // Retrieve poll creator details
        User creator = userRepository.findById(toDoList.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", toDoList.getCreatedBy()));


        return ModelMapper.mapPollToPollResponse(toDoList, creator);

    }

    public TodoItemCreatedResponse getItemById(Long listId,Long itemId, int page, int size) {

        ToDoList toDoList = todoListRepositroy.findById(listId).orElseThrow(
                () -> new ResourceNotFoundException("Poll", "id", listId));


        TodoItem todoItem = todoItemRepository.findById(itemId).orElseThrow(
                () -> new ResourceNotFoundException("Poll", "id", itemId));

        todoItem.setList(toDoList);

        User creator = userRepository.findById(todoItem.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", todoItem.getCreatedBy()));


        return ModelMapper.mapPollToPollResponse2(todoItem, creator);

    }


    public ToDoList createList(TodoListRequest todoListRequest, UserPrincipal currentUser) {
        User user = new User();
        user.setId(currentUser.getId());
        ToDoList toDoList = new ToDoList();
        toDoList.setName(todoListRequest.getName());
        toDoList.setOwner(user);


        return todoListRepositroy.save(toDoList);
    }


    public void deleteList(Long listId) {
        todoListRepositroy.deleteById(listId);
    }

    public void deleteItem(Long itemId) {
        todoItemRepository.deleteById(itemId);
    }

    public TodoItem createItem(TodoItemRequest todoItemRequest, UserPrincipal currentUser) {
        User user = new User();
        user.setId(currentUser.getId());

        ToDoList toDoList = new ToDoList();
        toDoList.setId(todoItemRequest.getListId());

        TodoItem todoItem = new TodoItem();


        todoItem.setName(todoItemRequest.getName());
        todoItem.setOwner(user);
        todoItem.setDescription(todoItemRequest.getDescription());
        todoItem.setDeadline(todoItemRequest.getDeadline());
        todoItem.setStatus(false);
        todoItem.setList(toDoList);


        return todoItemRepository.save(todoItem);
    }


    private void validatePageNumberAndSize(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if (size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }

    Map<Long, User> getPollCreatorMap(List<ToDoList> toDoLists) {
        // Get Poll Creator details of the given list of polls
        List<Long> creatorIds = toDoLists.stream()
                .map(ToDoList::getCreatedBy)
                .distinct()
                .collect(Collectors.toList());

        List<User> creators = userRepository.findByIdIn(creatorIds);
        Map<Long, User> creatorMap = creators.stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        return creatorMap;
    }

    private User getOwnerFromAuthentication(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        return user;
    }


}
