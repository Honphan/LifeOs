package com.example.demo.task;

import com.example.demo.task.internal.TaskStatus;

import java.time.LocalDateTime;

public record TaskDto(Long id, String title, TaskStatus status, LocalDateTime createdAt) {
}