$(function() {
  var baseUrl = 'http://localhost:5000/'
  var ongoingPolls = $('#ongoingPolls');
  var closedPolls = $('#closedPolls');
  var form = $('#pollForm');

  renderCategoriesList();
  renderOpenedList('polls/ongoing/');
  renderClosedList('polls/closed/');

  function renderOpenedList(address) {
    $.ajax({
      url: baseUrl + address
    }).done(function(data) {
      console.log(data);
      ongoingPolls.empty();
      data.forEach(function(poll) {
        var pollAnswers = '';
        poll.answers.forEach(function(answer) {
          pollAnswers += '<div class="form-check">' +
            '<label class="form-check-label">' +
            '<input type="radio" class="form-check-input" name="optionsRadios" id="optionsRadios1" value="option1" checked="">' +
            answer.content +
            '</label>' +
            '</div>'
        })
        ongoingPolls.append('<div class="card border-danger mb-3" style="max-width: 40rem;">' +
          '<div class="card-header">' +
          poll.question +
          '</div>' +
          '<div class="card-body">' +
          '<div id="chartContainer' + poll.id + '" style="height: 370px; width: 100%;"></div>' +
          '</div></div>');
        var charContent = [];
        poll.answers.forEach(function(answer) {
          charContent.push({
            y: answer.id,
            label: answer.content
          })
        })
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
            legendText: "100 answers",
            dataPoints: charContent
          }]
        });
        chart.render();
      })
    }).fail(function(e) {
      console.log("error");
      console.log(e);
    });
  }

  function renderClosedList(address) {
    $.ajax({
      url: baseUrl + address
    }).done(function(data) {
      console.log(data);
      closedPolls.empty();
      data.forEach(function(poll) {
        var pollAnswers = '';
        poll.answers.forEach(function(answer) {
          pollAnswers += '<div class="form-check">' +
            '<label class="form-check-label">' +
            '<input type="radio" class="form-check-input" name="optionsRadios" id="optionsRadios1" value="option1" checked="">' +
            answer.content +
            '</label>' +
            '</div>'
        })
        closedPolls.append('<div class="text-white bg-secondary mb-3" style="max-width: 40rem;"><div class="card-header">' +
          poll.question +
          '</div><div class="card-body">' +
          '<fieldset class="form-group">' +
          pollAnswers +
          '</fieldset></div></div>');
      })
    }).fail(function(e) {
      console.log("error");
      console.log(e);
    });
  }

  function renderClosedListFromCategory(categoryid) {
    $.ajax({
      url: baseUrl + 'categories/' + categoryid + '/polls/'
    }).done(function(data) {
      console.log(data);
      closedPolls.empty();
      data.forEach(function(poll) {
        var pollAnswers = '';
        poll.answers.forEach(function(answer) {
          pollAnswers += '<div class="form-check">' +
            '<label class="form-check-label">' +
            '<input type="radio" class="form-check-input" name="optionsRadios" id="optionsRadios1" value="option1" checked="">' +
            answer.content +
            '</label>' +
            '</div>'
        })
        closedPolls.append('<div class="text-white bg-secondary mb-3" style="max-width: 40rem;"><div class="card-header">' +
          poll.question +
          '</div><div class="card-body">' +
          '<fieldset class="form-group">' +
          pollAnswers +
          '</fieldset></div></div>');
      })
    }).fail(function(e) {
      console.log("error");
      console.log(e);
    });
  }

  // renderCategoriesList()

  var closedPollsCategories = $('#closedPollsCategories');
  var openPollsCategories = $('#openPollsCategories');

  function renderCategoriesList() {
    $.ajax({
      url: baseUrl + 'categories/'
    }).done(function(data) {
      data.forEach(function(category) {
        openPollsCategories.append('<a class="dropdown-item category-open" data-category="' + category.id + '" href="#">' + category.name + '</a>');
        closedPollsCategories.append('<a class="dropdown-item category-closed" data-category="' + category.id + '" href="#">' + category.name + '</a>');
      })
    }).fail(function(e) {
      console.log("error");
      console.log(e);
    });
  }

  var category = $('.dropdown-menu');

  category.on('click', ".category-closed", function() {
    var categoryid = $(this).data("category");
    renderClosedList('categories/' + categoryid + '/polls/');
  })

  category.on('click', ".category-open", function() {
    var categoryid = $(this).data("category");
    renderOpenedList('categories/' + categoryid + '/polls/'); //TODO once backend disctinction between closed and opened polls is developed, attach it
  })

  form.on('submit', function(e) {

    //process form
    var data = {};
    $(this).find('input[type=text]').each(function(index, elem) {
      data[elem.name] = elem.value
    });

    console.log(data);

    $.post({
      headers: {
        'Content-Type': 'application/json'
      },
      url: baseUrl + 'polls',
      data: JSON.stringify(data),
      dataType: 'json' //potencjalnie to mozna wyrzucic
    }).done(function(res) {
      console.log(res);
      renderList();
    }).fail(function(xhr, status, error) {
      console.log(xhr, status, error);
    })

    this.reset();
    e.preventDefault();
  });

  var pollCreate = $('#pollCreate');
  var pollForm = $('#pollForm');

  pollCreate.on('click', function() {
    pollForm.toggle();
  })

  var addAnswer = $('.add-answer');
  var additionalAsnwer = $('#additional-answer');

  addAnswer.on('click', function() {
    additionalAsnwer.append('<input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="answers" placeholder="Enter answer">');
  })

  var button = $('.form-check-input');

  closedPolls.on('click', '.form-check-input', function() {
    console.log(this);
    $(this).parents('.text-white').fadeOut();
  });
})
