var sylvester = require("sylvester");
var Matrix = sylvester.Matrix;

var sampleData = [
	[4,390],
	[9,580],
	[10,650],
	[14,730],
	[4,410],
	[7,530],
	[12,600],
	[22,790],
	[1,350],
	[3,400],
	[8,590],
	[11,640],
	[5,450],
	[6,520],
	[10,690],
	[11,690],
	[16,770],
	[13,700],
	[13,730],
	[10,640]
];

function createX(data) {
	var elements = [];
	for (var i=0;i<data.length;i++) {
		var row = [1];
		for (var j=0;j<data[i].length-1;j++) {
			row.push(data[i][j]);
		}
		elements.push(row);
	}
	return $M(elements);
}

function createY(data) {
	var elements = [];
	for (var i=0;i<data.length;i++) {
		var row = [data[i][data[i].length-1]];
		elements.push(row);
	}
	return $M(elements);
}

function calcTheta(x, y) {
	return ((x.transpose().multiply(x)).inverse()).multiply(x.transpose().multiply(y));
}

var X = createX(sampleData);
var Y = createY(sampleData);
var theta = calcTheta(X,Y);
console.log(theta.inspect());