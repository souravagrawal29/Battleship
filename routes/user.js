const db = require('../models/dbcon');

module.exports = () => {
    let exp = {};

    //instuctions page
    exp.home = (req, res) => {
        //return res.status(200).send('In the Rules page');
        return res.render('layouts/rules');
    };

    //main homepage
    exp.questions = (req, res) => {
        db.query('SELECT Questions.*,QLogs.uid,QLogs.solved,QLogs.attempt_no from Questions LEFT OUTER JOIN QLogs on Questions.qid=QLogs.qid AND QLogs.uid = ? ORDER BY Questions.qid ASC', [req.user.uid], (err, result) => {
            if (err) {
                console.log(err);
                return res.render('layouts/error',{
                    error: 500,
                    message: 'Internal Server Error'
                });
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
            return res.render('layouts/questions', {
                questions: questions,
                request: req
            });
        });
    };

    exp.battleship = (req,res) =>{
        return res.render('layouts/grid',{
            request:req
        });
    };

    //grid 
    exp.battleshipjson = (req, res) => {
        db.query('SELECT row, col, isactive FROM Grid WHERE uid = ?', [req.user.uid], (err, ships) => {
            if (err) {
                console.log(err);
                return res.render('layouts/error',{
                    error: 500,
                    message: 'Internal Server Error'
                });
            }

            if (ships.length == 0)
                return res.status(500).send('No Ships Found');

            db.query('SELECT row, col, hit FROM Shiplogs WHERE uid = ? ORDER BY logtime ASC', [req.user.uid], (err, fired) => {
                if (err) {
                    console.log(err);
                    return res.render('layouts/error',{
						error: 500,
						message: 'Internal Server Error'
					});
                }
                return res.json({
                    ships: ships,
                    fired : fired
                });
            });
        });
    };

    //viewing a question
    exp.questionbyid = (req, res) => {
        db.query('SELECT qid,title,body,testcase1,testcase2,testcase3,points,constraints,input_format,output_format,sample_input,sample_output FROM Questions WHERE qid = ?', [req.params.id], (err, results) => {
            if (err) {
                console.log(err);
                return res.render('layouts/error',{
                    error: 500,
                    message: 'Internal Server Error'
                });
            }
            if (results.length == 0){
                return res.render('layouts/error',{
                    error: 404,
                    message: 'Page Not Found'
                });
            }
            db.query('SELECT * FROM QLogs where qid = ? and uid = ?', [req.params.id, req.user.uid], (err, log) => {
                if (err) {
                    console.log(err);
                    return res.render('layouts/error',{
						error: 500,
						message: 'Internal Server Error'
					});
                }
                let testcase = '';
                let diff = '';
                if(results[0].points==50)
                    diff = 'EASY';
                else if(results[0].points==100)
                    diff = 'MEDIUM';
                else if(results[0].points==200)
                    diff = 'HARD';
                if (log.length == 0) {
                    testcase = results[0].testcase1;
                    return res.render('layouts/questionid', {
                        question: results[0],
                        request: req,
                        testcase: testcase,
                        diff: diff
                    });
                }
                else if (log.length == 1) {
                    if (log[0].solved == 1)
                        testcase = 'You have already solved this question';
                    else if (log[0].attempt_no == 1)
                        testcase = results[0].testcase2;
                    else if (log[0].attempt_no == 2)
                        testcase = results[0].testcase3;
                    else
                        testcase = 'You have exhausted all your tries';
                    return res.render('layouts/questionid', {
                        question: results[0],
                        request: req,
                        testcase: testcase,
                        diff: diff
                    });
                }
                else {
                    return res.render('layouts/error',{
						error: 500,
						message: 'Internal Server Error'
					});
                }
            });
        });
    };

    //submit
    exp.submit = (req, res) => {
        db.query('SELECT * FROM QLogs WHERE uid = ? AND qid = ?', [req.user.uid, req.body.question], (err, result) => {
            if (err) {
                console.log(err);
                return res.render('layouts/error',{
                    error: 500,
                    message: 'Internal Server Error'
                });
            }
            db.query('SELECT * FROM Questions WHERE qid = ?', [req.body.question], (err, question) => {
                if (err) {
                    console.log(err);
                    return res.render('layouts/error',{
						error: 500,
						message: 'Internal Server Error'
					});
                }
                if (result.length == 0) {
                    let correct = false;
                    if (question[0].answer1.trim() == req.body.answer.trim())
                        correct = true;
                    if (correct) {
                        let missiles = 1;
                        if (question[0].points == 100)
                            missiles = 2;
                        else if(question[0].points == 200)
                            missiles = 4;
                        db.query('UPDATE Users SET score = score + ?, missile = missile + ? WHERE uid = ?', [question[0].points, missiles, req.user.uid], (err, upd) => {
                            if (err) {
                                console.log(err);
                                return res.render('layouts/error',{
                                    error: 500,
                                    message: 'Internal Server Error'
                                });
                            }
                            db.query('INSERT INTO QLogs VALUES (?,?,1,1,NOW())', [req.user.uid, req.body.question], (err, ins) => {
                                if (err) {
                                    console.log(err);
                                    return res.render('layouts/error',{
                                        error: 500,
                                        message: 'Internal Server Error'
                                    });
                                }
                                return res.json({
                                    status: 1,
                                    message: 'Correct Answer :)'
                                });
                            });
                        });
                    } else {
                        db.query('INSERT INTO QLogs VALUES (?,?,0,1,NOW())', [req.user.uid, req.body.question], (err, ins) => {
                            if (err) {
                                console.log(err);
                                return res.render('layouts/error',{
                                    error: 500,
                                    message: 'Internal Server Error'
                                });
                            }
                            return res.json({
                                status: 2,
                                message: 'Wrong Answer :('
                            });
                        });
                    }
                } else if (result.length == 1) {
                    if (result[0].solved == 1)
                        return res.json({
                            status: 3,
                            message: 'You have already solved this question'
                        });
                    if (result[0].attempt_no > 2)
                        return res.json({
                            status: 4,
                            message: 'You have exhausted all tries'
                        });
                    let correct = false;
                    if (result[0].attempt_no == 1 && question[0].answer2.trim() == req.body.answer.trim())
                        correct = true;
                    else if (result[0].attempt_no == 2 && question[0].answer3.trim() == req.body.answer.trim())
                        correct = true;
                    if (correct) {
                        let missiles = 1;
                        if (question[0].points == 100)
                            missiles = 2;
                        else if(question[0].points == 200)
                            missiles = 4;
                        db.query('UPDATE Users SET score = score + ?, missile = missile + ? WHERE uid = ?', [question[0].points, missiles, req.user.uid], (err, corr) => {
                            if (err) {
                                console.log(err);
                                return res.render('layouts/error',{
                                    error: 500,
                                    message: 'Internal Server Error'
                                });
                            }
                            db.query('UPDATE QLogs SET attempt_no = attempt_no+1, solved = 1 WHERE qid = ? AND uid = ?', [req.body.question, req.user.uid], (err, update) => {
                                if (err) {
                                    console.log(err);
                                    return res.render('layouts/error',{
                                        error: 500,
                                        message: 'Internal Server Error'
                                    });
                                }
                                return res.json({
                                    status: 1,
                                    message: 'Correct Answer :)'
                                });
                            });
                        });
                    } else {
                        db.query('UPDATE QLogs SET attempt_no = attempt_no+1 WHERE qid = ? AND uid = ?', [req.body.question, req.user.uid], (err, update) => {
                            if (err) {
                                console.log(err);
                                return res.render('layouts/error',{
                                    error: 500,
                                    message: 'Internal Server Error'
                                });
                            }
                            return res.json({
                                status: 2,
                                message: 'Wrong Answer :('
                            });
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
                return res.render('layouts/error',{
                    error: 500,
                    message: 'Internal Server Error'
                });
            }

            if (result.length == 0)
                return res.json({
                    status: 1,
                    message: 'Your ship doesnt exist in the given coordinates'
                });

            if (result[0].isactive == 1)
                return res.json({
                    status: 2,
                    message: 'Ship is already active'
                });

            db.query('UPDATE Users SET missile = missile-1 WHERE missile >= 1 AND uid = ?', [req.user.uid], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.render('layouts/error',{
						error: 500,
						message: 'Internal Server Error'
					});
                }
                if (result.affectedRows == 0)
                    return res.json({
                        status: 3,
                        message:'Insufficient Missiles'
                    });
                db.query('UPDATE Grid SET isactive = 1 WHERE row = ? AND col = ? AND uid = ?', [req.body.row, req.body.col, req.user.uid], (err, actv) => {
                    if (err) {
                        console.log(err);
                        return res.render('layouts/error',{
                            error: 500,
                            message: 'Internal Server Error'
                        });
                    }

                    return res.json({
                        status: 4,
                        message: 'Ship revived'
                    });
                });
            });
        });
    };

    //hit or miss 
    exp.hit = (req, res) => {
        db.query('SELECT * FROM Grid WHERE uid = ? AND isactive = 1 ', [req.user.uid], (err, ship) => {
            if (err) {
                console.log(err);
                return res.render('layouts/error',{
                    error: 500,
                    message: 'Internal Server Error'
                });
            }
            if (ship.length == 0)
                return res.json({
                    status: 1,
                    message: 'You need to revive your ship'
                });
            db.query('SELECT * FROM Grid WHERE row = ? AND col = ?', [req.body.row, req.body.col], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.render('layouts/error',{
						error: 500,
						message: 'Internal Server Error'
					});
                }
                if (result.length == 0 || (result.length == 1 && result[0].isactive == 0 && result[0].uid!= req.user.uid)) {
                    db.query('UPDATE Users SET missile = missile -1 WHERE missile >= 1 AND uid = ?', [req.user.uid], (err, upd) => {
                        if (err) {
                            console.log(err);
                            return res.render('layouts/error',{
                                error: 500,
                                message: 'Internal Server Error'
                            });
                        }
                        if (upd.affectedRows == 0)
                            return res.json({
                                status: 4,
                                message: 'Insufficient Missiles'
                            });
                        db.query('INSERT INTO Shiplogs VALUES (?, ?, ?, 0, NOW())', [req.user.uid, req.body.row, req.body.col], (err, ins) => {
                            if (err) {
                                console.log(err);
                                return res.render('layouts/error',{
                                    error: 500,
                                    message: 'Internal Server Error'
                                });
                            }
                            return res.json({
                                status: 2,
                                message: 'Miss :( No Ship present'
                            });
                        });
                    });
                }
                else if (result.length == 1 && result[0].uid == req.user.uid)
                    return res.json({
                        status: 3,
                        message: 'You cannot hit your own ship'
                    });
                else if (result.length == 1 && result[0].uid != req.user.uid) {
                    db.query('UPDATE Users SET missile = missile-1, score = score + 75 WHERE missile >= 1 AND uid = ?', [req.user.uid], (err, upd) => {
                        if (err) {
                            console.log(err);
                            return res.render('layouts/error',{
                                error: 500,
                                message: 'Internal Server Error'
                            });
                        }
                        if (upd.affectedRows == 0)
                            return res.json({
                                status: 4,
                                message: 'Insufficient Missiles'
                            });
                        db.query('INSERT INTO Shiplogs VALUES (?, ?, ?, 1, NOW())', [req.user.uid, req.body.row, req.body.col], (err, ins) => {
                            if (err) {
                                console.log(err);
                                return res.render('layouts/error',{
                                    error: 500,
                                    message: 'Internal Server Error'
                                });
                            }
                            db.query('UPDATE Grid SET isactive = 0 WHERE row = ? AND  col = ?', [req.body.row, req.body.col], (err, gridupd) => {
                                if (err) {
                                    console.log(err);
                                    return res.render('layouts/error',{
                                        error: 500,
                                        message: 'Internal Server Error'
                                    });
                                }
                                return res.json({
                                    status: 5,
                                    message: 'Hit :)'
                                });
                            });
                        });
                    });
                }
            });
        });
    };


    return exp;
}