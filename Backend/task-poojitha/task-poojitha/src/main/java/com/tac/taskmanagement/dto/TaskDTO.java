package com.tac.taskmanagement.dto;

import lombok.Data;
@Data
public class TaskDTO {

        private Long id;
        private String name;
        private String task;
        private String status;
        private String logHours;
        private String time; // Use String to handle time in the format "HH:mm"

}
