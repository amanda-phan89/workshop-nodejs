var list = [1,2,3,4,5,6,7,8,9,10];

for (var i = 0; i< list.length; i++) {
  var number = list[i];
  getTypeOfNumber(number, function (number, type) {
    console.log('The number ' + number + ' is ' + type);
  }.bind(null, number));
}

function getTypeOfNumber (number, callback) {
  setTimeout(function() {
    var type = (number % 2) ? 'odd' : 'even';
    callback(type);
  }, 100);
}
