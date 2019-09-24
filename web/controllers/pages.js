module.exports = ({ models }) => {
  const Result = models.result;

  return {
    index: async (req, res, next) => {
      try {
        
        res.render('pages/index', {
          title: 'Main',
        });
      } catch (err) {
        next(err);
      }
    },
  };
};
