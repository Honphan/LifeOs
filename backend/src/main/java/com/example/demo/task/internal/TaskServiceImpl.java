package com.example.demo.task.internal;

import com.example.demo.task.TaskDto;
import com.example.demo.task.TaskService;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository repository;

    public TaskServiceImpl(TaskRepository repository) {
        this.repository = repository;
    }

    public TaskDto createTask(String title) {
        Task task = new Task();
        task.setTitle(title);

        Task savedTask = repository.save(task);

        return new TaskDto(savedTask.getId(), savedTask.getTitle(), savedTask.getStatus(), savedTask.getCreatedAt());
    }

    public List<TaskDto> getAllTasks() {
        return repository.findAll().stream()
                .map(t -> new TaskDto(t.getId(), t.getTitle(), t.getStatus(), t.getCreatedAt()))
                .toList();
    }
}