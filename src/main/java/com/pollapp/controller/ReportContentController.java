package com.pollapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pollapp.entity.ReportContent;
import com.pollapp.service.ReportContentService;

@RestController
@RequestMapping("/report")
public class ReportContentController {
	
	@Autowired
	private ReportContentService reportService;

	
    @PostMapping("/{pollId}")
    public void saveReportContent(@PathVariable long pollId, @RequestBody ReportContent reportContent) {
    	reportService.saveReportContent(pollId, reportContent);
    }
}