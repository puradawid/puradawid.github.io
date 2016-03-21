var postsPath = 'posts.json';

(function () {
  loadPosts(postsPath, function (err, result) {
    React.render(React.createElement(BlogPosts, { posts: result.map(markdownPostObject) }), document.querySelector('body'));
  });
})();

function loadPosts(path, done) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function (error) {
    if (request.readyState !== 4) {
      return;
    }

    if (request.status === 200) { 
      done(null, JSON.parse(request.responseText));
    } else {
      done(Error('Cannot fetch blog posts'));
    }
  };

  request.open('GET', path);
  request.send();
}

function markdownPostObject(post) {
  var result = {};
  for (var name in post) { 
    result[name] = markdown.toHTML(post[name]);
  }
  return result;
}
