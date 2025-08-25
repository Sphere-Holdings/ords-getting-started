--  DEFINE MODULE
BEGIN
    ORDS.DEFINE_MODULE(
        p_module_name => 'user',
        p_base_path => '/user/',
        p_items_per_page=> 25,
        p_status => 'PUBLISHED',
        p_comments=> ''
    );
    COMMIT;
END;

