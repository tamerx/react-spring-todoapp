package com.example.demo.repository;

import com.example.demo.model.ToDoList;
import com.example.demo.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;


public interface ToDoListRepositroy extends JpaRepository<ToDoList, Long> {
    List<ToDoList> findAllByOwner(User owner);

    ToDoList findOneByIdAndOwner(Long id, User owner);

    @Transactional
    void deleteByIdAndOwner(Long id, User owner);

    Optional<ToDoList> findById(Long pollId);

    Page<ToDoList> findByCreatedBy(Long userId, Pageable pageable);



    long countByCreatedBy(Long userId);

    List<ToDoList> findByIdIn(List<Long> pollIds);

    List<ToDoList> findByIdIn(List<Long> pollIds, Sort sort);
}
