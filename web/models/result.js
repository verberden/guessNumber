module.exports = ({ dbs: { guess_number: guessNumber, Sequelize } }) => {
  const Result = guessNumber.define(
    'Result',
    {
      name: Sequelize.STRING,
      attempts: Sequelize.STRING,
    },
    {
      tableName: 'results',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );

  return Result;
};
