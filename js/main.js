var render = function(url, context) {
    context = context || {};

    var html;
    $.ajax({
        url: url,
        success: function(data) {
            var template = Handlebars.compile(data);
            html = template(context);
        },
        async: false
    });

    return $(html);
};

// Article ---------------------------------------------------------------------

var Article = function(imageUrl, source, headLine, percentage) {
    var url = chrome.extension.getURL("html/article.html");

    this._$container = render(url, {
        imageUrl: imageUrl,
        source: source,
        headLine: headLine
    });
    this._$meterThumb = this._$container.find('.spectrum-meter-thumb');

    this.moveMeterThumb(percentage);

    return this;

};

Article.prototype.getContainer = function() {
    return this._$container;
};

Article.prototype.moveMeterThumb = function(percentage) {
    if (percentage < 0) {
        percentage = 0;
    } if (percentage > 100) {
        percentage = 100;
    }

    this._$meterThumb.velocity({
        properties: { 'left': percentage + '%' },
        options: { duration: 500 }
    });
};

// Popup -----------------------------------------------------------------------

var Popup = function(caption, numberOfVotes, percentage) {
    var url = chrome.extension.getURL("html/popup.html");

    this._$container = render(url,{
        caption: caption,
        numberOfVotes: numberOfVotes,
        percentage: percentage
    });
    this._$meterThumb = this._$container.find('.spectrum-meter-thumb');

    this.moveMeterThumb(percentage);

    return this;
};

Popup.prototype.getContainer = function() {
    return this._$container;
};

Popup.prototype.moveMeterThumb = function(percentage) {
    if (percentage < 0) {
        percentage = 0;
    } if (percentage > 100) {
        percentage = 100;
    }

    this._$meterThumb.velocity({
        properties: { 'left': percentage + '%' },
        options: { duration: 500 }
    });
};



var spectrum = {
    init: function() {
        var url = chrome.extension.getURL('html/main.html');

        this._$container = render(url);
        this._$articlesContainer = this._$container.find('#spectrum-articles-container');
        $('body').append(this._$container);

        this._$popup = new Popup(
            'RIGHT OF CENTER',
            222,
            80
        );
        $('body').append(this._$popup.getContainer());

        var leftArticle = new Article(
            '#',
            'TELEGRAPH.CO.UK',
            'Obama May Jump Into Fray as Democrats Counter Trump',
            20
        );

        var rightArticle = new Article(
            '#',
            'THE DAILY WIRE',
            '5 Things You Need To Know About Trump CIA Director Pick Mike Pompeo',
            80
        );

        this._$articlesContainer.append(leftArticle.getContainer(), rightArticle.getContainer());

        this._hideIfNecessary();

        this._bindEvents();
    },

    _bindEvents: function() {
        $(window).scroll(this._onScroll.bind(this));
    },

    _onScroll: function() {
        this._hideIfNecessary();
    },

    _hideIfNecessary: function() {
        var height = $(document).height();
        var scrollBottom = $(window).scrollTop() + $(window).height();

        if (height * 0.75 < scrollBottom) {
            this.showArticles();
        } else {
            this.hideArticles();
        }
    },

    hideArticles: function() {
        this._$container.hide();
    },

    showArticles: function() {
        this._$container.show();
    }
};

$(document).ready(function() {
    spectrum.init();
});
