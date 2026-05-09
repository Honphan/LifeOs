package com.example.demo.task;

import java.util.List;

public interface TaskService {
    TaskDto createTask(String title);
    List<TaskDto> getAllTasks();
}
