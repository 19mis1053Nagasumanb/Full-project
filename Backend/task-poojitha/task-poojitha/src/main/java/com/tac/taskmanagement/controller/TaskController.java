package com.tac.taskmanagement.controller;

import com.tac.taskmanagement.dto.TaskDTO;
import com.tac.taskmanagement.entity.TaskEntity;
import com.tac.taskmanagement.service.TaskService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/task")
@CrossOrigin(origins = "http://localhost:4200")

@Slf4j
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/entry")
    public ResponseEntity<TaskEntity> createEntity(@RequestBody TaskDTO task) {
        TaskEntity data = taskService.saveData(task.getName(), task.getStatus(), task.getTask(), task.getLogHours());
        return ResponseEntity.ok(data);
    }

    @GetMapping
    public ResponseEntity<List<TaskEntity>> getAllData() {
        List<TaskEntity> allData = taskService.getAllData();
        return ResponseEntity.ok(allData);
    }

    @GetMapping("/entry/{id}")
    public ResponseEntity<TaskEntity> getDataById(@PathVariable Long id) {
        TaskEntity data = taskService.getDataById(id);
        if (data == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(data);
    }

    @GetMapping("/entries/employ/{name}")
    public ResponseEntity<List<TaskEntity>> getDataByName(@PathVariable String name) {
        List<TaskEntity> allData = taskService.getDataByName(name);
        return ResponseEntity.ok(allData);
    }

    @GetMapping("/entries/date/{date}")
    public ResponseEntity<List<TaskEntity>> getDataByDate(@PathVariable String date) {
        List<TaskEntity> allData = taskService.getDataByDate(LocalDate.parse(date));
        return ResponseEntity.ok(allData);
    }

    @PutMapping("/entry/{id}")
    public ResponseEntity<TaskEntity> updateData(@PathVariable Long id, @RequestBody TaskDTO task) {
        TaskEntity updatedData = taskService.updateData(id, task);
        if (updatedData == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedData);
    }

    @PostMapping("/name")
    public ResponseEntity<Void> addName(@RequestBody String name) {
        taskService.addName(name);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/names")
    public ResponseEntity<List<String>> getNames() {
        List<String> names = Arrays.asList("Chay", "Nithin", "Pradeep", "Souji", "Sathvika P", "Shivu");
        return new ResponseEntity<>(names, HttpStatus.OK);
    }

    @PostMapping("/status")
    public ResponseEntity<Void> addStatus(@RequestBody String status){
        taskService.addStatus(status);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteData(@PathVariable Long id) {
        try {
            taskService.deleteData(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}



