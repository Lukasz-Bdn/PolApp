$(function () {
    var ajax = new Ajax();
    var formUtil = new FormUtil();
    var ongoingPolls = $('#ongoingPolls');
    var closedPolls = $('#closedPolls');
    var closedPollsCategories = $('#closedPollsCategories');
    var openPollsCategories = $('#openPollsCategories');
    var showPolls = $('#showPolls');
    var pollForm = $('#pollForm');
    var answers = $('#answers');
    var categories = $('#all-categories');
    var selectedCategories = $('#selected-categories');
    var $pagination = $('#pagination-demo');
    var categoryId = 0;
    var showPollsAddress = "";
    var reportForms =[];

    var defaultOpts = {
        totalPages: 10,
        visiblePages: 10,
        startPage: 1
    };
    $pagination.twbsPagination(defaultOpts);

    function renderClosedList(endpoint) {
        ajax.ajaxGetCallback(endpoint, function (response) {
            var totalPages = response.totalPages;
            if (totalPages <= 0) {
                totalPages = 1;
            }
            $pagination.twbsPagination('destroy');
            $pagination.twbsPagination($.extend({}, defaultOpts, {
                totalPages: totalPages,
                onPageClick: function (evt, page) {
                    closedPolls.empty();
                    ajax.ajaxGetCallback(endpoint + "?page=" + (page - 1), function (response) {
                        var data = response.content;
                        data.forEach(function (elem) {
                            var poll = elem.poll;
                            var pollData = elem.pollNumberData;
                            var charContent = [];
                            ajax.ajaxGetCallback('/polls/' + poll.id + '/answers', function (response) {
                                response.forEach(function (elem) {
                                    var answer = elem.answer;
                                    var answerData = elem.answerNumberData;
                                    charContent.push({
                                        y: answerData.percent,
                                        label: answer.content
                                    })
                                });
                                closedPolls.append('<div class="card border-danger mb-3" style="max-width: 40rem;">' +
                                    '<div class="card-header">' +
                                    poll.question +
                                    '</div>' +
                                    '<div class="card-body">' +
                                    '<div id="chartContainer' + poll.id + '" style="height: 370px; width: 100%;"></div>' +
                                    '</div></div>');
                                var chart = new CanvasJS.Chart("chartContainer" + poll.id, {
                                    animationEnabled: true,
                                    theme: "light2", // "light1", "light2", "dark1", "dark2"
                                    title: {
                                        text: ""
                                    },
                                    axisY: {
                                        title: "%"
                                    },
                                    data: [{
                                        type: "column",
                                        showInLegend: true,
                                        legendMarkerColor: "grey",
                                        legendText: pollData.totalAnswers + " answers",
                                        dataPoints: charContent
                                    }]
                                });
                                chart.render();
                            });
                        })
                    });
                }
            }));
        });
    }

    function renderOpenedList(endpoint) {
        ongoingPolls.empty();
        ajax.ajaxGetCallback(endpoint, function (response) {
            var content = response.content;
            content.forEach(function (elem) {
                var poll = elem.poll;
                var pollAnswers = '';
                ajax.ajaxGetCallback('/polls/' + poll.id + '/answers', function (response) {
                    response.forEach(function (elem) {
                        var answer = elem.answer;
                        pollAnswers += '<div class="form-check">' +
                            '<label class="form-check-label">' +
                            '<input type="radio" class="form-check-input" name="optionsRadios" value="' + answer.id + '" checked="">' +
                            answer.content +
                            '</label>' +
                            '</div>'
                    });

                    ongoingPolls.append('<div class="text-white bg-secondary mb-3" style="max-width: 40rem;"><div class="card-header">' +
                        poll.question + '<br\>' +
                        '</div><div class="card-body">' +
                        '<fieldset class="form-group">' +
                        pollAnswers +
                        '</fieldset>' +
                        '</div><div class="card-header">' +
                        '<div>Time left: <span id="reportModal' + poll.id + '"></span></div>' +
                        '<div id="clock' + poll.id + '"></div>' +
                        '</div>'
                    );

                    var getClock = setInterval(function () {
                        var now = new Date().getTime();
                        var closed = poll.closed;
                        var distance = closed - now;
                        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                        var clock = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
                        if (document.getElementById("clock" + poll.id) !== null) {
                            document.getElementById("clock" + poll.id).innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
                        }
                    }, 1000);

                    function getReportModal() {
                        var reportId = "reportModal"+poll.id;
                        var reportModal = document.getElementById(reportId);
                        reportModal.innerHTML = "<button type='button' class='btn btn-danger btn-sm report' " +
                        "data-toggle='modal' data-target='#report"+poll.id+"'> Report</button>" +
                        '<div class="modal fade text-primary" id="report'+ poll.id+'">' +
                        '<div class="modal-dialog">' +
                        '<div class="modal-content">' +
                        '<div class="modal-header">' +
                          '<h4 class="modal-title">'+poll.question+'</h4>' +
                          '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                        '</div>' +
//                        Report modal body
                        '<div class="modal-body">' +
                        'Please indicate why you think this content is inappropriate:' +
                            '<form method="post" id="reportForm'+poll.id+'" data-pollId="'+poll.id+'">' +
                                '<fieldset>' +
                                    '<div class="form-group">' +
                                        '<div id="reportContent'+poll.id+'" class="container">' +
                                            '<textarea class="form-control" aria-label="With textarea" name="reportReason" id="reportReason'+poll.id+'"></textarea>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="container">' +
                                        '<button type="submit" class="btn btn-info">Submit</button>' +
                                    '</div>' +
                                '</fieldset>' +
                            '</form>' +
                        '</div>' +
//                        Report modal footer
                        '<div class="modal-footer">' +
                        '</div>' +
                        '</div>'                    
                    }

                    getReportModal();
                });
            })
        });
    }

    function renderCategoriesList() {
        openPollsCategories.append('<a class="dropdown-item category-open" data-category="' + "0" + '" href="#">' + "All" + '</a>');
        closedPollsCategories.append('<a class="dropdown-item category-closed" data-category="' + "0" + '" href="#">' + "All" + '</a>');
        ajax.ajaxGetCallback('/categories', function (response) {
            response.forEach(function (category) {
                openPollsCategories.append('<a class="dropdown-item category-open" data-category="' + category.id + '" href="#">' + category.name + '</a>');
                closedPollsCategories.append('<a class="dropdown-item category-closed" data-category="' + category.id + '" href="#">' + category.name + '</a>');
            })
        });
    }

    function renderCategoriesToSelect() {
        ajax.ajaxGetCallback('/categories', function (response) {
            response.forEach(function (category) {
                categories.append('<li data-id="' + category.id + '" class="col-xs-3 list-group-item"> ' + category.name + '</li>')
            })
        });
    }

    function renderAnswers() {
        var answer = answers.children().last();
        answers.empty();
        answers.append(answer);
        answer.clone().appendTo(answers);
    }

    showPolls.on('click', function (e) {
        showPollsAddress = $(e.target).data('address');
        renderClosedList('/categories/' + categoryId + '/polls/' + showPollsAddress);
        $('#showPollsButton').html($(e.target).html() + ' POLLS');
    });

    closedPollsCategories.on('click', function (e) {
        categoryId = $(e.target).data('category');
        var categoryName = $(e.target).html();
        renderClosedList('/categories/' + categoryId + '/polls/' + showPollsAddress);
        $('#closedPollsCategoryButton').html('CATEGORY ' + categoryName);
    });

    openPollsCategories.on('click', function (e) {
        categoryId = $(e.target).data("category");
        var categoryName = $(e.target).html();
        renderOpenedList('/categories/' + categoryId + '/polls/available');
        $('#ongoingPollsCategoryButton').html('CATEGORY ' + categoryName);
    });

    pollForm.on('submit', function (e) {
        e.preventDefault();
        var poll = formUtil.createObjectFromForm($('#poll'));
        var answers = formUtil.createObjectListFromForm($('#answers'));
        var days = $('#days').children().first().val();
        var hours = $('#hours').children().first().val();
        ajax.ajaxPostCallback("/polls", poll, function (response) {
            answers.forEach(function (answer) {
                ajax.ajaxPost("/polls/" + response.poll.id + "/answers", answer)
            });
            $('#selected-categories').children().each(function (index, category) {
                ajax.ajaxPost("/polls/" + response.poll.id + "/categories/" + $(category).data('id'))
            });
            ajax.ajaxPost("/polls/" + response.poll.id + "/closed/0" + days + "/0" + hours);
            categories.empty();
            selectedCategories.empty();
            renderCategoriesToSelect();
            renderAnswers();
        });
        this.reset();
    });

    $('#pollCreate').on('click', function () {
        pollForm.toggle('hidden');
        categories.empty();
        selectedCategories.empty();
        renderCategoriesToSelect();
    });

    categories.on('click', 'li', function (e) {
        selectedCategories.append(e.target);
    });

    selectedCategories.on('click', 'li', function (e) {
        categories.append(e.target);
    });

    $('.add-answer').on('click', function () {
        answers.children().last().clone().appendTo(answers).val('');
    });

    $('.remove-answer').on('click', function () {
        if (answers.children().length > 2) {
            answers.children().last().remove();
        }
    });

    ongoingPolls.on('click', '.form-check-input', function (e) {
        ajax.ajaxPost('/answers/' + e.target.value + '/data');
        $(this).parents('.text-white').fadeOut();
    });

    $(document).on('submit', 'form[id^="reportForm"]', function(event) {
        event.preventDefault();
        var pollId = $(this).attr('data-pollId');
        var reportContent = formUtil.createObjectFromForm('#reportForm'+ pollId);
        ajax.ajaxPost('/report/'+pollId, reportContent);
        $(this).find('textarea').val('');
        var modalToDismiss = $(this).closest('.modal');
        modalToDismiss.modal('hide');
    });

    renderCategoriesList();
    renderOpenedList('/categories/' + 0 + '/polls/available');
    renderClosedList('/categories/' + 0 + '/polls');
});