package com.pollapp.repository;

import com.pollapp.entity.Poll;
import com.pollapp.entity.ReportContent;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportContentRepository extends JpaRepository<ReportContent, Long> {
	List<ReportContent> findAllByPoll(Poll poll);
}
