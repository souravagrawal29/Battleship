const db = require('../models/dbcon');

module.exports = () => {
    let exp = {};

    //instuctions page
    exp.home = (req, res) => {
        //return res.status(200).send('In the Rules page');
        res.render('layouts/rules');
    };

    //main homepage
    exp.questions = (req, res) => {
        db.query('SELECT Questions.*,QLogs.uid,QLogs.solved,QLogs.attempt_no from Questions LEFT OUTER JOIN QLogs on Questions.qid=QLogs.qid AND QLogs.uid = ? ORDER BY QLogs.solved ASC', [req.user.uid], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }
            questions = [];
            for (let i = 0; i < result.length; i++) {
                let que = {};
                if (result[i].attempt_no != null && result[i].solved == 0)
                    result[i].attempt_no = 3 - result[i].attempt_no;
                else if (result[i].attempt_no != null && result[i].solved == 1)
                    result[i].attempt_no = null;
                else if (!result[i].attempt_no)
                    result[i].attempt_no = 3;
                que.qid = result[i].qid;
                que.title = result[i].title;
                que.points = result[i].points;
                que.solved = result[i].solved;
                que.attempt_no = result[i].attempt_no;
                questions.push(que);
            }
            res.render('layouts/questions', {
                questions: questions,
                request: req
            });
        });
    };

    //grid 
    exp.battleship = (req, res) => {

        db.query('SELECT row, col, isactive FROM Grid WHERE uid = ?', [req.user.uid], (err, ships) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }

            if (ships.length == 0)
                return res.status(500).send('No Ships Found');

            db.query('SELECT row, col, hit FROM Shiplogs WHERE uid = ?', [req.user.uid], (err, fired) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Internal Server Error');
                }

                let result = { ships, fired };

                return res.status(200).send(result);
            });
        });
    };

    //viewing a question
    exp.questionbyid = (req, res) => {
        db.query('SELECT qid,title,body,testcase1,testcase2,testcase3,points,constraints,input_format,output_format,sample_input,sample_output FROM Questions WHERE qid = ?', [req.params.id], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Internal error');
            }
            if (results.length == 0)
                return res.status(404).send('Page not found');
            db.query('SELECT * FROM QLogs where qid = ? and uid = ?', [req.params.id, req.user.uid], (err, log) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Internal Server Error');
                }
                if (log.length == 0) {
                    testcase = results[0].testcase1;
                    ques = {
                        question: results[0],
                        testcase: testcase
                    };
                    return res.status(200).send(ques);
                } else if (log.length == 1) {
                    if (log[0].solved == 1)
                        testcase = 'You have already solved this question';
                    if (log[0].attempt_no == 1)
                        testcase = results[0].testcase2;
                    else if (log[0].attempt_no == 2)
                        testcase = results[0].testcase3;
                    else
                        testcase = 'You have exhausted all your tries';
                    let ques;
                    ques = {
                        question: results[0],
                        testcase: testcase
                    };
                    return res.status(200).send(ques);
                } else {
                    return res.status(500).send('Internal Server Error');
                }
            });
        });
    };

    //submit
    exp.submit = (req, res) => {
        db.query('SELECT * FROM QLogs WHERE uid = ? AND qid = ?', [req.user.uid, req.body.question], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }
            db.query('SELECT * FROM Questions WHERE qid = ?', [req.body.question], (err, question) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Internal Server Error');
                }
                if (result.length == 0) {
                    let correct = false;
                    if (question[0].answer1.trim() == req.body.answer.trim())
                        correct = true;
                    if (correct) {
                        let missiles = 1;
                        if (question[0].points == 100)
                            missiles = 2;
                        db.query('UPDATE Users SET score = score + ?, missile = missile + ? WHERE uid = ?', [question[0].points, missiles, req.user.uid], (err, upd) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).send('Internal Server Error');
                            }
                            db.query('INSERT INTO QLogs VALUES (?,?,1,1,NOW())', [req.user.uid, req.body.question], (err, ins) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send('Internal Server Error');
                                }
                                return res.status(200).send('Correct Answer')
                            });
                        });
                    } else {
                        db.query('INSERT INTO QLogs VALUES (?,?,0,1,NOW())', [req.user.uid, req.body.question], (err, ins) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).send('Internal Server Error');
                            }
                            return res.status(200).send('Wrong Answer');
                        });
                    }
                } else if (result.length == 1) {
                    if (result[0].solved == 1)
                        return res.status(200).send('You have already solved this question');
                    if (result[0].attempt_no > 2)
                        return res.status(200).send('You have exhausted all tries');
                    let correct = false;
                    if (result[0].attempt_no == 1 && question[0].answer2.trim() == req.body.answer.trim())
                        correct = true;
                    else if (result[0].attempt_no == 2 && question[0].answer3.trim() == req.body.answer.trim())
                        correct = true;
                    if (correct) {
                        let missiles = 1;
                        if (question[0].points == 100)
                            missiles = 2;
                        db.query('UPDATE Users SET score = score + ?, missile = missile + ? WHERE uid = ?', [question[0].points, missiles, req.user.uid], (err, corr) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).send('Internal Server Error');
                            }
                            db.query('UPDATE QLogs SET attempt_no = attempt_no+1, solved = 1 WHERE qid = ? AND uid = ?', [req.body.question, req.user.uid], (err, update) => {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).send('Internal Server Error');
                                }
                                return res.status(200).send('Correct Answer');
                            });
                        });
                    } else {
                        db.query('UPDATE QLogs SET attempt_no = attempt_no+1 WHERE qid = ? AND uid = ?', [req.body.question, req.user.uid], (err, update) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).send('Internal Server Error');
                            }
                            return res.status(200).send('Wrong Answer');
                        });
                    }
                }
            });
        });
    };

    // revive a ship block
    exp.revive = (req, res) => {
        db.query('SELECT * FROM Grid WHERE row = ? AND col = ? AND uid = ?', [req.body.row, req.body.col, req.user.uid], (err, result) => {
            if (err) {
                console.log(err);
                return res.status.send('Internal Server Error');
            }

            if (result.length == 0)
                return res.status(200).send('Your ship doesnt exist in the given coordinates');

            if (result[0].isactive == 1)
                return res.status(200).send('Ship is already active');

            db.query('UPDATE Users SET missile = missile-1 WHERE missile >= 1 AND uid = ?', [req.user.uid], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Internal Server Error');
                }

                if (result.affectedRows == 0)
                    return res.status(200).send('Insufficient Missiles');

                db.query('UPDATE Grid SET isactive = 1 WHERE row = ? AND col = ? AND uid = ?', [req.body.row, req.body.col, req.user.uid], (err, actv) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send('Internal Server Error');
                    }

                    return res.status(200).send('Ship block revived');
                });
            });
        });
    };

    //hit or miss 
    exp.hit = (req,res) =>{
        db.query('SELECT * FROM Grid WHERE uid = ? AND isactive = 1 ',[req.user.uid],(err,ship) =>{
            if(err){
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }
            if(ship.length==0)
                return res.status(200).send('You need to revive your ship');
            
            db.query('SELECT * FROM Grid WHERE row = ? AND col = ?',[req.body.row,req.body.col],(err,result)=>{
                if(err){
                    console.log(err);
                    return res.status(500).send('Internal Server Error');
                }
                if(result.length==0 || (result.length ==1 && result[0].isactive==0)){
                    db.query('UPDATE Users SET missile = missile -1 WHERE missile >= 1 AND uid = ?',[req.user.uid],(err,upd)=>{
                        if(err){
                            console.log(err);
                            return res.status(500).send('Internal Server Error');
                        }
                        if(upd.affectedRows==0)
                            return res.status(200).send('Insufficient Missiles');
                        db.query('INSERT INTO Shiplogs VALUES (?, ?, ?, 0, NOW())',[req.user.uid,req.body.row,req.body.col],(err,ins)=>{
                            if(err){
                                console.log(err);
                                return res.status(500).send('Internal Server Error');
                            }
                            return res.status(200).send('Miss :( No Ship present');
                        });
                    });
                }
                else if(result.length == 1 && result[0].uid == req.user.uid)
                    return res.status(200).send('You cannot hit your own ship');
                else if(result.length == 1 && result[0].uid!= req.user.uid){
                    db.query('UPDATE Users SET missile = missile -1 AND score = score + 10 WHERE missile >= 1 AND uid = ?',[req.user.uid],(err,upd)=>{
                        if(err){
                            console.log(err);
                            return res.status(500).send('Internal Server Error');
                        }
                        if(upd.affectedRows==0)
                            return res.status(200).send('Insufficient Missiles');
                        db.query('INSERT INTO Shiplogs VALUES (?, ?, ?, 1, NOW())',[req.user.uid,req.body.row,req.body.col],(err, ins) =>{
                            if(err){
                                console.log(err);
                                return res.status(500).send('Internal Server Error');
                            }
                            db.query('UPDATE Grid SET isactive = 0 WHERE row = ? AND  col = ?',[req.body.row,req.body.col],(err,gridupd) =>{
                                if(err){
                                    console.log(err);
                                    return res.status(500).send('Internal Server Error');
                                }
                                return res.status(200).send('Hit :)');
                            });
                        });
                    });
                }
            });
        });
    };



    return exp;
}