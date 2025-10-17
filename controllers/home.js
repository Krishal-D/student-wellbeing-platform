export async function index(req, res, next) {
    const welcomeType = req.cookies?.welcome || null;
    // one-shot cookie: clear after read so subsequent visits are 'back'
    if (welcomeType) {
        res.clearCookie('welcome');
    }
    res.render('home', { title: 'Wellbeing Hub', welcomeType });
}

