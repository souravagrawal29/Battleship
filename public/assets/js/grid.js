const n = 11;
var cl = 'ships';
var select;

var shp = '../images/ship.jpg';
var shpin = '../images/shipin1.jpg'
var miss = '../images/miss.jpg';
var hiti = '../images/hit.jpg';

fetch('/battleship.json', {
	method: 'GET',
	headers: { 'Content-Type': 'application/json' }
})
	.then(res => {
		return res.json();
	}).then((data) => {
		for (let r = 1; r <= n; r++) {
			var col = "";
			for (let c = 1; c <= n; c++) {
				let id = r * n + c;
				col += "<td onClick=getRowCol(this) id='" + id + "'></td>";
			}
			$("#grid").append("<tr>" + col + "</tr>");
		}
		for (i = 0; i < data.ships.length; i++) {
			let uni = data.ships[i].row * n + data.ships[i].col;
			let sh;
			if (data.ships[i].isactive == 1)
				sh = "<td onClick=getRowCol(this) id='" + uni + "'><img src='" + shp + "' class='" + cl + "'></td>";
			else
				sh = "<td onClick=getRowCol(this) id='" + uni + "'><img src='" + shpin + "' class='" + cl + "'></td>"
			document.getElementById(uni).innerHTML = sh;
		}
		for (i = 0; i < data.fired.length; i++) {
			let uni = data.fired[i].row * n + data.fired[i].col;
			let ig;
			if (data.fired[i].hit == 1)
				ig = "<td onClick=getRowCol(this) id='" + uni + "'><img src='" + hiti + "' class='" + cl + "'></td>";
			else if (data.fired[i].hit == 0)
				ig = "<td onClick=getRowCol(this) id='" + uni + "'><img src='" + miss + "' class='" + cl + "'></td>";
			document.getElementById(uni).innerHTML = ig;
		}
	})
	.catch((err) => { console.log(err) });

const getRowCol = (ele) => {
	select = ele;
	for (let r = 1; r <= n; r++) {
		for (let c = 1; c <= n; c++) {
			let uni = r * n + c;
			document.getElementById(uni).style.background = '#4c5c96';
		}
	}
	document.getElementById(ele.id).style.background = 'rgba(53, 56, 73, 0.95)';
}

const hit = () => {
	if (confirm('Are you sure, you want to make the hit?')) {
		let row, col;
		var uni = select.id;
		for (c = 1; c <= n; c++) {
			let temp;
			temp = uni - c;
			if (temp % n == 0) {
				row = temp / n;
				col = c;
				break;
			}
		}
		const body = {};
		body.row = row;
		body.col = col;
		fetch('/hit', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		})
		.then(res => res.json())
		.then(data => {
			alert(data.message);
			location.reload();
		})
		.catch((err) => console.log(err));
	}
}


const revive = () => {
	if(confirm('Are you sure, you want to revive your ship?')){
		let row, col;
		var uni = select.id;
		for (c = 1; c <= n; c++) {
			let temp;
			temp = uni - c;
			if (temp % n == 0) {
				row = temp / n;
				col = c;
				break;
			}
		}
		const body = {};
		body.row = row;
		body.col = col;
		fetch('/revive', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		})
		.then(res => res.json())
		.then(data => {
			alert(data.message);
			location.reload();
		})
		.catch((err) => console.log(err));
		console.log('In revive route');
	}
}
