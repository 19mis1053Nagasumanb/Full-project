package com.tac.taskmanagement.service;


import com.tac.taskmanagement.dto.TaskDTO;
import com.tac.taskmanagement.entity.TaskEntity;
import com.tac.taskmanagement.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

//    private static final List<String> allowedNames = Arrays.asList("Chay", "Nithin", "Souji", "Sathvika P", "Shivu", "Pradeep");
//    private static final List<String> allowedStatus = Arrays.asList("In Progress", "On Hold", "To DO", "Pending", "Done");

    private static final List<String> allowedNames = new ArrayList<>(Arrays.asList("Chay", "Nithin", "Souji", "Sathvika P", "Shivu", "Pradeep","Suman"));
    private static final List<String> allowedStatus = new ArrayList<>(Arrays.asList("In Progress", "On Hold", "To DO", "Pending", "Done"));

    private static final Pattern LOG_HOURS_PATTERN = Pattern.compile("(\\d+)hrs(?: (\\d+)min)?");

    public TaskEntity saveData(String name, String status, String task, String logHours) {
        validateLogHours(logHours);

        if (!allowedNames.contains(name)) {
            throw new IllegalArgumentException("Name not allowed: " + name);
        }

        TaskEntity entity = new TaskEntity();
        entity.setDate(LocalDate.now());
        entity.setDayOfWeek(LocalDate.now().getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH));
        entity.setTime(LocalTime.now().withSecond(0).withNano(0));
        entity.setName(name);
        entity.setStatus(status);
        entity.setTask(task);
        entity.setLogHours(logHours);

        return taskRepository.save(entity);
    }

    public List<TaskEntity> getAllData() {
        return taskRepository.findAll();
    }

    public TaskEntity getDataById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    public List<TaskEntity> getDataByName(String name) {
        return taskRepository.findByName(name);
    }

    public List<TaskEntity> getDataByDate(LocalDate date) {
        return taskRepository.findByDate(date);
    }

    public TaskEntity updateData(Long id, TaskDTO task) {
        validateLogHours(task.getLogHours());

        return taskRepository.findById(id).map(entity -> {
            if (!allowedNames.contains(task.getName())) {
                throw new IllegalArgumentException("Name not allowed: " + task.getName());
            }

            entity.setName(task.getName());
            entity.setStatus(task.getStatus());
            entity.setTask(task.getTask());
            entity.setLogHours(task.getLogHours());
            entity.setDate(LocalDate.now());
            entity.setTime(LocalTime.now().withSecond(0).withNano(0));
            entity.setDayOfWeek(LocalDate.now().getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH));
            return taskRepository.save(entity);
        }).orElse(null);
    }

    private void validateLogHours(String logHours) {
        Matcher matcher = LOG_HOURS_PATTERN.matcher(logHours.trim());

        if (!matcher.matches()) {
            throw new IllegalArgumentException("Invalid log hours format. Expected format: 'Xhrs Ymin' or 'Xhrs'");
        }

        int hours = Integer.parseInt(matcher.group(1));
        String minutesGroup = matcher.group(2);
        int minutes = (minutesGroup != null) ? Integer.parseInt(minutesGroup) : 0;

        if (hours > 8 || (hours == 8 && minutes > 0)) {
            throw new IllegalArgumentException("Log hours cannot exceed 8 hours.");
        }
    }

    public void addName(String name){
        if (!allowedNames.contains(name)){
            allowedNames.add(name);
        }
    }

    public void deleteData(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new EntityNotFoundException("Entity with ID " + id + " not found.");
        }
        taskRepository.deleteById(id);
    }

    public void addStatus(String status) {
        if(allowedStatus.contains(status)){
            allowedStatus.add(status);
        }
    }
}