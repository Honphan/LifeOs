package com.example.demo.task.service;

import com.example.demo.security.SecurityUtils;
import com.example.demo.task.TaskDto;
import com.example.demo.task.TaskService;
import com.example.demo.task.entity.Task;
import com.example.demo.task.repository.TaskRepository;
import com.example.demo.user.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository repository;
    private final SecurityUtils securityUtils;

    public TaskServiceImpl(TaskRepository repository, SecurityUtils securityUtils) {
        this.repository = repository;
        this.securityUtils = securityUtils;
    }

    public TaskDto createTask(String title) {
        User user = securityUtils.requireCurrentUser();

        Task task = new Task();
        task.setUserId(user.getId());
        task.setTitle(title);

        Task savedTask = repository.save(task);

        return new TaskDto(savedTask.getId(), savedTask.getTitle(), savedTask.getStatus(), savedTask.getCreatedAt());
    }

    public List<TaskDto> getAllTasks() {
        User user = securityUtils.requireCurrentUser();
        return repository.findByUserIdOrderByCreatedAtAsc(user.getId()).stream()
                .map(t -> new TaskDto(t.getId(), t.getTitle(), t.getStatus(), t.getCreatedAt()))
                .toList();
    }
}