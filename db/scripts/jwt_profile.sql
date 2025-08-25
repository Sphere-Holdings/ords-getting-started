BEGIN
    OAUTH.CREATE_JWT_PROFILE(
        p_issuer => 'https://dev-crbnelements.us.auth0.com/',
        p_audience => 'https://ga9da7877d7b6c5-gettingstartedguide.adb.us-ashburn-1.oraclecloudapps.com/' ,
        p_jwk_url =>'https://dev-crbnelements.us.auth0.com/.well-known/jwks.json'
    );
    commit;
END;