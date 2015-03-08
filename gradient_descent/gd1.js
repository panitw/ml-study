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
			row.push((point - columnData[j].average)/(columnData[j].max - columnData[j].min));
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
				sum += ((hx - data[i][data[i].length-1]) * data[i][j]);
			}
			var change = ((learningRate * sum)/data.length);
			temp[j] = result[j] - change;
		}
		result = temp;

		//Find jTheta
		var sum = 0;
		for (var i=0;i<data.length;i++) {
			var hx = 0;
			for (var h=0;h<numberOfParam;h++) {
				hx += result[h] * data[i][h];
			}
			sum += Math.pow((hx - data[i][data[i].length-1]), 2);
		}
		var jTheta = sum/(2*data.length);
		console.log(r+","+jTheta+"  "+result[0].toFixed(8)+","+result[1].toFixed(8));
	}
	return result;
}

var learningRate = parseFloat(process.argv[2]);
var iterations = parseFloat(process.argv[3]);

var columnData = analyzeColumn(sampleData);
var scaledData = scaling(sampleData,columnData);
prependX0(scaledData);

var result = gradientDescent([0,0], learningRate, iterations, scaledData);
console.log("Result="+JSON.stringify(result));
console.log("Column="+JSON.stringify(columnData));