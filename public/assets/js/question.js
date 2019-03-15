
const submit = () =>{
    if(confirm('Are you sure, you want to submit?')){
        var ans = document.getElementById('ans').value.trim();
        var ques = document.getElementById('ques').innerHTML;
        const body = {};
        body.question = ques;
        body.answer = ans;
        fetch('/submit', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then(data =>{
            if(data.status ==1){
                alert(data.message);
                window.location.href = '/questions';
            }
            else if (data.status == 2){
                alert(data.message);
                location.reload();
            }
            else{
                alert(data.message);
                window.location.href = '/questions';
            }
        })
        .catch(err=> console.log(err));
    }
};