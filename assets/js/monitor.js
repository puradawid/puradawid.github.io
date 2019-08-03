(function () {
function onScrollEvent(window, handler) {
  window.onscroll = function () {
    handler();
  }
}

function loadAvailableParagraphs(document, selector) {
  var elements = document.querySelectorAll(selector);
  var results = [];
  elements.forEach(function (paragraph, index) {
    results.push(new Paragraph(paragraph, index + 1, document));
  });
  return results;
}

function elementTop(element) {
  return element.getBoundingClientRect().top;
}

function Paragraph(element, number, document) {
  this.yPosition = elementTop(element) - elementTop(document.body);
  this.isVisible = function (y, height) {
    var relativePos = this.yPosition - y;
    return relativePos > 0 && relativePos < height;
  };
  this.number = number;
  this.getEvent = function () {
    return { action: 'read_paragraph',
      details: {
        event_category: 'reading',
        event_label: 'paragraph_' + Number(this.number).toString().padStart(3, 0)
      }};
  };
}

function sendAnalyticsEvent(paragraph, gtag) {
  if (window.location.search.indexOf('debug=true') >=0) {
    console.log("Sending event: " + JSON.stringify(paragraph.getEvent()));
  }
  if (gtag) {
    gtag('event', paragraph.getEvent().action, paragraph.getEvent().details);
  }
}

function reviewParagraphs(paragraphsRead, paragraphs, y, windowHeight, gtag) {
  paragraphs.forEach(function (paragraph) {
    if (paragraphsRead.indexOf(paragraph) < 0 &&
      paragraph.isVisible(y, windowHeight)) {
      paragraphsRead.push(paragraph);
      sendAnalyticsEvent(paragraph, gtag);
    }
  });
}

function main(window, document, selector, gtag) {
  var paragraphsRead = [];
  var paragraphs = loadAvailableParagraphs(document, selector);
  onScrollEvent(window, function () {
    reviewParagraphs(paragraphsRead, paragraphs, window.scrollY, window.innerHeight, gtag);
  });
}

main(window, document, 'article p', window.gtag);

})();
