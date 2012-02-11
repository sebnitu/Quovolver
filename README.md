# Quovolver v2.0
Quovolver is a jQuery plugin for revolving multiple testimonials or quotes in your document. Although, it can also be used to cycle through any group of elements.

By Sebastian Nitu

Plugin URI:	[https://github.com/sebnitu/Quovolver](https://github.com/sebnitu/Quovolver)
Author URI:	[http://sebnitu.com/](http://sebnitu.com/)

## Why use quovolver?

Quovolver is a great way to display quotes, testimonials or comments on your site. I can't count how many times clients ask for something like this on their site. This just makes it easy to implement.

Version 2.0 adds a lot more features than the first 1.0 version. Some of these features were requested from those who used the first version so hopefully it makes the script that much more useful and practical for everyone.

## How do I use it?

1) Firstly, include a copy of jQuery in your document. You can download your own copy of jQuery at [http://jquery.com](http://jquery.com) or link to the Google hosted script:

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
```

2) Download and include Quovolver in your document as well:

```html
<script src="jquery.quovolver.js"></script>
```

3) Call the quovolver function in your document ready function:

```javascript
$(document).ready(function() {
  $('ul').quovolver();
});
```

4) You can override the default settings by passing in parameters like this:

```javascript
$(document).ready(function() {
  $('ul').quovolver({
    transitionSpeed : 300,
    autoPlay : false
  });
});
```
	 See the [documentation](https://github.com/sebnitu/Quovolver/wiki) for a full list of available options and their defaults.
   
5). That's it, watch the quotes fly!


## I can't figure out how this works. Is this thing broken?

Although, I would love to help when I can, I am usually pretty swamped with work and can not spare much time helping with support questions. Please make sure to check the documentation or Google your question before writing me for help. I do my best to respond to all my emails but it may take me some time to get to all of them.

If you have any feature requests just let me know! If enough people want a feature I'll most likely built it into the next version.

Using Quovolver in your project? Let me know! Shoot me a link of where you're using it.

## License

[Quovolver](https://github.com/sebnitu/Quovolver) is built and maintained by [Sebastian Nitu](http://sebnitu.com/) and is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-nc-sa/3.0/). Follow me on [Twitter](https://twitter.com/sebnitu), [GitHub](https://github.com/sebnitu) and [Dribbble](http://dribbble.com/sebnitu).