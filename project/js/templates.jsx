var BlogPost = React.createClass({
  title: function () {
    return { __html: this.props.title };
  },
  subtitle: function () {
    return { __html: this.props.subtitle };
  },
  content: function () {
    return { __html: this.props.content };
  },
  render: function () {
    return (
      <article>
        <h1 dangerouslySetInnerHTML={this.title()}></h1>
        <h2 dangerouslySetInnerHTML={this.subtitle()}></h2>
        <div class='content'dangerouslySetInnerHTML={this.content()}></div>
      </article>
    );
  }
});

var BlogPosts = React.createClass({
  render: function () { 
    return (
    <div class="posts">
      {
        this.props.posts.map(function (post) {
          return <BlogPost title={post.title} subtitle={post.subtitle} content={post.content} />;
        })
      }
    </div>
    );
  }
});
