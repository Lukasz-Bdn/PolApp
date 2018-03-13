package com.pollapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pollapp.entity.ReportContent;
import com.pollapp.repository.ReportContentRepository;

@Service
public class ReportContentService {
	
	@Autowired
	private ReportContentRepository reportRepo;

	public void save(ReportContent reportContent) {
		reportRepo.save(reportContent);		
	}

}