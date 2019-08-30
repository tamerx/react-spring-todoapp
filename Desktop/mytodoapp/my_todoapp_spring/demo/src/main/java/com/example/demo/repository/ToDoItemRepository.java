package com.example.demo.repository;

import com.example.demo.model.TodoItem;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;

/**
 * @author sacidpak
 */
public interface ToDoItemRepository extends JpaRepository<TodoItem, Long> {
    TodoItem findOneByIdAndListAndOwner(Long id, TodoItem todoItem, User owner);

    @Transactional
    void deleteByIdAndListAndOwner(Long id, TodoItem todoItem, User owner);
}
