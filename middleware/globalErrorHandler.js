module.exports = (err, req, res, next) => {

    // API / AJAX request
    if (
        req.xhr ||
        req.headers.accept?.includes('application/json')
    ) {
        return res.status(500).json({
            success: false,
            message:err.message || 'Internal server error'
        });
    }

    // Normal browser request
    return res.status(500).render('500',{
        err
    });

};