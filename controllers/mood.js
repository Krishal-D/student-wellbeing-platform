import {pool} from '../config/db.js';

export async function show(req, res, next){
    res.render('mood', {title: 'Mood Track Page'});
}

export async function submit(req, res, next){
    try{
        const {mood_score, notes} = req.body;

        // validation for the mood score
        const score = parseInt(mood_score);
        if (isNaN(score) || score < 1 || score > 5){
            return res.status(400).send('Invalid mood score');
        }

        const user_id = 1; // update later after the login is setup

        // save to database
        await pool.query(
            'INSERT INTO mood (user_id, mood_score, notes) VALUES ($1, $2, $3)',
            [user_id, mood_score, notes]
        ); 

        console.log('✅Mood score received-appreciatte you checking in.', {mood_score});
        

        // different message output based on the mood score
        let message ='';
        switch (parseInt(mood_score)) {
            case 1:
                message = "😢 It seems like you are feeling a bit off today. Reach out to someone close might bring some comfort.";
                break;
            case 2:
                message = "🙁 It seems like you are feeling a little low today. Step back and spend time doing something that help lift up your mood.";
                break;
            case 3:
                message = "😐 Feeling neutral today - hold onto that balance and move gently through your moments.";
                break;
            case 4:
                message = "😀 It is lovely to see you in such a good mood today. Keep holding onto that positive energy.";
                break;
            case 5:
                message = "😄 It is wonderful to see you in such high spirits today. Keep that joy flowing.";
                break;
        }

        //  feedback with mood message
        res.render('moodFeedback', {title: 'Mood Submitted Page', message: message});

    } catch (err) {
        console.error('Database error: ', err);
        res.status(500).send('Server error');
    }   


}

export async function alertCheck(req, res, user_id) {
    try {
        
    } catch (err) {
        console.error('Database error: ', err);
        res.status(500).send('Server error');
    }
}