package com.example.demo.task;

import com.example.demo.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import java.util.List;

public interface TaskService {
    ResponseEntity<ApiResponse<TaskDto>> createTask(String title);
    ResponseEntity<ApiResponse<List<TaskDto>>> getAllTasks();
}
