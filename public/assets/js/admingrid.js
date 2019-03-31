const n = 11;
var cl = 'ships';
var select;

var comm = '../images/';

for (let r = 1; r <= n; r++) {
    var col = "";
    for (let c = 1; c <= n; c++) {
        let id = r * n + c;
        col += "<td onClick=getRowCol(this) id='" + id + "'></td>";
    }
    $("#grid").append("<tr>" + col + "</tr>");
}

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

fetch('/viewshipsjson',{
    method: 'GET',
    headers: { 'Content-Type': 'application/json'}
})
    .then(res =>{
        return res.json();
    }).then((data) =>{
        for(let i=0; i < data.ships.length; i++){
            let uni = data.ships[i].row * n + data.ships[i].col;
            let sh,imag;
            let num = data.ships[i].uid;
            if (data.ships[i].isactive == 1){
                imag = comm + num + '.png';
                sh = "<td onClick=getRowCol(this) id='" + uni + "'><img src='" + imag + "' class='" + cl + "'></td>";
            }
            else {
                imag = comm + num + 'x.png';
                sh = "<td onClick=getRowCol(this) id='" + uni + "'><img src='" + imag + "' class='" + cl + "'></td>";
            }
            document.getElementById(uni).innerHTML = sh;
        }
    })
    .catch((err) =>{ console.log(err) });; 