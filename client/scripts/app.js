var Message = Backbone.Model.extend({
  idAttribute: 'objectId'
});

var MessageView = Backbone.View.extend({
  tagName: 'li',
  template: _.template('<span class="username"><%= _.escape(username) %></span> ' +
    '<%= _.escape(text) %><span class="time" data-livestamp="<%= createdAt %>"></span>'),
  render: function () {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});

var MessageForm = Backbone.View.extend({
  events: {
    'submit': 'submit'
  },
  submit: function (e) {
    e.preventDefault();
    this.collection.create({
      username: window.location.search.split('username=')[1],
      text: this.$el.find('input').val()
    }, {
      wait: true
    });
    this.$el.find('input').val('').focus();
  }
});

var SelectRoom = Backbone.View.extend({
  events: {
    'change': 'changeRoom'
  },
  changeRoom: function () {
    this.collection.reset();
    this.collection.currentRoomname = this.$el.val();
  },
  addRoom: function (roomname) {
    this.$el.find('option').removeAttr('selected');
    var $option = $('<option>');
    $option.attr('selected', 'selected');
    $option.attr('value', roomname);
    $option.text(roomname);
    this.$el.append($option);
  },
  initialize: function () {
    this.addRoom('Sports');
    this.addRoom('Food');
    this.addRoom('Travel');
  }
});

var Room = Backbone.Collection.extend({
  model: Message,
  currentRoomname: 'Travel',
  url: function () {
    return 'http://127.0.0.1:3010/classes/' + this.currentRoomname;
  },
  parse: function (resp) {
    return resp.results.reverse();
  },
  initialize: function () {
    setInterval(function () {
      this.fetch();
    }.bind(this), 1000);
  }
});

var RoomView = Backbone.View.extend({
  initialize: function () {
    this.collection.on('add', function (model) {
      var view = new MessageView({
        model: model
      });
      this.$el.prepend(view.render().el);
    }, this);
    this.collection.on('reset', function () {
      this.$el.empty();
    }, this);
  }
});

$(function () {
  var room = new Room();
  var roomView = new RoomView({
    collection: room,
    el: $('ul')
  });
  var messageForm = new MessageForm({
    collection: room,
    el: $('form')
  });
  var selectRoom = new SelectRoom({
    collection: room,
    el: $('select')
  });
});
