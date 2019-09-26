const {
  noun,
} = require('plural-ru');
const queryString = require('query-string');
const Schems = require('../schems/index');

const digits = 4;

module.exports = ({ models }) => {
  const Result = models.result;

  function generateRandomNumber() {
    // eslint-disable-next-line no-restricted-properties
    const number = Math.floor(Math.random() * Math.pow(10, (digits || 1)));
    return number.toString().padStart(digits, '0');
  }

  function paginationOffset(maxBtnCount, page, pagesCount) {
    let diff;
    let startPage = 1;
    let endPage = maxBtnCount;
    if (pagesCount <= maxBtnCount) return { startPage, endPage: pagesCount };
    if (page > Math.floor(maxBtnCount / 2) && (page + Math.floor(maxBtnCount / 2)) < pagesCount) {
      diff = (page - Math.ceil(maxBtnCount / 2) + 1);
      startPage = diff;
      endPage += (diff - 1);
    } else if ((page + Math.floor(maxBtnCount / 2)) >= pagesCount) {
      startPage = (pagesCount - maxBtnCount + 1);
      endPage = pagesCount;
    }

    return {
      startPage,
      endPage,
    };
  }

  function ifParamTypeObject(paramName, paramObject) {
    const newParamObject = {};
    let url = '';
    for (const key in paramObject) {
      if (Object.prototype.hasOwnProperty.call(paramObject, key)) {
        if (!Array.isArray(paramObject[key])) {
          newParamObject[`${paramName}[${key}]`] = paramObject[key];
        } else {
          url += `${queryString.stringify({ [`${paramName}[${key}]`]: paramObject[key] }, { arrayFormat: 'bracket' })}&`;
        }
      }
    }

    return `${queryString.stringify(newParamObject)}&${url}`;
  }

  function replaceUrlQueryParams(assignedParams = {}) {
    let url = '';
    const { baseUrl, path, query } = this.req;
    const reAssignedParams = { ...query, ...assignedParams };
    for (const param in reAssignedParams) {
      if (Object.prototype.hasOwnProperty.call(reAssignedParams, param)) {
        if ((typeof reAssignedParams[param] === 'string') || (typeof reAssignedParams[param] === 'number')) {
          url += `${param}=${reAssignedParams[param]}&`;
        } else if (typeof reAssignedParams[param] === 'object') {
          url += ifParamTypeObject(param, reAssignedParams[param]);
        }
      }
    }

    return `${baseUrl}${path}?${url.slice(0, -1)}`;
  }

  return {
    index: async (req, res, next) => {
      try {
        const setNumber = req.session.number;

        if (!setNumber) {
          req.session.number = generateRandomNumber();
          req.session.attempts = 0;
        }

        res.render('pages/index', {
          title: 'Угадай число',
          csrfToken: req.csrfToken(),
          attempts: req.session.attempts,
        });
      } catch (err) {
        next(err);
      }
    },
    regenerate: async (req, res, next) => {
      try {
        req.session.isGuessed = false;
        req.session.number = generateRandomNumber();
        req.session.attempts = 0;
        res.redirect('/');
      } catch (err) {
        next(err);
      }
    },
    show: async (req, res, next) => {
      try {
        let { page } = req.query;
        page = page ? parseInt(page, 10) : 1;
        const query = {
          limit: 10,
        };
        query.offset = (page - 1) * query.limit;
        query.order = [['attempts', 'ASC']];
        const data = await Result.findAndCountAll(query);

        const results = {
          entries: data.rows,
          count: data.count,
          page,
          perPage: query.limit,
          pagesCount: Math.ceil(data.count / query.limit),
          paginationOffset,
          req: {
            baseUrl: req.baseUrl,
            path: req.path,
            query: req.query,
          },
        };
        results.replaceUrlQueryParams = replaceUrlQueryParams.bind(results);

        res.render('pages/show', {
          title: 'Результаты',
          results,
        });
      } catch (err) {
        next(err);
      }
    },
    new: async (req, res, next) => {
      try {
        const { error, value } = Schems.name.validate(req.body.result);

        if (!error && req.session.isGuessed) {
          const { name } = value;
          if (name) {
            await Result.create({
              name: name.trim(),
              attempts: req.session.attempts,
            });
          }
          req.session.attempts = 0;
          req.session.number = undefined;
          req.session.isGuessed = false;

          res.json({ status: true, location: '/results' });
        } else {
          res.json({ status: false, message: error.details[0].message });
        }
      } catch (err) {
        next(err);
      }
    },
    check: async (req, res, next) => {
      try {
        const { error } = Schems.number.validate(req.body);

        if (!error && req.session.isGuessed) {
          res.json({ status: true, message: `Вы угадали загаданное число за ${req.session.attempts} ${noun(+req.session.attempts, 'попытку', 'попытки', 'попыток')}` });
        } else if (!error && req.session.number) {
          req.session.attempts += 1;
          const generatedDigits = req.session.number.split('');
          const inputDigits = req.body.guessNumber.split('');
          const matches = {};
          const results = [];
          let successResult = '';
          for (let i = 0; i < digits; i++) {
            results.push('X');
            successResult += 'B';
          }

          inputDigits.forEach((digit) => {
            const indexies = generatedDigits.reduce(
              (acc, el, i) => (el === digit ? [...acc, i] : acc), [],
            );
            if (indexies.length) {
              matches[digit] = {
                indexies, // сами индексы вхождений
                count: indexies.length, // количество вхождений
              };
            }
          });

          // eslint-disable-next-line guard-for-in
          for (const key in matches) { // проверяем на точное совпадение
            matches[key].indexies.forEach((index) => {
              if (inputDigits[index] === key) {
                results[index] = 'B';
                matches[key].count -= 1;
              }
            });
          }

          // проверяем на неточное вхождение и обновляем количество
          inputDigits.forEach((digit, index) => {
            if (results[index] !== 'B' && matches[digit] && matches[digit].count) {
              results[index] = 'K';
              matches[digit].count -= 1;
            }
          });

          const result = results.join('');
          let status = false;
          let message = '';

          if (result === successResult) {
            req.session.isGuessed = true;
            status = true;
            message = `Вы угадали загаданное число за ${req.session.attempts} ${noun(+req.session.attempts, 'попытку', 'попытки', 'попыток')}`;
          }

          res.json({
            result, status, message,
          });
        } else {
          res.json({ status: false, message: error ? error.details[0].message : 'Oops something goes wrong' });
        }
      } catch (err) {
        next(err);
      }
    },
  };
};
