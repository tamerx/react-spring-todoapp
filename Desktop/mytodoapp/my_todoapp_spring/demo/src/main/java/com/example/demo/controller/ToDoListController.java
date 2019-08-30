package com.example.demo.controller;


import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.ToDoList;
import com.example.demo.model.TodoItem;
import com.example.demo.model.User;
import com.example.demo.payload.*;
import com.example.demo.repository.ToDoItemRepository;
import com.example.demo.repository.ToDoListRepositroy;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.CurrentUser;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.ToDoListService;
import com.example.demo.service.UserService;
import com.example.demo.util.AppConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/lists")
public class ToDoListController {

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private ToDoListRepositroy toDoListRepositroy;

    @Autowired
    private ToDoListRepositroy todoListRepositroy;

    @Autowired
    private ToDoItemRepository todoItemRepository;


    @Autowired
    private ToDoListService toDoListService;

    @Autowired
    private UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(ToDoListController.class);


//    @GetMapping
//    public PagedResponse<TodoListCreatedResponse> getLists(@CurrentUser UserPrincipal currentUser,
//                                                           @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
//                                                           @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
//        return toDoListService.getAllLists(currentUser, page, size);
//    }


    @GetMapping
    public PagedResponse<TodoListCreatedResponse> getListsById(@CurrentUser UserPrincipal currentUser,
                                                               @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                               @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        String aa = "Hello";
        return toDoListService.getListCreatedBy(currentUser.getUsername(), currentUser, page, size);
    }


    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createPoll(@Valid @RequestBody TodoListRequest todoListRequest, @CurrentUser UserPrincipal currentUser) {
        ToDoList poll = toDoListService.createList(todoListRequest, currentUser);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{pollId}")
                .buildAndExpand(poll.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Poll Created Successfully"));
    }

    @PutMapping("/updateList/{listId}")
    public ResponseEntity<ToDoList> updateList(@Valid @RequestBody TodoListRequest todoListRequest
            , @PathVariable(value = "listId") Long listId) {
        ToDoList toDoList = todoListRepositroy.findById(listId).orElseThrow(
                () -> new ResourceNotFoundException("Poll", "id", listId));

        toDoList.setName(todoListRequest.getName());

        final ToDoList updatedList = todoListRepositroy.save(toDoList);
        return ResponseEntity.ok(updatedList);
    }

    @PutMapping("/updateItem/{listId}/items/{itemId}")
    public ResponseEntity<TodoItem> updateItem(@Valid @RequestBody TodoItemRequest todoItemRequest
            , @PathVariable(value = "listId") Long listId, @PathVariable Long itemId) {
        ToDoList toDoList = todoListRepositroy.findById(listId).orElseThrow(
                () -> new ResourceNotFoundException("Poll", "id", listId));

        TodoItem todoItem = todoItemRepository.findById(itemId).orElseThrow(
                () -> new ResourceNotFoundException("Poll", "id", itemId));


        todoItem.setName(todoItemRequest.getName());
        todoItem.setDescription(todoItemRequest.getDescription());
        todoItem.setDeadline(todoItemRequest.getDeadline());
        todoItem.setList(toDoList);

        final TodoItem updatedItem = todoItemRepository.save(todoItem);
        return ResponseEntity.ok(updatedItem);
    }

    @PutMapping("/updateItemStatus/{listId}/items/{itemId}")
    public ResponseEntity<TodoItem> updateItemStatus(@Valid @RequestBody TodoItemRequest todoItemRequest
            , @PathVariable(value = "listId") Long listId, @PathVariable Long itemId) {
        ToDoList toDoList = todoListRepositroy.findById(listId).orElseThrow(
                () -> new ResourceNotFoundException("Poll", "id", listId));

        TodoItem todoItem = todoItemRepository.findById(itemId).orElseThrow(
                () -> new ResourceNotFoundException("Poll", "id", itemId));


        todoItem.setStatus(true);
        todoItem.setList(toDoList);

        final TodoItem updatedItem = todoItemRepository.save(todoItem);
        return ResponseEntity.ok(updatedItem);
    }


    @PostMapping("/items")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createItem(@Valid @RequestBody TodoItemRequest todoItemRequest, @CurrentUser UserPrincipal currentUser) {
        TodoItem todoItem = toDoListService.createItem(todoItemRequest, currentUser);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{pollId}")
                .buildAndExpand(todoItem.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Poll Created Successfully"));
    }


    @DeleteMapping("/deleteList/{listId}")
    public ResponseEntity<?> deleteList(@PathVariable(value = "listId") Long listId) {


        try {
            toDoListService.deleteList(listId);
            URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest().path("/{pollId}")
                    .buildAndExpand(listId).toUri();

            return ResponseEntity.created(location).body(new ApiResponse(true, "List deleted successfully"));
        } catch (Exception e) {
            return new ResponseEntity<Void>(HttpStatus.BAD_REQUEST);
        }

    }

    @DeleteMapping("/deleteItem/{itemId}")
    public ResponseEntity<?> deleteItem(@PathVariable(value = "itemId") Long itemId) {
        try {
            toDoListService.deleteItem(itemId);
            URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest().path("/{itemId}")
                    .buildAndExpand(itemId).toUri();

            return ResponseEntity.created(location).body(new ApiResponse(true, "Item deleted successfully"));
        } catch (Exception e) {
            return new ResponseEntity<Void>(HttpStatus.BAD_REQUEST);
        }

    }


    private User getOwnerFromAuthentication(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        return user;
    }


    @GetMapping("/getListById/{listId}")
    public TodoListCreatedResponse getListById(
            @PathVariable Long listId,
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return toDoListService.getListCreatedBy2(listId, page, size);
    }

    @GetMapping("/getItemById/{listId}/items/{itemId}")
    public TodoItemCreatedResponse getItemById(
            @PathVariable Long listId,
            @PathVariable Long itemId,
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {

        return toDoListService.getItemById(listId, itemId, page, size);

    }


}
