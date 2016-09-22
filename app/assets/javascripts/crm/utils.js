var newlineRegex = /(\r\n|\n\r|\r|\n)/g;

nl2br = function(str) {
  if (typeof str != 'string') {
    throw new TypeError('nl2br requires string');
  }
  return str.split(newlineRegex).map(function(line) {
    if (line.match(newlineRegex)) {
      return React.createElement('br', {key: "br_"+String(Math.random())});
    } else {
      return line;
    }
  });
};
function scrollTo(e){
  $("html, body").animate({scrollTop: $(e).offset().top}, 'fast');
}