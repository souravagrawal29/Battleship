const db = require('../models/dbcon');
const grid = require('../grid/loadgrid');

module.exports =  () => {
    let exp = {};

    exp.addquestion = (req,res) => {
        if (req.method == 'GET')
        	return res.render('layouts/addQuestion');
        else if (req.method == 'POST') {
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
				return res.render('error',{
					error: 500,
					message: 'Internal Server Error'
				});
        	}

        	db.query("INSERT INTO Questions SET ?", [insertJson], (err, result) => {
        		if(err) {
					console.log(err);
					return res.render('error',{
						error: 500,
						message: 'Internal Server Error'
					});
        		}
                console.log('Inserted successfully');
        		return res.redirect('/questions');
        	});
        }        
    };

    exp.updatequestion = (req,res) =>{
        if(req.method=='GET') {
        	db.query('SELECT * FROM Questions WHERE qid = ?',[req.params.id],(err,results)=> {
        		if(err) {
        			console.log(err);
        			return res.render('error',{
						error: 500,
						message: 'Internal Server Error'
					});
        		}

        		if(results.length==0)
        			return res.status(404).send('Page not found');

        		return res.render('layouts/editQuestion', {
        			request: req,
        			question: results[0]
        		});
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
        		return res.render('error',{
					error: 500,
					message: 'Internal Server Error'
				});
        	}

        	db.query('UPDATE Questions SET ? WHERE qid = ?',[insertJson,req.params.id],(err,results) => {
                if(err) {
                    console.log(err);
                    return res.render('error',{
						error: 500,
						message: 'Internal Server Error'
					});
                }
                console.log('Question updated');
                return res.redirect('/questions');
            });
        }
    };

    exp.initgrid = (req, res) => {
        grid.refreshgrid()
        .then(grid.load());
        return res.status(200).send('Grid Loaded');
	}
	
	exp.viewships = (req,res)=>{
		db.query('SELECT * FROM Grid', (err,result)=>{
			if(err){
				console.log(err);
				return res.render('error',{
					error: 500,
					message: 'Internal Server Error'
				});
			}
			return res.status(200).send(result);
		});
	};
    
    return exp;
};