const db = require('../models/dbcon');

module.exports =  () =>{
    let exp = {};

    //instuctions page
    exp.home = (req,res) =>{
        res.send('In the Rules page');
    };

    //main homepage
    exp.questions = (req,res) =>{
        db.query('SELECT Questions.*,QLogs.uid,QLogs.solved,QLogs.attempt_no from Questions LEFT OUTER JOIN QLogs on Questions.qid=QLogs.qid AND QLogs.uid = ? ORDER BY QLogs.solved ASC',[req.user[0].uid], (err,result) =>{
            if(err){
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }
            let quesarr = [];
            quesarr.push(req.user[0].uid);
            quesarr.push(req.user[0].score);
            quesarr.push(req.user[0].missile);
            for(let i=0;i<result.length;i++){
                let ques={};
                if(result[i].attempt_no!=null && result[i].solved ==0)
                    result[i].attempt_no=3-result[i].attempt_no;
                else if(result[i].attempt_no!=null && result[i].solved==1)
                    result[i].attempt_no=null;
                else if(!result[i].attempt_no)
                    result[i].attempt_no=3;
                ques.qid = result[i].qid;
                ques.title = result[i].title;
                ques.points = result[i].points;
                ques.solved = result[i].solved;
                ques.attempt_no = result[i].attempt_no;
                quesarr.push(ques);
            }
            res.send(quesarr);
        });
    };

    //grid 
    exp.battleship = (req,res) =>{

        db.query('SELECT row,col,isactive from Grid WHERE uid=?',[req.user[0].uid],(err,ships)=>{
            if(err){
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }
            if(ships.length==0)
                return res.status(500).send('Internal Server Error');
            db.query('SELECT row,col,hit from Shiplogs WHERE uid=?',[req.user[0].uid],(err,fired) =>{
                if(err){
                    console.log(err);
                    return res.status(500).send('Internal Server Error');
                }
                let result = {ships, fired};
                return res.json(result);
            });
        });
    };

    //viewing a question
    exp.questionbyid = (req,res) => {
        db.query('SELECT qid,title,body,testcase1,testcase2,testcase3,points,constraints,input_format,output_format,sample_input,sample_output FROM Questions WHERE qid = ?',[req.params.id],(err,results)=> {
                if(err) {
                    console.log(err);
                    return res.status(500).send('Internal error');
                }
                if(results.length==0)
                    return res.status(404).send('Page not found');
                db.query('SELECT * FROM QLogs where qid = ? and uid = ?',[req.params.id,req.user[0].uid],(err,log)=>{
                    if(err){
                        console.log(err);
                        return res.status(500).send('Internal Server Error');
                    }
                    console.log(log);
                    if(log.length==0){
                        testcase = results[0].testcase1;
                        ques={
                            question: results[0],
                            testcase: testcase
                        };
                        return res.status(200).send(ques);
                    }
                    else if(log.length==1){
                        if(log[0].solved==1)
                            testcase = 'You have already solved this question';
                        if(log[0].attempt_no==1)
                            testcase = results[0].testcase2;
                        else if(log[0].attempt_no==2)
                            testcase = results[0].testcase3;
                        else 
                            testcase = 'You have exhausted all your tries';
                        let ques;
                        ques={
                            question: results[0],
                            testcase: testcase
                        };
                        return res.status(200).send(ques);
                    }
                    else {
                        res.status(500).send('Internal Server Error');
                    }
                });
            });
    };

    return exp;
};