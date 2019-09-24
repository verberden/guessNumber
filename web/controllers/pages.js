const digits = 4;

module.exports = ({ models }) => {
  const Result = models.result;
  function generateRandomDigit({ inputMin = 0, inputMax = 9 }) {
    let min = Number(inputMin);
    let max = Number(inputMax);
    if (Number.isNaN(min) || min < 0) {
      min = 0;
    }

    if (Number.isNaN(max) || max > 9) {
      max = 9;
    }

    return Math.floor(Math.random() * (max - min)) + min;
  }

  return {
    index: async (req, res, next) => {
      try {
        let setNumber = '';
        if (!req.session.number) {
          for (let i = 1; i <= digits; i++) {
            setNumber = `${setNumber}${generateRandomDigit({})}`;
            req.session.number = setNumber;
          }
        } else {
          setNumber = req.session.number;
        }

        res.render('pages/index', {
          title: 'Main',
          setNumber,
        });
      } catch (err) {
        next(err);
      }
    },
  };
};
