create or replace procedure HR.set_security_proc(p_auth0_id in varchar2) is
    begin
        DBMS_SESSION.SET_CONTEXT(
            namespace  => 'ords_ctx',
            attribute  => 'auth0_id',
            value      => p_auth0_id
        );
    END;
/
create or replace context ords_ctx using HR.set_security_proc;

grant execute on HR.set_security_proc to HR;