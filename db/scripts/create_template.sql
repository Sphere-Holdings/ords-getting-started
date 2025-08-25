--  DEFINE TEMPLATE
BEGIN
    ORDS.DEFINE_TEMPLATE(
        p_module_name => 'user',
        p_pattern => 'current_user',
        p_priority => 0,
        p_etag_type => 'HASH',
        p_comments => ''
    );
    COMMIT;
END;

