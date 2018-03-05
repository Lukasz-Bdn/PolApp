package com.pollapp.controller;

import com.pollapp.entity.Answer;
import com.pollapp.entity.Category;
import com.pollapp.entity.Comment;
import com.pollapp.entity.Poll;
import com.pollapp.repository.AnswerRepository;
import com.pollapp.repository.PollRepository;
import com.pollapp.response.AnswerResponse;
import com.pollapp.response.PollResponse;
import com.pollapp.service.AnswerService;
import com.pollapp.service.PollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Calendar;
import java.util.List;

@RestController
@RequestMapping("/polls")
public class PollController {

    @Autowired
    private PollService pollService;

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private AnswerService answerService;

    @GetMapping("")
    public Page<PollResponse> getAllPolls(@RequestParam(value = "page", defaultValue = "0") int page, @RequestParam(value = "size", defaultValue = "5") int size) {
        return pollService.getPolls(new PageRequest(page, size));
    }

    @GetMapping("/ongoing")
    public Page<PollResponse> getOpenedPolls(@RequestParam(value = "page", defaultValue = "0") int page, @RequestParam(value = "size", defaultValue = "5") int size) {
        return pollService.getOnGoingPolls(new PageRequest(page, size));
    }

    @GetMapping("/closed")
    public Page<PollResponse> getClosedPolls(@RequestParam(value = "page", defaultValue = "0") int page, @RequestParam(value = "size", defaultValue = "5") int size) {
        return pollService.getClosedPolls(new PageRequest(page, size));
    }

    @PostMapping("")
    public PollResponse createPoll(@RequestBody Poll poll) {
        return pollService.save(poll);
    }

    @GetMapping("/{pollId}")
    public PollResponse getPoll(@PathVariable long pollId) {
        return pollService.getPoll(pollId);
    }

    @PutMapping("/{pollId}")
    public Poll updatePoll(@RequestBody Poll poll, @PathVariable long pollId) {
        // TODO
        return null;
    }

    @DeleteMapping("/{pollId}")
    public Poll deletePoll(@PathVariable long pollId) {
        // TODO
        return null;
    }

    @GetMapping("/{pollId}/categories")
    public List<Category> getCategoriesByPoll(@PathVariable long pollId) {
        // TODO
        return null;
    }

    @PostMapping("/{pollId}/categories/{categoryId}")
    public PollResponse addCategoryToPoll(@PathVariable long pollId, @PathVariable int categoryId) {
        return pollService.addCategoryToPoll(pollId, categoryId);
    }

    @PostMapping("/{pollId}/closed/{days}/{hours}")
    public Poll addHoursToPoll(@PathVariable long pollId, @PathVariable int days, @PathVariable int hours) {
        Poll poll = pollRepository.findOne(pollId);
        if (days + hours <= 0) {
            poll.getClosed().add(Calendar.HOUR_OF_DAY, 24);
        } else {
            poll.getClosed().add(Calendar.DAY_OF_MONTH, days);
            poll.getClosed().add(Calendar.HOUR_OF_DAY, hours);
        }
        return pollRepository.save(poll);
    }

    @GetMapping("/{pollId}/answers")
    public List<AnswerResponse> getAnswersByPoll(@PathVariable long pollId) {
        return answerService.createAnswerResponseList(answerRepository.findByPollId(pollId));
    }

    @PostMapping("/{pollId}/answers")
    public AnswerResponse addAnswerToPoll(@RequestBody Answer answer, @PathVariable long pollId) {
        Poll p = pollRepository.findOne(pollId);
        answer.setPoll(p);
        return answerService.createAnswerResponse(answerRepository.save(answer));
    }

    @GetMapping("/{pollId}/comments")
    public List<Comment> getCommentsByPoll(@PathVariable long pollId) {
        // TODO
        return null;
    }
}
