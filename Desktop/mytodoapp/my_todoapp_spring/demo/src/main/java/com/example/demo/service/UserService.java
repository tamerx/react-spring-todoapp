package com.example.demo.service;

import com.example.demo.model.User;

/**
 * @author sacidpak
 */

public interface UserService {
    void save(User user);
    User findByUsername(String username);
    User findByUsernameAndPassword(String username, String password);
}
