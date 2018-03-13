package com.pollapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pollapp.entity.Poll;
import com.pollapp.entity.ReportContent;
import com.pollapp.repository.PollRepository;
import com.pollapp.repository.ReportContentRepository;

@Service
public class ReportContentService {
	
	@Autowired
	private ReportContentRepository reportRepo;

	@Autowired
	private PollRepository pollRepo;

	public void saveReportContent(long pollId, ReportContent reportContent) {
		Poll poll = pollRepo.getOne(pollId);
		reportContent.setPoll(poll);
		reportRepo.save(reportContent);
	}

}