import {pool} from '../config/db.js';

export async function show(req, res, next){
    try{
        // get the userId from the middleware
        const user_id = req.user.userId;

        // get total points for the user
        const sumPointsResult = await pool.query(
            'SELECT COALESCE(SUM(points), 0) AS sum_points FROM gamification WHERE user_id = $1',
            [user_id]
        );

        const sumPoints = sumPointsResult.rows[0].sum_points;
        
        let badge_name = '';
        let icon = '';

            if (sumPoints >= 300) {
                badge_name = 'Gold Achiever';
                icon = '🥇';
            } 
            else if (sumPoints >= 200) {
                badge_name = 'Silver Achiever';
                icon = '🥈';
            }
            else if (sumPoints >= 100) {
                badge_name = 'Bronze Achiever';
                icon = '🥉';
            } else {
                badge_name = 'Keep Going!';
                icon = '🏅';
            }
                
        // get all gamification history for the user
        const result = await pool.query(
            'SELECT id, points, badge_name, icon, date_earned FROM gamification WHERE user_id = $1 ORDER BY date_earned DESC',
            [user_id]
        );

        // convert to AU/Sydney timezone
        const progress = result.rows.map((item) => {
            const localTime = new Date(item.date_earned).toLocaleString('en-AU', {timeZone: 'Australia/Sydney'});
            return {...item, date_earned: localTime};
        });
        

        res.render('gamification', {
            title: 'Gamification Page', 
            progress, 
            totalPoints: sumPoints,
            badge_name,
            icon
        });
    
    }  catch (err) {
        console.error('Database error: ', err);
        res.status(500).send('Server error');
    }  
}