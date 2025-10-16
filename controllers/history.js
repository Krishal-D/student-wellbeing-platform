import {pool} from '../config/db.js';

export async function show(req, res, next){
    
    try{

        // get the userId from the middleware
        const user_id = req.user.userId;
        const result = await pool.query(
            'SELECT id, mood_score, notes, created_at FROM mood WHERE user_id = $1 ORDER BY created_at DESC',
            [user_id]
        );

        // convert to AU/Sydney timezone
        const moods = result.rows.map((mood) => {
            const localTime = new Date(mood.created_at).toLocaleString('en-AU', {timeZone: 'Australia/Sydney'});
            return {...mood, created_at: localTime};
        });

        res.render('history', {
            title: 'Mood History Page', 
            moods});

    }  catch (err) {
        console.error('Database error: ', err);
        res.status(500).send('Server error');
    }  
}