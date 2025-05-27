const renderHome = (req, res) => {
    res.render('index', { title: 'TradeNShare' });
};

module.exports = { renderHome };