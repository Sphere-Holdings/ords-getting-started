BEGIN
DBMS_RLS.ADD_POLICY (
        object_schema => 'HR',
        object_name => 'EMPLOYEES',
        policy_name => 'ACCESS_PREDICATE',
        function_schema => 'HR',
        policy_function => 'ACCESS_PREDICATE',
        statement_types => 'select',
        policy_type => DBMS_RLS.CONTEXT_SENSITIVE,
        namespace => 'ords_ctx',
        attribute => 'auth0_id');
END;
/