
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    CONFIG = require('config'),
    markdown = require('markdown').markdown,
    fs = require('fs'),
    path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only, always for now
app.use(express.errorHandler());

var tip_directory = path.join(__dirname, CONFIG.app.tip_directory);
var tip_files = fs.readdirSync(tip_directory);
var markdown_tips = [];

tip_files.forEach(function(file) {
    var read_options = {
        encoding: "utf8"
    }
    var full_path = path.join(tip_directory, file);
    var content = fs.readFileSync(full_path, read_options);
    rendered_file = markdown.toHTML(content);
    markdown_tips.push(rendered_file);
});

app.get('/', function(req, res) {
    context = {
        title: 'Ann Arbor Protips',
        tip: markdown_tips[0]
    }
    res.render('index.jade', context);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
