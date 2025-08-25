create or replace FUNCTION hr.access_predicate(
            schema_p IN VARCHAR2,
            table_p IN VARCHAR2
        )
        RETURN VARCHAR2
        AS
            access_pred VARCHAR2(4000) := '1=2';
        BEGIN
            access_pred := 'LENGTH(SYS_CONTEXT(''ords_ctx'', ''auth0_id'')) > 10';
            RETURN access_pred;
        EXCEPTION
            WHEN OTHERS THEN
                -- Log the error
                dbms_output.put_line('Error in access predicate: ' || SQLERRM);
                -- Return a safe default
                RETURN '1=2';
        END;