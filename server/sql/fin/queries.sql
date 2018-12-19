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
     constants (account_id, interval_year) AS (
       VALUES (1800,
               date_trunc('year', to_timestamp('2018-06-01 00:00:00.000', 'YYYY-MM-DD HH24:MI:SS.MS')))
     )
SELECT ((
          SELECT COALESCE(SUM(amount), 0) as balance
          FROM fin_transaction
          WHERE fin_transaction.valid = 1
            AND fin_transaction.created_on > ((SELECT interval_year FROM constants) + interval '3 hours')
            AND fin_transaction.created_on < ((SELECT interval_year FROM constants) + interval '1 year' - interval '3 hours')
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
            AND fin_transaction.created_on > ((SELECT interval_year FROM constants) + interval '3 hours')
            AND fin_transaction.created_on < ((SELECT interval_year FROM constants) + interval '1 year' - interval '3 hours')
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

        WITH constants (category_id, "from", "to") AS (
          VALUES (3,
                  to_timestamp('2018-06-01 00:00:00.000', 'YYYY-MM-DD HH24:MI:SS.MS'),
                  to_timestamp('2018-12-01 00:00:00.000', 'YYYY-MM-DD HH24:MI:SS.MS'))
        )
        SELECT id,
               name,
               ((
                  SELECT COALESCE(SUM(amount), 0) as balance
                  FROM fin_transaction
                  WHERE fin_transaction.valid = 1
                    AND fin_transaction.created_on > (SELECT "from" FROM constants)
                    AND fin_transaction.created_on < (SELECT "to" FROM constants)
                    AND (CASE
                           WHEN (
                                  SELECT active
                                  FROM fin_account
                                         JOIN fin_category on fin_account.category_id = fin_category.id
                                  WHERE fin_account.id = fa.id) = 1
                             THEN fin_transaction.account
                           ELSE fin_transaction.contra_account
                    END) = fa.id
                ) - (
                  SELECT COALESCE(SUM(amount), 0) as balance
                  FROM fin_transaction
                  WHERE fin_transaction.valid = 1
                    AND fin_transaction.created_on > (SELECT "from" FROM constants)
                    AND fin_transaction.created_on < (SELECT "to" FROM constants)
                    AND (CASE
                           WHEN (
                                  SELECT active
                                  FROM fin_account
                                         JOIN fin_category on fin_account.category_id = fin_category.id
                                  WHERE fin_account.id = fa.id) = 1
                             THEN fin_transaction.contra_account
                           ELSE fin_transaction.account
                    END) = fa.id
                ))
        FROM fin_account AS fa
        WHERE fa.category_id = (SELECT category_id FROM constants);