-- Set-up the identity_hook function that is used as a pre-hook in ORDS.
create or replace function HR.identity_hook return boolean as
    ords_current_user varchar2(255);
begin
  -- Call the Custom Auth API to determine the identity.
  ords_current_user := owa_util.get_cgi_env('REMOTE_IDENT');;
    if ords_current_user is not null then
       -- Ensure headers are set properly.
        owa_util.status_line(200, 'OK', FALSE);
        -- Make sure that the ORDS headers are set right.
        htp.prn('X-ORDS-HOOK-USER: ' || ords_current_user);
        -- Set auth0_id to the current user.
        set_security_proc(ords_current_user);
      return true;
    else
      -- Use this if we need to use the ORDS online for the DB as true.
      return true;
    end if;

end;
/
-- Ensure that everyone can call the identity_hook.
grant execute on HR.identity_hook to public;