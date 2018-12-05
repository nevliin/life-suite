WITH RECURSIVE
     accounts AS (
       SELECT id
       FROM fin_account
       WHERE id = (SELECT account_id FROM constants)
       UNION
       SELECT e.id
       FROM fin_account e
              INNER JOIN accounts s ON s.id = e.parent_account
     ),
     constants (account_id, min_date, max_date) AS (
       VALUES (4000,
               to_timestamp('2018-12-01 00:00:00.000', 'YYYY-MM-DD HH24:MI:SS.MS'),
               to_timestamp('2019-01-01 00:00:00.000', 'YYYY-MM-DD HH24:MI:SS.MS'))
     )
SELECT ((
          SELECT COALESCE(SUM(amount), 0) as balance
          FROM fin_transaction
          WHERE fin_transaction.valid = 1
            AND fin_transaction.created_on > (SELECT min_date FROM constants)
            AND fin_transaction.created_on < (SELECT max_date FROM constants)
            AND (CASE
                   WHEN (
                          SELECT active
                          FROM fin_account
                                 JOIN fin_category on fin_account.category_id = fin_category.id
                          WHERE fin_account.id = (SELECT account_id FROM constants)) = 1
                     THEN fin_transaction.account
                   ELSE fin_transaction.contra_account
            END) IN
                (
                  SELECT *
                  FROM accounts
                )
        ) - (
          SELECT COALESCE(SUM(amount), 0) as balance
          FROM fin_transaction
          WHERE fin_transaction.valid = 1
            AND fin_transaction.created_on > (SELECT min_date FROM constants)
            AND fin_transaction.created_on < (SELECT max_date FROM constants)
            AND (CASE
                   WHEN (
                          SELECT active
                          FROM fin_account
                                 JOIN fin_category on fin_account.category_id = fin_category.id
                          WHERE fin_account.id = (SELECT account_id FROM constants)) = 1
                     THEN fin_transaction.contra_account
                   ELSE fin_transaction.account
            END) IN (
                  SELECT *
                  FROM accounts
                )
        ));