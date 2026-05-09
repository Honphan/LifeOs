package com.example.demo.task;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public TaskDto create(@RequestParam String title) {
        return taskService.createTask(title);
    }

    @GetMapping
    public List<TaskDto> getAll() {
        return taskService.getAllTasks();
    }
}