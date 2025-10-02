import {pool} from '../config/db.js';

export async function show(req, res, next){
    try{
        const user_id = 1; // update later after the login is setup
        const result = await pool.query(
            'SELECT id, mood_score, notes, created_at FROM mood WHERE user_id = $1 ORDER BY created_at DESC',
            [user_id]
        );
        const moods = result.rows;
        res.render('history', {title: 'Mood History Page', moods});
    }  catch (err) {
        console.error('Database error: ', err);
        res.status(500).send('Server error');
    }  
}