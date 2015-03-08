function analyzeColumn(data) {
	var output = [];
	var numberOfColumns = data[0].length;
	for (var i=0;i<numberOfColumns;i++) {
		output.push({
			min: Number.MAX_VALUE,
			max: Number.MIN_VALUE,
			sum: 0
		});
	}
	for (var i=0;i<data.length;i++) {
		for (var j=0;j<numberOfColumns;j++) {
			output[j].min = Math.min(output[j].min, data[i][j]);
			output[j].max = Math.max(output[j].max, data[i][j]);
			output[j].sum += data[i][j];
		}
		for (var j=0;j<numberOfColumns;j++) {
			output[j].average = (output[j].sum / data.length);
		}
	}
	return output;
}

function scaling(data, columnData) {
	var output = [];
	var numberOfColumns = data[0].length;
	for (var i=0;i<data.length;i++) {
		var row = [];
		for (var j=0;j<numberOfColumns;j++) {
			var point = data[i][j];
			if (j != (numberOfColumns - 1)) {
				row.push((point - columnData[j].average)/(columnData[j].max - columnData[j].min));
			} else {
				row.push(point);
			}
		}
		output.push(row);
	}
	return output;
}

function prependX0(data) {
	for (var i=0;i<data.length;i++) {
		data[i].unshift(1);
	}
}

function log10(val) {
  return Math.log(val) / Math.LN10;
}

function gradientDescent(startPoint, learningRate, iterations, data) {
	var result = startPoint;
	var numberOfParam = data[0].length - 1;
	for (var r=0;r<iterations;r++) {
		//Find Theta
		var temp = [];
		for (var j=0;j<result.length;j++) {
			var sum = 0;
			for (var i=0;i<data.length;i++) {
				var hx = 0;
				for (var h=0;h<numberOfParam;h++) {
					hx += (result[h] * data[i][h]);
				}
				hx = 1 / (1 + Math.pow(Math.E, -1*hx));
				var y = data[i][data[i].length-1];
				sum += ((hx - y) * data[i][j]);
			}
			var change = ((learningRate * sum)/data.length);
			temp[j] = result[j] - change;
		}
		result = temp;

		//Find jTheta
		var sum = 0;
		for (var i=0;i<data.length;i++) {
			var hx = 0;
			var y = data[i][data[i].length-1];
			for (var h=0;h<numberOfParam;h++) {
				hx += result[h] * data[i][h];
			}
			hx = 1 / (1 + Math.pow(Math.E, -1*hx));			
			var cost = (y * log10(hx)) + ((1-y) * log10(1-hx));
			sum += cost;
		}
		var jTheta = -1 * (sum/(data.length));
		console.log(r+","+jTheta);
	}
	return result;
}

//Read sample data
var fs = require("fs");
var data = fs.readFileSync("new_data.csv",{encoding:"utf8"});
var lines = data.split('\n');
var sampleData = [];
for (var i=0;i<lines.length;i++) {
	if (lines[i] != "") {
		var row = [];
		var sp = lines[i].trim().split(',');
		for (var j=0;j<sp.length;j++) {
			row.push(parseFloat(sp[j]));
		}
		sampleData.push(row);		
	}
}

var learningRate = parseFloat(process.argv[2]);
var iterations = parseFloat(process.argv[3]);

var columnData = analyzeColumn(sampleData);
var scaledData = scaling(sampleData,columnData);
prependX0(scaledData);

var result = gradientDescent([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], learningRate, iterations, scaledData);
console.log("Result="+JSON.stringify(result));
console.log("Column="+JSON.stringify(columnData));