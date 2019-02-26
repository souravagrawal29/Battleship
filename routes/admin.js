const db = require('../models/dbcon');

module.exports =  () => {
    let exp = {};

    exp.addquestion = (req,res) =>{
        if(req.method=='GET')
        	res.send('Inside add question');
        else if(req.method=='POST') {
        	let insertJson = {};
        	try {
        		insertJson['title'] = req.body['title'].toString().trim();
        		insertJson['body'] = req.body['body'].toString().trim();
        		insertJson['testcase1'] = req.body['testcase1'].toString().trim();
        		insertJson['testcase2'] = req.body['testcase2'].toString().trim();
        		insertJson['testcase3'] = req.body['testcase3'].toString().trim();
        		insertJson['answer1'] = req.body['answer1'].toString().trim();
        		insertJson['answer2'] = req.body['answer2'].toString().trim();
        		insertJson['answer3'] = req.body['answer3'].toString().trim();
        		insertJson['points'] = req.body['points'].toString().trim();
        		insertJson['constraints'] = req.body['constraints'].toString().trim();
        		insertJson['input_format'] = req.body['input_format'].toString().trim();
        		insertJson['output_format'] = req.body['output_format'].toString().trim();
        		insertJson['sample_input'] = req.body['sample_input'].toString().trim();
        		insertJson['sample_output'] = req.body['sample_output'].toString().trim();
        	} catch(err) {
        		console.log(err);
        		return res.status(500).send('Internal error');
        	}

        	db.query("INSERT INTO Questions SET ?",[insertJson],(err,result) => {
        		if(err) {
        			console.log(err);
        			return res.status(500).send('Internal error');
        		}
                console.log('Inserted successfully');
        		res.redirect('/questions');
        	});
        }        
    };

    exp.updatequestion = (req,res) =>{
        if(req.method=='GET') {
        	db.query('SELECT * FROM Questions WHERE qid = ?',[req.params.id],(err,results)=> {
        		if(err) {
        			console.log(err);
        			return res.status(500).send('Internal error');
        		}

        		if(results.length==0)
        			return res.status(404).send('Page not found');

        		/*res.render('updateQuestion', {
        			request: req,
        			question: result[0]
        		});*/
                res.send(results[0]);
        	});
        } 
        else if (req.method=='POST') {
        	let insertJson = {};
        	try {
        		insertJson['title'] = req.body['title'].toString().trim();
        		insertJson['body'] = req.body['body'].toString().trim();
        		insertJson['testcase1'] = req.body['testcase1'].toString().trim();
        		insertJson['testcase2'] = req.body['testcase2'].toString().trim();
        		insertJson['testcase3'] = req.body['testcase3'].toString().trim();
        		insertJson['answer1'] = req.body['answer1'].toString().trim();
        		insertJson['answer2'] = req.body['answer2'].toString().trim();
        		insertJson['answer3'] = req.body['answer3'].toString().trim();
        		insertJson['points'] = req.body['points'].toString().trim();
        		insertJson['constraints'] = req.body['constraints'].toString().trim();
        		insertJson['input_format'] = req.body['input_format'].toString().trim();
        		insertJson['output_format'] = req.body['output_format'].toString().trim();
        		insertJson['sample_input'] = req.body['sample_input'].toString().trim();
        		insertJson['sample_output'] = req.body['sample_output'].toString().trim();
        	} catch(err) {
        		console.log(err);
        		return res.status(500).send('Internal error');
        	}

        	db.query('UPDATE Questions SET ? WHERE qid = ?',[insertJson,req.params.id],(err,results) => {
                if(err) {
                    console.log(err);
                    return res.status(500).send('Internal server error');
                }
                console.log('Question updated');
                res.redirect('/questions');
            });
        }        
    };
    
    return exp;
};