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
            console.log(result);
            console.log(req.user[0].uid);
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

    //viewing a particular question
    exp.questionbyid = (req,res) => {
        //res.send('viewing a question');
        db.query('SELECT * FROM Questions WHERE qid = ?',[req.params.id],(err,results)=> {
                if(err) {
                    console.log(err);
                    return res.status(500).send('Internal error');
                }

                if(results.length==0)
                    return res.status(404).send('Page not found');

                /*res.render('editQuestion', {
                    request: req,
                    question: results[0]
                });*/
                res.send(results[0]);
            });
    };

    return exp;
};