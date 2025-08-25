-- DEFINE HANDLER
BEGIN
    ORDS.DEFINE_HANDLER(
        p_module_name => 'user',
        p_pattern => 'current_user',
        p_method => 'GET',
        p_source_type => ords.source_type_collection_feed,
        p_source => 'SELECT :CURRENT_USER as current_user from dual;',
        p_items_per_page => 25,
        p_comments => ''
    );
    COMMIT;
END;

